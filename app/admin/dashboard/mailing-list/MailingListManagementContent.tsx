"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Mail,
  UserCheck,
  UserX,
  Download,
  Trash2,
  MoreVertical,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  getMailingListSubscribersAction,
  getMailingListStatsAction,
  deleteSubscriberAction,
  bulkSubscriberActionAction,
  exportSubscribersAction,
} from "@/app/(dashboard)/actions/mailing-list-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/common/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/common/dropdown-menu";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { Spinner } from "@/components/common/spinner";
import { Pagination } from "@/components/specific/dashboard/Pagination";

interface Subscriber {
  id: string;
  email: string;
  status: "active" | "unsubscribed" | "bounced";
  source: "news_page" | "homepage" | "footer" | "popup" | "other";
  subscribedAt: Date;
  unsubscribedAt: Date | null;
  lastEmailSentAt: Date | null;
  emailsSentCount: string;
  isVerified: boolean;
  ipAddress: string | null;
  userAgent: string | null;
  tags: string | null;
  metadata: string | null;
  updatedAt: Date;
}

interface Stats {
  total: number;
  active: number;
  unsubscribed: number;
  bounced: number;
  verified: number;
  unverified: number;
  sourceStats: Array<{ source: string; count: number }>;
  recentStats: {
    last7Days: number;
    last30Days: number;
  };
}

