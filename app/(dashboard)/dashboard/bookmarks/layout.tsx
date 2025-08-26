import { BookmarksNavigation } from "@/components/specific/dashboard/BookmarksNavigation";

export default function BookmarksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-6">
      {/* Bookmarks Sub-Navigation */}
      <BookmarksNavigation />

      {/* Sub-tab Content */}
      {children}
    </div>
  );
}
