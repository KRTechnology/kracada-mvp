import { Suspense } from "react";
import { Metadata } from "next";
import UserManagementContent from "./UserManagementContent";
import { Users } from "lucide-react";

export const metadata: Metadata = {
  title: "User Management | Admin Dashboard",
  description: "Manage users and their accounts",
};

export default function UserManagementPage() {
  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-warm-200 via-warm-700 to-warm-800 rounded-2xl p-8 shadow-lg">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">User Management</h1>
          </div>
          <p className="text-warm-50 text-lg">
            View and manage all users and their accounts
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-700"></div>
          </div>
        }
      >
        <UserManagementContent />
      </Suspense>
    </div>
  );
}
