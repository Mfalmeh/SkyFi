import PackagesContent from "@/components/packages-content"
// Removed getSafeSession and redirect as this page should be public

export default async function PackagesPage() {
  // The packages page should be accessible without authentication.
  // No session check or redirection is needed here.
  return <PackagesContent />
}
