import Link from "next/link";
import { redirect } from "next/navigation";
import { authService } from "@/lib/auth/auth-service";
import { Button } from "@/components/common/button";

export default async function VerifyEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const pageParams = await searchParams;

  if (!pageParams.token) {
    redirect("/login");
  }

  // Verify the token
  const verified = await authService.verifyEmail(pageParams.token);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg">
        <div className="flex flex-col items-center text-center">
          {verified ? (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-4">Email Verified!</h1>
              <p className="text-gray-600 mb-8">
                Thank you for verifying your email. Your account is now active.
              </p>
            </>
          ) : (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-4">Verification Failed</h1>
              <p className="text-gray-600 mb-8">
                The verification link is invalid or has expired. Please request
                a new verification link.
              </p>
            </>
          )}

          <Button asChild className="bg-warm-200 hover:bg-warm-300">
            <Link href="/login">Go to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
