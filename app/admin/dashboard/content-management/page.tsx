export default function ContentManagementPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100">
          Content Management
        </h1>
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-warm-200 text-xs text-white font-medium">
          8
        </span>
      </div>
      <p className="text-neutral-600 dark:text-neutral-400">
        Manage and moderate platform content
      </p>

      <div className="bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700 p-8 text-center">
        <p className="text-neutral-600 dark:text-neutral-400">
          This feature is coming soon...
        </p>
      </div>
    </div>
  );
}
