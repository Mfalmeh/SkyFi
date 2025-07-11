import { NextResponse } from "next/server"
import { randomUUID } from "crypto"

const MTN_MOMO_BASE_URL = process.env.MTN_MOMO_BASE_URL
const MTN_MOMO_OCP_APIM_SUBSCRIPTION_KEY = process.env.MTN_MOMO_OCP_APIM_SUBSCRIPTION_KEY
const MTN_MOMO_API_USER_ID = process.env.MTN_MOMO_API_USER_ID
const MTN_MOMO_API_USER_SECRET = process.env.MTN_MOMO_API_USER_SECRET

if (!MTN_MOMO_BASE_URL || !MTN_MOMO_OCP_APIM_SUBSCRIPTION_KEY || !MTN_MOMO_API_USER_ID || !MTN_MOMO_API_USER_SECRET) {
  console.error("Missing MTN MoMo environment variables!")
  // In a production app, you might want to throw an error or handle this more gracefully.
}

async function generateAccessToken() {
  if (!MTN_MOMO_BASE_URL || !MTN_MOMO_API_USER_ID || !MTN_MOMO_API_USER_SECRET || !MTN_MOMO_OCP_APIM_SUBSCRIPTION_KEY) {
    throw new Error("MTN MoMo authentication environment variables are not set.")
  }

  const authString = Buffer.from(`${MTN_MOMO_API_USER_ID}:${MTN_MOMO_API_USER_SECRET}`).toString("base64")

  try {
    const response = await fetch(`${MTN_MOMO_BASE_URL}/collection/token/`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Ocp-Apim-Subscription-Key": MTN_MOMO_OCP_APIM_SUBSCRIPTION_KEY,
      },
      body: "grant_type=client_credentials",
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Failed to generate MTN MoMo access token:", response.status, errorText)
      throw new Error(`Failed to generate access token: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Error generating MTN MoMo access token:", error)
    throw error
  }
}

export async function POST(req: Request) {
  try {
    if (!MTN_MOMO_BASE_URL || !MTN_MOMO_OCP_APIM_SUBSCRIPTION_KEY) {
      return NextResponse.json({ error: "MTN MoMo API environment variables are not set." }, { status: 500 })
    }

    const { amount, phoneNumber, packageId } = await req.json()

    if (!amount || !phoneNumber || !packageId) {
      return NextResponse.json({ error: "Missing amount, phoneNumber, or packageId" }, { status: 400 })
    }

    const accessToken = await generateAccessToken()
    const referenceId = randomUUID() // Unique ID for this transaction

    const requestBody = {
      amount: String(amount), // Amount must be a string
      currency: "EUR", // Changed to EUR for MTN sandbox
      externalId: String(packageId),
      payer: {
        partyIdType: "MSISDN",
        partyId: phoneNumber,
      },
      payerMessage: `Payment for SkyFi ${packageId} package`,
      payeeNote: `SkyFi WiFi Package: ${packageId}`,
    }

    const response = await fetch(`${MTN_MOMO_BASE_URL}/collection/v1_0/requesttopay`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Reference-Id": referenceId,
        "X-Target-Environment": "sandbox",
        "Ocp-Apim-Subscription-Key": MTN_MOMO_OCP_APIM_SUBSCRIPTION_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })

    if (response.status === 202) {
      // Accepted
      return NextResponse.json(
        {
          success: true,
          message: "Payment request initiated successfully.",
          referenceId: referenceId,
          status: "PENDING",
        },
        { status: 202 },
      )
    } else {
      const errorText = await response.text()
      console.error("MTN MoMo requestToPay failed:", response.status, errorText)
      return NextResponse.json(
        {
          success: false,
          message: `Failed to initiate payment: ${response.statusText} - ${errorText}`,
        },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 })
  }
}
