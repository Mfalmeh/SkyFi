import { NextResponse } from "next/server"

const MTN_MOMO_BASE_URL = process.env.MTN_MOMO_BASE_URL
const MTN_MOMO_OCP_APIM_SUBSCRIPTION_KEY = process.env.MTN_MOMO_OCP_APIM_SUBSCRIPTION_KEY
const MTN_MOMO_API_USER_ID = process.env.MTN_MOMO_API_USER_ID
const MTN_MOMO_API_USER_SECRET = process.env.MTN_MOMO_API_USER_SECRET

if (!MTN_MOMO_BASE_URL || !MTN_MOMO_OCP_APIM_SUBSCRIPTION_KEY || !MTN_MOMO_API_USER_ID || !MTN_MOMO_API_USER_SECRET) {
  console.error("Missing MTN MoMo environment variables for status check!")
}

async function generateAccessToken() {
  if (!MTN_MOMO_BASE_URL || !MTN_MOMO_API_USER_ID || !MTN_MOMO_API_USER_SECRET || !MTN_MOMO_OCP_APIM_SUBSCRIPTION_KEY) {
    throw new Error("MTN MoMo authentication environment variables are not set.")
  }

  const authString = Buffer.from(`${MTN_MOMO_API_USER_ID}:${MTN_MOMO_API_USER_SECRET}`).toString("base64")

  try {
    // Corrected endpoint for token generation with trailing slash
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
      console.error("Failed to generate MTN MoMo access token for status check:", response.status, errorText)
      throw new Error(`Failed to generate access token: ${response.statusText} - ${errorText}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error("Error generating MTN MoMo access token:", error)
    throw error
  }
}

export async function GET(req: Request, { params }: { params: { referenceId: string } }) {
  try {
    if (!MTN_MOMO_BASE_URL || !MTN_MOMO_OCP_APIM_SUBSCRIPTION_KEY) {
      return NextResponse.json({ error: "MTN MoMo API environment variables are not set." }, { status: 500 })
    }

    const { referenceId } = params

    if (!referenceId) {
      return NextResponse.json({ error: "Missing referenceId" }, { status: 400 })
    }

    const accessToken = await generateAccessToken()

    const response = await fetch(`${MTN_MOMO_BASE_URL}/collection/v1_0/requesttopay/${referenceId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Target-Environment": "sandbox",
        "Ocp-Apim-Subscription-Key": MTN_MOMO_OCP_APIM_SUBSCRIPTION_KEY,
      },
    })

    if (response.ok) {
      const data = await response.json()
      return NextResponse.json({ success: true, status: data.status, data: data })
    } else {
      const errorText = await response.text()
      console.error("MTN MoMo requestToPayStatus failed:", response.status, errorText)
      return NextResponse.json(
        {
          success: false,
          message: `Failed to get payment status: ${response.statusText} - ${errorText}`,
        },
        { status: response.status },
      )
    }
  } catch (error) {
    console.error("API route error:", error)
    return NextResponse.json({ success: false, message: "Internal server error." }, { status: 500 })
  }
}
