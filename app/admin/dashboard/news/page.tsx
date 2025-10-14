export default function NewsManagementPage() {
  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-warm-200 via-warm-700 to-warm-800 rounded-2xl p-8 shadow-lg">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            News Management
          </h1>
          <p className="text-warm-50 text-lg">
            Create, edit, and manage news articles
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
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
            News Management
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            Create and manage news articles, approve submissions, and moderate
            content.
          </p>
          <div className="inline-flex items-center px-4 py-2 bg-warm-50 dark:bg-warm-900/20 border border-warm-200/30 dark:border-warm-700/30 rounded-lg text-sm text-warm-700 dark:text-warm-300 font-medium">
            Coming Soon
          </div>
        </div>
      </div>
    </div>
  );
}
