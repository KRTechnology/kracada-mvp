export default function LifestyleManagementPage() {
  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-warm-200 via-warm-700 to-warm-800 rounded-2xl p-8 shadow-lg">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Lifestyle Management
          </h1>
          <p className="text-warm-50 text-lg">
            Manage lifestyle content, posts, and submissions
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 p-12 text-center shadow-sm">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-warm-100 dark:bg-warm-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-warm-600 dark:text-warm-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
            Lifestyle Management
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Review lifestyle posts, moderate content, and manage submissions
            from users.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-warm-50 dark:bg-warm-900/20 border border-warm-200/30 dark:border-warm-700/30 rounded-lg text-sm text-warm-700 dark:text-warm-300 font-medium">
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}
