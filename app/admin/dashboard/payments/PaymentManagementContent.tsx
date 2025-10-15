"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  CreditCard,
  CheckCircle,
  XCircle,
  Clock,
  MoreVertical,
  FileText,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { getAdminPaymentTransactionsAction } from "@/app/(dashboard)/actions/payment-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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

interface PaymentTransaction {
  id: string;
  orderId: string;
  userId: string;
  paystackReference: string;
  paystackTransactionId: string | null;
  paystackStatus: string | null;
  amount: string;
  currency: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  channel: string | null;
  paymentMethod: string | null;
  verifiedAt: Date | null;
  verificationStatus: string | null;
  createdAt: Date;
  updatedAt: Date;
  userFullName: string | null;
  userEmail: string | null;
  orderPackageType: string | null;
  orderPackageName: string | null;
  orderStatus: string | null;
}

export default function PaymentManagementContent() {
  const [transactions, setTransactions] = useState<PaymentTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<PaymentTransaction | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    success: 0,
    pending: 0,
    failed: 0,
    totalAmount: 0,
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  // Cleanup modal state on unmount
  useEffect(() => {
    return () => {
      setIsDetailsModalOpen(false);
      setSelectedTransaction(null);
    };
  }, []);

  // Fetch stats on mount
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch transactions with server-side filtering and pagination
  useEffect(() => {
    fetchTransactions();
  }, [currentPage, debouncedSearchTerm, statusFilter]);

  const fetchStats = async () => {
    // Fetch all transactions to get accurate counts
    const result = await getAdminPaymentTransactionsAction({ limit: 1000 });
    if (result.success && result.data) {
      const allTransactions = result.data.transactions;
      const totalAmount = allTransactions.reduce((sum: number, t: any) => {
        return sum + parseFloat(t.amount || "0");
      }, 0);

      setStats({
        total: allTransactions.length,
        success: allTransactions.filter(
          (t: any) => t.paystackStatus === "success"
        ).length,
        pending: allTransactions.filter(
          (t: any) =>
            !t.paystackStatus ||
            t.paystackStatus === "pending" ||
            t.paystackStatus === "ongoing"
        ).length,
        failed: allTransactions.filter(
          (t: any) =>
            t.paystackStatus === "failed" || t.paystackStatus === "abandoned"
        ).length,
        totalAmount,
      });
    }
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    const result = await getAdminPaymentTransactionsAction({
      page: currentPage,
      limit: 10,
      status: statusFilter !== "all" ? statusFilter : undefined,
      search: debouncedSearchTerm || undefined,
    });

    if (result.success && result.data) {
      setTransactions(result.data.transactions as PaymentTransaction[]);
      setTotalPages(result.data.pagination.totalPages);
      setTotalCount(result.data.pagination.total);
    } else {
      toast.error("Failed to load payment transactions");
    }
    setIsLoading(false);
  };

  const getStatusBadge = (status: string | null) => {
    const normalizedStatus = (status || "pending").toLowerCase();

    const statusConfig: Record<
      string,
      { label: string; color: string; icon: any }
    > = {
      success: {
        label: "Success",
        color:
          "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 border border-green-300 dark:border-green-700",
        icon: CheckCircle,
      },
      failed: {
        label: "Failed",
        color:
          "text-red-700 bg-red-100 dark:bg-red-900/30 dark:text-red-300 border border-red-300 dark:border-red-700",
        icon: XCircle,
      },
      abandoned: {
        label: "Abandoned",
        color:
          "text-orange-700 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-300 dark:border-orange-700",
        icon: XCircle,
      },
      pending: {
        label: "Pending",
        color:
          "text-yellow-700 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700",
        icon: Clock,
      },
      ongoing: {
        label: "Ongoing",
        color:
          "text-blue-700 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300 border border-blue-300 dark:border-blue-700",
        icon: Clock,
      },
    };

    const config = statusConfig[normalizedStatus] || statusConfig.pending;
    const IconComponent = config.icon;

    return (
      <span
        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        <IconComponent className="w-3 h-3" />
        {config.label}
      </span>
    );
  };

  const getPackageBadge = (packageType: string | null) => {
    const type = (packageType || "").toLowerCase();
    const packageConfig: Record<string, { label: string; color: string }> = {
      deluxe: {
        label: "Deluxe",
        color:
          "bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 text-blue-700 dark:text-blue-300",
      },
      supreme: {
        label: "Supreme",
        color:
          "bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-300",
      },
      premium: {
        label: "Premium",
        color:
          "bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/30 dark:to-orange-900/30 text-amber-700 dark:text-amber-300",
      },
    };

    const config = packageConfig[type] || packageConfig.deluxe;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const formatAmount = (amount: string, currency: string | null) => {
    const numAmount = parseFloat(amount);
    const curr = currency || "NGN";
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: curr,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numAmount);
  };

  const handleViewDetails = (transaction: PaymentTransaction) => {
    setSelectedTransaction(transaction);
    // Use setTimeout to ensure state updates properly
    setTimeout(() => {
      setIsDetailsModalOpen(true);
    }, 0);
  };

  const handleCloseModal = (open: boolean) => {
    if (!open) {
      setIsDetailsModalOpen(false);
      // Cleanup after modal animation completes
      setTimeout(() => {
        setSelectedTransaction(null);
      }, 300);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-warm-200 via-warm-700 to-warm-800 rounded-2xl p-8 shadow-lg">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Payment & Transactions
          </h1>
          <p className="text-warm-50 text-lg">
            Monitor and manage all payment transactions on the platform
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-warm-100 dark:border-neutral-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Total Transactions
              </p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                {stats.total}
              </p>
            </div>
            <div className="w-12 h-12 bg-warm-100 dark:bg-warm-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-warm-600 dark:text-warm-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-green-100 dark:border-green-900/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Successful
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.success}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-yellow-100 dark:border-yellow-900/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Pending
              </p>
              <p className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">
                {stats.pending}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-red-100 dark:border-red-900/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Failed
              </p>
              <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                {stats.failed}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-blue-100 dark:border-blue-900/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Total Revenue
              </p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {formatAmount(stats.totalAmount.toString(), "NGN")}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ₦
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by reference, email, or customer name..."
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
            <option value="success">Success</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
            <option value="abandoned">Abandoned</option>
          </select>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-12">
            <CreditCard className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              No transactions found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "No payment transactions have been made yet"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-warm-50 to-orange-50 dark:from-neutral-900 dark:to-neutral-800 border-b-2 border-warm-200 dark:border-warm-800">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[22%]">
                    Reference
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[15%]">
                    Customer
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[12%]">
                    Package
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[10%]">
                    Amount
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[10%]">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[12%]">
                    Method
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[13%]">
                    Date
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[6%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 dark:divide-neutral-700">
                {transactions.map((transaction, index) => (
                  <tr
                    key={transaction.id}
                    className={`hover:bg-warm-50/50 dark:hover:bg-neutral-800/50 transition-all duration-200 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-neutral-800"
                        : "bg-neutral-50/30 dark:bg-neutral-850/30"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="font-mono text-xs font-semibold text-neutral-900 dark:text-white">
                          {transaction.paystackReference}
                        </span>
                        {transaction.paystackTransactionId && (
                          <span className="font-mono text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                            ID:{" "}
                            {transaction.paystackTransactionId.substring(0, 12)}
                            ...
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-warm-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                          {transaction.userFullName
                            ? transaction.userFullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .substring(0, 2)
                            : transaction.customerEmail?.[0].toUpperCase() ||
                              "U"}
                        </div>
                        <div className="flex flex-col">
                          <span className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-1">
                            {transaction.userFullName || "Unknown"}
                          </span>
                          <span className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1">
                            {transaction.customerEmail}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getPackageBadge(transaction.orderPackageType)}
                    </td>
                    <td className="px-4 py-4">
                      <span className="font-bold text-neutral-900 dark:text-white">
                        {formatAmount(transaction.amount, transaction.currency)}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(transaction.paystackStatus)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <CreditCard className="w-3.5 h-3.5 text-neutral-500 dark:text-neutral-400" />
                        <span className="text-sm text-neutral-700 dark:text-neutral-300 capitalize">
                          {transaction.channel ||
                            transaction.paymentMethod ||
                            "N/A"}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {format(
                            new Date(transaction.createdAt),
                            "MMM dd, yyyy"
                          )}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {format(new Date(transaction.createdAt), "h:mm a")}
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
                            onClick={() => handleViewDetails(transaction)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
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

      {/* Transaction Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={handleCloseModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Transaction Details</DialogTitle>
            <DialogDescription>
              Complete information about this payment transaction
            </DialogDescription>
          </DialogHeader>
          {selectedTransaction && (
            <div className="space-y-6 py-4">
              {/* Transaction Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  <div className="pr-4">
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                      Reference
                    </label>
                    <p className="font-mono text-sm font-semibold text-neutral-900 dark:text-white break-all">
                      {selectedTransaction.paystackReference}
                    </p>
                  </div>
                  <div className="pl-4">
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                      Status
                    </label>
                    <div>
                      {getStatusBadge(selectedTransaction.paystackStatus)}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  <div className="pr-4">
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                      Amount
                    </label>
                    <p className="text-lg font-bold text-neutral-900 dark:text-white">
                      {formatAmount(
                        selectedTransaction.amount,
                        selectedTransaction.currency
                      )}
                    </p>
                  </div>
                  <div className="pl-4">
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                      Payment Method
                    </label>
                    <p className="text-sm text-neutral-900 dark:text-white capitalize">
                      {selectedTransaction.channel ||
                        selectedTransaction.paymentMethod ||
                        "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
                  Customer Information
                </h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  <div className="pr-4">
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                      Name
                    </label>
                    <p className="text-sm text-neutral-900 dark:text-white">
                      {selectedTransaction.userFullName || "Unknown"}
                    </p>
                  </div>
                  <div className="pl-4">
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                      Email
                    </label>
                    <p className="text-sm text-neutral-900 dark:text-white break-all">
                      {selectedTransaction.customerEmail ||
                        selectedTransaction.userEmail}
                    </p>
                  </div>
                  {selectedTransaction.customerPhone && (
                    <div className="pr-4">
                      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                        Phone
                      </label>
                      <p className="text-sm text-neutral-900 dark:text-white">
                        {selectedTransaction.customerPhone}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Info */}
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
                  Order Information
                </h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  <div className="pr-4">
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                      Package Type
                    </label>
                    <div>
                      {getPackageBadge(selectedTransaction.orderPackageType)}
                    </div>
                  </div>
                  <div className="pl-4">
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                      Package Name
                    </label>
                    <p className="text-sm text-neutral-900 dark:text-white">
                      {selectedTransaction.orderPackageName || "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Timestamps */}
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
                <h3 className="font-semibold text-neutral-900 dark:text-white mb-4">
                  Timestamps
                </h3>
                <div className="grid grid-cols-2 gap-x-12 gap-y-4">
                  <div className="pr-4">
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                      Created
                    </label>
                    <p className="text-sm text-neutral-900 dark:text-white">
                      {format(
                        new Date(selectedTransaction.createdAt),
                        "MMM dd, yyyy 'at' h:mm a"
                      )}
                    </p>
                  </div>
                  {selectedTransaction.verifiedAt && (
                    <div className="pl-4">
                      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 block mb-1">
                        Verified
                      </label>
                      <p className="text-sm text-neutral-900 dark:text-white">
                        {format(
                          new Date(selectedTransaction.verifiedAt),
                          "MMM dd, yyyy 'at' h:mm a"
                        )}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
