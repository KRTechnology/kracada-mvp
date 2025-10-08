import { Logo } from "@/components/common/Logo";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-neutral-50 dark:bg-neutral-900">
      <div className="w-full max-w-md px-8 py-16">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo />
        </div>

        {/* Login Form */}
        <AdminLoginForm />
      </div>
    </div>
  );
}
