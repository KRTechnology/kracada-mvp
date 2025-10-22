"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  getAllUsersAction,
  getAllAdminsAction,
  updateUserStatusAction,
  updateAdminStatusAction,
  deleteUserAction,
  deleteAdminAction,
  updateAdminRoleAction,
} from "./actions";
import {
  Search,
  MoreVertical,
  CheckCircle,
  XCircle,
  Trash2,
  Shield,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Users,
  Briefcase,
  Flag,
  UserCog,
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

type TabType = "all" | "businesses" | "reported" | "admins";

type User = {
  id: string;
  fullName: string;
  email: string;
  accountType: string;
  status: string;
  createdAt: Date;
  emailVerified: boolean;
  hasCompletedProfile: boolean;
};

type Admin = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  status: string;
  createdAt: Date;
  lastLoginAt: Date | null;
};

export default function UserManagementContent() {
  const { data: session } = useSession();
  const isSuperAdmin = (session?.user as any)?.adminRole === "Super Admin";

  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [users, setUsers] = useState<User[]>([]);
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [accountTypeFilter, setAccountTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [counts, setCounts] = useState({
    total: 0,
    jobSeekers: 0,
    recruiters: 0,
    businessOwners: 0,
    contributors: 0,
    flagged: 0,
    superAdmins: 0,
    regularAdmins: 0,
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
    type: "user" | "admin";
  } | null>(null);

  // Fetch data based on active tab
  useEffect(() => {
    fetchData();
  }, [activeTab, search, statusFilter, accountTypeFilter, currentPage]);

  async function fetchData() {
    setLoading(true);
    try {
      if (activeTab === "admins") {
        const result = await getAllAdminsAction({
          search,
          status: statusFilter,
          page: currentPage,
          limit: 10,
        });

        if (result.success && result.admins) {
          setAdmins(result.admins);
          setTotalCount(result.totalCount || 0);
          setTotalPages(result.totalPages || 1);
          setCounts((prev) => ({
            ...prev,
            superAdmins: result.counts?.superAdmins || 0,
            regularAdmins: result.counts?.regularAdmins || 0,
          }));
        }
      } else {
        // Determine account type filter based on tab
        let typeFilter = accountTypeFilter;
        let statusOverride = statusFilter;

        if (activeTab === "businesses") {
          typeFilter = "Business Owner";
        } else if (activeTab === "reported") {
          // For "reported" tab, show only Suspended or Inactive users
          // If statusFilter is "all", show both Suspended and Inactive
          // Otherwise, respect the specific status filter
          if (statusFilter === "all") {
            statusOverride = "flagged"; // This will be a special flag to fetch Suspended OR Inactive
          }
        }

        const result = await getAllUsersAction({
          search,
          status: statusOverride,
          accountType: typeFilter,
          page: currentPage,
          limit: 10,
        });

        if (result.success && result.users) {
          setUsers(result.users);
          setTotalCount(result.totalCount || 0);
          setTotalPages(result.totalPages || 1);
          setCounts((prev) => ({
            ...prev,
            total: result.counts?.total || 0,
            jobSeekers: result.counts?.jobSeekers || 0,
            recruiters: result.counts?.recruiters || 0,
            businessOwners: result.counts?.businessOwners || 0,
            contributors: result.counts?.contributors || 0,
            flagged: result.counts?.flagged || 0,
          }));
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange(
    id: string,
    newStatus: "Active" | "Suspended" | "Inactive",
    type: "user" | "admin"
  ) {
    try {
      const result =
        type === "user"
          ? await updateUserStatusAction(id, newStatus)
          : await updateAdminStatusAction(id, newStatus);

      if (result.success) {
        toast.success(result.message);
        fetchData();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  }

  async function handleRoleChange(
    adminId: string,
    newRole: "Super Admin" | "Admin"
  ) {
    try {
      const result = await updateAdminRoleAction(adminId, newRole);

      if (result.success) {
        toast.success(result.message);
        fetchData();
      } else {
        toast.error(result.error || "Failed to update role");
      }
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error("Failed to update role");
    }
  }

  async function handleDelete() {
    if (!itemToDelete) return;

    try {
      const result =
        itemToDelete.type === "user"
          ? await deleteUserAction(itemToDelete.id)
          : await deleteAdminAction(itemToDelete.id);

      if (result.success) {
        toast.success(result.message);
        fetchData();
      } else {
        toast.error(result.error || "Failed to delete");
      }
    } catch (error) {
      console.error("Error deleting:", error);
      toast.error("Failed to delete");
    } finally {
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    }
  }

  function openDeleteDialog(id: string, name: string, type: "user" | "admin") {
    setItemToDelete({ id, name, type });
    setDeleteDialogOpen(true);
  }

  const displayedCount =
    activeTab === "all"
      ? counts.total
      : activeTab === "businesses"
        ? counts.businessOwners
        : activeTab === "reported"
          ? counts.flagged
          : counts.superAdmins + counts.regularAdmins;

  return (
    <div className="space-y-6">
      {/* Stats & Tabs Section */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-warm-100 dark:border-neutral-700 overflow-hidden">
        {/* Tabs */}
        <div className="flex border-b border-warm-100 dark:border-neutral-700 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab("all");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === "all"
                ? "border-warm-700 text-warm-700 dark:text-warm-300 bg-warm-50/30 dark:bg-warm-900/10"
                : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-warm-700 dark:hover:text-warm-300"
            }`}
          >
            <Users className="w-4 h-4" />
            All Users
            {counts.total > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === "all"
                    ? "bg-warm-700 text-white"
                    : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                {counts.total}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("businesses");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === "businesses"
                ? "border-warm-700 text-warm-700 dark:text-warm-300 bg-warm-50/30 dark:bg-warm-900/10"
                : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-warm-700 dark:hover:text-warm-300"
            }`}
          >
            <Briefcase className="w-4 h-4" />
            Businesses
            {counts.businessOwners > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === "businesses"
                    ? "bg-warm-700 text-white"
                    : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                {counts.businessOwners}
              </span>
            )}
          </button>

          <button
            onClick={() => {
              setActiveTab("reported");
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
              activeTab === "reported"
                ? "border-warm-700 text-warm-700 dark:text-warm-300 bg-warm-50/30 dark:bg-warm-900/10"
                : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-warm-700 dark:hover:text-warm-300"
            }`}
          >
            <Flag className="w-4 h-4" />
            Reported & Flagged Accounts
            {counts.flagged > 0 && (
              <span
                className={`px-2 py-0.5 rounded-full text-xs ${
                  activeTab === "reported"
                    ? "bg-warm-700 text-white"
                    : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                }`}
              >
                {counts.flagged}
              </span>
            )}
          </button>

          {isSuperAdmin && (
            <button
              onClick={() => {
                setActiveTab("admins");
                setCurrentPage(1);
              }}
              className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-all whitespace-nowrap ${
                activeTab === "admins"
                  ? "border-warm-700 text-warm-700 dark:text-warm-300 bg-warm-50/30 dark:bg-warm-900/10"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-warm-700 dark:hover:text-warm-300"
              }`}
            >
              <UserCog className="w-4 h-4" />
              Admin Management
              {counts.superAdmins + counts.regularAdmins > 0 && (
                <span
                  className={`px-2 py-0.5 rounded-full text-xs ${
                    activeTab === "admins"
                      ? "bg-warm-700 text-white"
                      : "bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  {counts.superAdmins + counts.regularAdmins}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Filters & Search */}
        <div className="p-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-4 py-2.5 border border-warm-200/30 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-700/50 dark:focus:ring-warm-300/50 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100"
              />
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3">
              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setCurrentPage(1);
                }}
                className="px-4 py-2.5 border border-warm-200/30 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-700/50 dark:focus:ring-warm-300/50 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Suspended">Suspended</option>
                <option value="Inactive">Inactive</option>
              </select>

              {/* Account Type Filter (only for users) */}
              {activeTab !== "admins" && activeTab !== "businesses" && (
                <select
                  value={accountTypeFilter}
                  onChange={(e) => {
                    setAccountTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="px-4 py-2.5 border border-warm-200/30 dark:border-neutral-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-warm-700/50 dark:focus:ring-warm-300/50 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 text-sm"
                >
                  <option value="all">All Types</option>
                  <option value="Job Seeker">Job Seeker</option>
                  <option value="Recruiter">Recruiter</option>
                  <option value="Business Owner">Business Owner</option>
                  <option value="Contributor">Contributor</option>
                </select>
              )}

              {/* Export Button */}
              <button className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-warm-200 to-warm-700 text-white rounded-xl hover:shadow-lg transition-all font-medium">
                <Download className="w-4 h-4" />
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Results Count */}
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Displaying{" "}
            <span className="font-semibold text-warm-700 dark:text-warm-300">
              {displayedCount}
            </span>{" "}
            results
          </p>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-warm-700"></div>
            </div>
          ) : activeTab === "admins" ? (
            admins.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-center px-4">
                <UserCog className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mb-4" />
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                  No admins found
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
                  {search || statusFilter !== "all"
                    ? "Try adjusting your search or filters"
                    : "No admin accounts have been created yet"}
                </p>
              </div>
            ) : (
              <AdminsTable
                admins={admins}
                onStatusChange={handleStatusChange}
                onRoleChange={handleRoleChange}
                onDelete={openDeleteDialog}
                isSuperAdmin={isSuperAdmin}
              />
            )
          ) : users.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center px-4">
              {activeTab === "reported" ? (
                <>
                  <Flag className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    No flagged accounts
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
                    {search || statusFilter !== "all"
                      ? "No flagged accounts match your search or filters"
                      : "There are currently no suspended or inactive user accounts. Users who are suspended or deactivated will appear here."}
                  </p>
                </>
              ) : (
                <>
                  <Users className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mb-4" />
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
                    No users found
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 max-w-md">
                    {search ||
                    statusFilter !== "all" ||
                    accountTypeFilter !== "all"
                      ? "Try adjusting your search or filters"
                      : "No user accounts have been created yet"}
                  </p>
                </>
              )}
            </div>
          ) : (
            <UsersTable
              users={users}
              onStatusChange={handleStatusChange}
              onDelete={openDeleteDialog}
              isSuperAdmin={isSuperAdmin}
            />
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-4 border-t border-warm-100 dark:border-neutral-700">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-warm-50 dark:hover:bg-neutral-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber = i + 1;
                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-medium transition-all ${
                      currentPage === pageNumber
                        ? "bg-gradient-to-r from-warm-200 to-warm-700 text-white shadow-sm"
                        : "text-neutral-700 dark:text-neutral-300 hover:bg-warm-50 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-warm-50 dark:hover:bg-neutral-800 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete{" "}
              <span className="font-semibold">{itemToDelete?.name}</span> and
              remove their data from the system.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Users Table Component
function UsersTable({
  users,
  onStatusChange,
  onDelete,
  isSuperAdmin,
}: {
  users: User[];
  onStatusChange: (
    id: string,
    status: "Active" | "Suspended" | "Inactive",
    type: "user"
  ) => void;
  onDelete: (id: string, name: string, type: "user") => void;
  isSuperAdmin: boolean;
}) {
  return (
    <table className="w-full">
      <thead className="bg-gradient-to-r from-warm-50 to-warm-100/30 dark:from-neutral-800 dark:to-neutral-800/50">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
            User's Name
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
            Email Address
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
            Creation Date
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
            Account Type
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {users.map((user) => (
          <tr
            key={user.id}
            className="hover:bg-warm-50/30 dark:hover:bg-neutral-800/50 transition-colors"
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                {user.fullName}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {user.email}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {format(new Date(user.createdAt), "do MMM yyyy")}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-warm-100 dark:bg-warm-900/30 text-warm-800 dark:text-warm-200">
                • {user.accountType}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  user.status === "Active"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                    : user.status === "Suspended"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                      : "bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                }`}
              >
                {user.status === "Active" ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                {user.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-warm-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {user.status !== "Active" && (
                    <DropdownMenuItem
                      onClick={() => onStatusChange(user.id, "Active", "user")}
                      className="cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Activate
                    </DropdownMenuItem>
                  )}
                  {user.status !== "Suspended" && (
                    <DropdownMenuItem
                      onClick={() =>
                        onStatusChange(user.id, "Suspended", "user")
                      }
                      className="cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 mr-2 text-orange-600" />
                      Suspend
                    </DropdownMenuItem>
                  )}
                  {user.status !== "Inactive" && (
                    <DropdownMenuItem
                      onClick={() =>
                        onStatusChange(user.id, "Inactive", "user")
                      }
                      className="cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 mr-2 text-neutral-600" />
                      Deactivate
                    </DropdownMenuItem>
                  )}
                  {isSuperAdmin && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => onDelete(user.id, user.fullName, "user")}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete User
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// Admins Table Component
function AdminsTable({
  admins,
  onStatusChange,
  onRoleChange,
  onDelete,
  isSuperAdmin,
}: {
  admins: Admin[];
  onStatusChange: (
    id: string,
    status: "Active" | "Suspended" | "Inactive",
    type: "admin"
  ) => void;
  onRoleChange: (id: string, role: "Super Admin" | "Admin") => void;
  onDelete: (id: string, name: string, type: "admin") => void;
  isSuperAdmin: boolean;
}) {
  return (
    <table className="w-full">
      <thead className="bg-gradient-to-r from-warm-50 to-warm-100/30 dark:from-neutral-800 dark:to-neutral-800/50">
        <tr>
          <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
            Admin Name
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
            Email Address
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
            Role
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
            Status
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
            Last Login
          </th>
          <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
            Actions
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
        {admins.map((admin) => (
          <tr
            key={admin.id}
            className="hover:bg-warm-50/30 dark:hover:bg-neutral-800/50 transition-colors"
          >
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="flex items-center gap-2">
                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
                  {admin.firstName} {admin.lastName}
                </div>
                {admin.role === "Super Admin" && (
                  <Shield className="w-4 h-4 text-warm-700" />
                )}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {admin.email}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  admin.role === "Super Admin"
                    ? "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200"
                    : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
                }`}
              >
                {admin.role}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <span
                className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                  admin.status === "Active"
                    ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                    : admin.status === "Suspended"
                      ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                      : "bg-neutral-100 dark:bg-neutral-700 text-neutral-800 dark:text-neutral-200"
                }`}
              >
                {admin.status === "Active" ? (
                  <CheckCircle className="w-3 h-3" />
                ) : (
                  <XCircle className="w-3 h-3" />
                )}
                {admin.status}
              </span>
            </td>
            <td className="px-6 py-4 whitespace-nowrap">
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                {admin.lastLoginAt
                  ? format(new Date(admin.lastLoginAt), "do MMM yyyy")
                  : "Never"}
              </div>
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-right">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 hover:bg-warm-100 dark:hover:bg-neutral-700 rounded-lg transition-colors">
                    <MoreVertical className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {admin.status !== "Active" && (
                    <DropdownMenuItem
                      onClick={() =>
                        onStatusChange(admin.id, "Active", "admin")
                      }
                      className="cursor-pointer"
                    >
                      <CheckCircle className="w-4 h-4 mr-2 text-green-600" />
                      Activate
                    </DropdownMenuItem>
                  )}
                  {admin.status !== "Suspended" && (
                    <DropdownMenuItem
                      onClick={() =>
                        onStatusChange(admin.id, "Suspended", "admin")
                      }
                      className="cursor-pointer"
                    >
                      <XCircle className="w-4 h-4 mr-2 text-orange-600" />
                      Suspend
                    </DropdownMenuItem>
                  )}
                  {admin.role !== "Super Admin" && (
                    <DropdownMenuItem
                      onClick={() => onRoleChange(admin.id, "Super Admin")}
                      className="cursor-pointer"
                    >
                      <Shield className="w-4 h-4 mr-2 text-purple-600" />
                      Promote to Super Admin
                    </DropdownMenuItem>
                  )}
                  {admin.role === "Super Admin" && isSuperAdmin && (
                    <DropdownMenuItem
                      onClick={() => onRoleChange(admin.id, "Admin")}
                      className="cursor-pointer"
                    >
                      <Shield className="w-4 h-4 mr-2 text-blue-600" />
                      Demote to Admin
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() =>
                      onDelete(
                        admin.id,
                        `${admin.firstName} ${admin.lastName}`,
                        "admin"
                      )
                    }
                    className="cursor-pointer text-red-600 focus:text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Admin
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
