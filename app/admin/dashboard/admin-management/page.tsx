import { Suspense } from "react";
import CreateAdminForm from "./CreateAdminForm";

export default function AdminManagementPage() {
  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-warm-200 via-warm-700 to-warm-800 rounded-2xl p-8 shadow-lg">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Admin Management
          </h1>
          <p className="text-warm-50 text-lg">
            Create and manage admin accounts for the platform
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <CreateAdminForm />
      </Suspense>
    </div>
  );
}
