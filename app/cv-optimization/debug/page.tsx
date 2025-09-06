"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

export default function DebugPage() {
  const { data: session } = useSession();
  const [envVars, setEnvVars] = useState<any>({});
  const [dbTest, setDbTest] = useState<string>("Testing...");

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ? "✅ Set" : "❌ Missing",
      // Can't check secret key from client side
    });

    // Test database connection
    testDatabase();
  }, []);

  const testDatabase = async () => {
    try {
      const response = await fetch("/api/test-db", { method: "GET" });
      const result = await response.json();
      setDbTest(result.success ? "✅ Database connected" : `❌ ${result.error}`);
    } catch (error) {
      setDbTest(`❌ Database error: ${error}`);
    }
  };

  const testPayment = async () => {
    if (!session?.user) {
      alert("Please login first");
      return;
    }

    try {
      // Test creating an order
      const { createCVOptimizationOrder } = await import("@/app/(dashboard)/actions/cv-optimization-actions");
      const testRef = `test_${Date.now()}`;
      
      const result = await createCVOptimizationOrder("deluxe", testRef);
      
      if (result.success) {
        alert(`✅ Order created successfully! Order ID: ${result.orderId}`);
      } else {
        alert(`❌ Order creation failed: ${result.error}`);
      }
    } catch (error) {
      alert(`❌ Error: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">CV Optimization Debug Page</h1>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Environment Check</h2>
          <div className="space-y-2">
            <p>Paystack Public Key: {envVars.publicKey}</p>
            <p>Database Status: {dbTest}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Session Info</h2>
          <div className="space-y-2">
            <p>User Logged In: {session?.user ? "✅ Yes" : "❌ No"}</p>
            <p>User ID: {session?.user?.id || "N/A"}</p>
            <p>User Email: {session?.user?.email || "N/A"}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Test Functions</h2>
          <button 
            onClick={testPayment}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Test Order Creation
          </button>
        </div>

        <div className="bg-white dark:bg-neutral-800 p-4 rounded-lg">
          <h2 className="text-lg font-semibold mb-3">Debug URLs</h2>
          <div className="space-y-2 text-sm">
            <p>Webhook URL: https://www.kracada-dev.vercel.app/api/webhooks/paystack</p>
            <p>Callback URL: https://www.kracada-dev.vercel.app/cv-optimization/upload</p>
            <p className="text-yellow-600">⚠️ Note: Callback URL should not be needed with our current implementation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
