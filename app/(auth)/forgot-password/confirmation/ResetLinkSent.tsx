"use client";

import { Button } from "@/components/common/button";
import Link from "next/link";

export default function ResetLinkSent() {
  return (
    <div className="w-full space-y-6 text-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Reset password link sent.</h1>
        <p className="text-gray-500">
          Please follow the password reset instructions we sent to your email.
        </p>
      </div>

      <div className="pt-4">
        <Link href="/login">
          <Button className="w-full bg-warm-200 hover:bg-warm-300 mt-4">
            Back to log in
          </Button>
        </Link>
      </div>
    </div>
  );
}