export default function MailingListManagementContent() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] =
    useState<Subscriber | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Export selection state (mirrors UserManagement pattern)
  const [isExportMode, setIsExportMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isExporting, setIsExporting] = useState(false);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm.toLowerCase());
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter, sourceFilter]);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch subscribers with server-side filtering and pagination
  useEffect(() => {
    fetchSubscribers();
  }, [currentPage, debouncedSearchTerm, statusFilter, sourceFilter]);

  const fetchStats = async () => {
    const result = await getMailingListStatsAction();
    if (result.success && result.data) {
      setStats(result.data as Stats);
    }
  };

  const fetchSubscribers = async () => {
    setIsLoading(true);
    const result = await getMailingListSubscribersAction({
      page: currentPage,
      limit: 10,
      status: statusFilter !== "all" ? (statusFilter as any) : undefined,
      source: sourceFilter !== "all" ? (sourceFilter as any) : undefined,
      search: debouncedSearchTerm || undefined,
    });

    if (result.success && result.data) {
      setSubscribers(result.data.subscribers as Subscriber[]);
      setTotalPages(result.data.pagination.totalPages);
      setTotalCount(result.data.pagination.total);
    } else {
      toast.error("Failed to load subscribers");
    }
    setIsLoading(false);
  };

  // ─── Export helpers ────────────────────────────────────────────────────────

  function downloadSubscribersAsCSV(subs: Subscriber[]) {
    const headers = ["Email", "Status", "Source", "Subscribed At", "Verified"];
    const rows = subs.map((sub) => [
      sub.email,
      sub.status,
      sub.source,
      format(new Date(sub.subscribedAt), "yyyy-MM-dd HH:mm:ss"),
      sub.isVerified ? "Yes" : "No",
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) =>
        row
          .map((cell) => {
            const s = String(cell);
            return s.includes(",") || s.includes('"') || s.includes("\n")
              ? `"${s.replace(/"/g, '""')}"`
              : s;
          })
          .join(","),
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `mailing-list-${format(new Date(), "yyyy-MM-dd")}.csv`,
    );
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * First click  → enter selection mode
   * Second click → validate selection then export
   */
  function handleExportClick() {
    if (!isExportMode) {
      setIsExportMode(true);
      setSelectedIds(new Set());
      return;
    }

    if (selectedIds.size === 0) {
      toast.warning("Please select at least one subscriber to export.");
      return;
    }

    const selected = subscribers.filter((s) => selectedIds.has(s.id));
    downloadSubscribersAsCSV(selected);

    setIsExportMode(false);
    setSelectedIds(new Set());
    toast.success("Mailing list exported successfully!");
  }

  function cancelExportMode() {
    setIsExportMode(false);
    setSelectedIds(new Set());
  }

  function toggleSelectAll(checked: boolean) {
    setSelectedIds(checked ? new Set(subscribers.map((s) => s.id)) : new Set());
  }

  function toggleSelectOne(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  const allSelected =
    subscribers.length > 0 && subscribers.every((s) => selectedIds.has(s.id));

  // ─── Status / source badges ────────────────────────────────────────────────

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: {
        label: "Active",
        icon: CheckCircle,
        color:
          "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 border border-green-300 dark:border-green-700",
      },
      unsubscribed: {
        label: "Unsubscribed",
        icon: XCircle,
        color:
          "text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600",
      },
      bounced: {
        label: "Bounced",
        icon: AlertCircle,
        color:
          "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 border border-red-300 dark:border-red-700",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    const Icon = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <Icon className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getSourceBadge = (source: string) => {
    const sourceLabels: Record<string, string> = {
      news_page: "News Page",
      lifestyle_page: "Lifestyle Page",
      homepage: "Homepage",
      footer: "Footer",
      popup: "Popup",
      other: "Other",
    };

    return (
      <span className="px-2 py-1 text-xs bg-warm-100 dark:bg-warm-900/30 text-warm-700 dark:text-warm-300 rounded-md font-medium">
        {sourceLabels[source] || source}
      </span>
    );
  };

  // ─── Delete ────────────────────────────────────────────────────────────────

  const handleDeleteClick = (subscriber: Subscriber) => {
    setSubscriberToDelete(subscriber);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!subscriberToDelete) return;

    setIsDeleting(true);
    const result = await deleteSubscriberAction(subscriberToDelete.id);

    if (result.success) {
      toast.success("Subscriber deleted successfully");
      setIsDeleteModalOpen(false);
      setSubscriberToDelete(null);
      fetchSubscribers();
      fetchStats();
    } else {
      toast.error(result.message || "Failed to delete subscriber");
    }
    setIsDeleting(false);
  };

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-warm-200 via-warm-700 to-warm-800 rounded-2xl p-8 shadow-lg">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Mailing List Management
          </h1>
          <p className="text-warm-50 text-lg">
            Manage newsletter subscribers and email campaigns
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24" />
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-warm-100 dark:border-neutral-700 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Total Subscribers
                </p>
                <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                  {stats.total}
                </p>
              </div>
              <div className="w-12 h-12 bg-warm-100 dark:bg-warm-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-warm-600 dark:text-warm-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-green-100 dark:border-green-900/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Active
                </p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {stats.active}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <UserCheck className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-orange-100 dark:border-orange-900/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Last 7 Days
                </p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {stats.recentStats.last7Days}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-purple-100 dark:border-purple-900/30 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                  Last 30 Days
                </p>
                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {stats.recentStats.last30Days}
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 p-6 shadow-sm">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-warm-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="unsubscribed">Unsubscribed</option>
            <option value="bounced">Bounced</option>
          </select>

          {/* Source Filter */}
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-warm-500 focus:border-transparent"
          >
            <option value="all">All Sources</option>
            <option value="news_page">News Page</option>
            <option value="lifestyle_page">Lifestyle Page</option>
            <option value="homepage">Homepage</option>
            <option value="footer">Footer</option>
            <option value="popup">Popup</option>
            <option value="other">Other</option>
          </select>

          {/* Export Button — two-step pattern from UserManagement */}
          <div className="flex items-center gap-2">
            {isExportMode && (
              <Button
                variant="outline"
                onClick={cancelExportMode}
                className="border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200"
              >
                Cancel
              </Button>
            )}
            <Button
              onClick={handleExportClick}
              disabled={isExporting}
              className={
                isExportMode && selectedIds.size > 0
                  ? "bg-green-600 hover:bg-green-700 text-white shadow-md border-0"
                  : "bg-gradient-to-r from-warm-200 to-warm-700 text-white hover:shadow-lg border-0"
              }
            >
              {isExporting ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="w-4 h-4 mr-2" />
                  {isExportMode
                    ? selectedIds.size > 0
                      ? `Export (${selectedIds.size})`
                      : "Export"
                    : "Export CSV"}
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Subscribers Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-700" />
          </div>
        ) : subscribers.length === 0 ? (
          <div className="text-center py-12">
            <Mail className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              No subscribers found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400">
              {searchTerm || statusFilter !== "all" || sourceFilter !== "all"
                ? "Try adjusting your filters"
                : "No one has subscribed yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-warm-50 to-orange-50 dark:from-neutral-900 dark:to-neutral-800 border-b-2 border-warm-200 dark:border-warm-800">
                <tr>
                  {/* Checkbox column — only visible in export mode */}
                  {isExportMode && (
                    <th className="px-4 py-4 text-left w-12">
                      <input
                        type="checkbox"
                        checked={allSelected}
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        className="h-4 w-4 text-warm-600 focus:ring-warm-500 border-neutral-300 rounded cursor-pointer"
                      />
                    </th>
                  )}
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
                    Source
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
                    Verified
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
                    Subscribed
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 dark:divide-neutral-700">
                {subscribers.map((subscriber, index) => (
                  <tr
                    key={subscriber.id}
                    className={`hover:bg-warm-50/50 dark:hover:bg-neutral-800/50 transition-all duration-200 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-neutral-800"
                        : "bg-neutral-50/30 dark:bg-neutral-850/30"
                    }`}
                  >
                    {/* Per-row checkbox — only visible in export mode */}
                    {isExportMode && (
                      <td className="px-4 py-4">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(subscriber.id)}
                          onChange={() => toggleSelectOne(subscriber.id)}
                          className="h-4 w-4 text-warm-600 focus:ring-warm-500 border-neutral-300 rounded cursor-pointer"
                        />
                      </td>
                    )}
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-neutral-900 dark:text-white">
                          {subscriber.email}
                        </span>
                        {subscriber.emailsSentCount !== "0" && (
                          <span className="text-xs text-neutral-500 dark:text-neutral-400">
                            {subscriber.emailsSentCount} emails sent
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(subscriber.status)}
                    </td>
                    <td className="px-4 py-4">
                      {getSourceBadge(subscriber.source)}
                    </td>
                    <td className="px-4 py-4">
                      {subscriber.isVerified ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-gray-400 dark:text-gray-600" />
                      )}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {format(
                            new Date(subscriber.subscribedAt),
                            "MMM dd, yyyy",
                          )}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {format(new Date(subscriber.subscribedAt), "h:mm a")}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(subscriber)}
                            className="text-red-600 dark:text-red-400"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!isLoading && totalPages > 1 && (
          <div className="px-6 py-4 border-t border-warm-100 dark:border-neutral-700">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={(page) => {
                setCurrentPage(page);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subscriber</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{subscriberToDelete?.email}"?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Spinner className="w-4 h-4 mr-2" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
