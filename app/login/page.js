import LoginClient from "@/components/LoginClient";

export default async function LoginPage({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  return (
    <LoginClient initialErrorCode={resolvedSearchParams?.error || ""} />
  );
}
 