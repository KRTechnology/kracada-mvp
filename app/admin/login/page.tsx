import { Logo } from "@/components/common/Logo";
import AdminLoginForm from "./AdminLoginForm";

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-warm-50 via-warm-100 to-peach-50 dark:from-neutral-900 dark:via-warm-900 dark:to-warm-800">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2260%22%20height%3D%2260%22%20viewBox%3D%220%200%2060%2060%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%23FF6F00%22%20fill-opacity%3D%220.05%22%3E%3Ccircle%20cx%3D%2230%22%20cy%3D%2230%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] dark:opacity-20"></div>

      <div className="relative flex min-h-screen items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Card Container */}
          <div className="rounded-2xl bg-white/80 dark:bg-neutral-800/80 backdrop-blur-sm shadow-2xl border border-warm-200/20 dark:border-warm-700/20 p-8">
            {/* Logo */}
            <div className="mb-8 flex justify-center">
              <Logo />
            </div>

            {/* Login Form */}
            <AdminLoginForm />
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-warm-600 dark:text-warm-400">
              Secure admin access to Kracada
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
