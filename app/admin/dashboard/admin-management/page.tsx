import { Suspense } from "react";
import CreateAdminForm from "./CreateAdminForm";

export default function AdminManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Admin Management
        </h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-2">
          Create and manage admin accounts
        </p>
      </div>

      <Suspense fallback={<div>Loading...</div>}>
        <CreateAdminForm />
      </Suspense>
    </div>
  );
}
