"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Download,
  Upload,
  Eye,
  Search,
  MoreVertical,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  getAllCVOrdersAction,
  updateOrderStatusAction,
  uploadOptimizedCVAction,
} from "./actions";
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
import Link from "next/link";

interface CVOrder {
  id: string;
  userId: string;
  packageType: string;
  packageName: string;
  packagePrice: string;
  paymentReference: string | null;
  paymentStatus: string;
  orderStatus: string;
  cvFileUrl: string | null;
  cvFileKey: string | null;
  optimizedCvUrl: string | null;
  maxRevisions: number | null;
  revisionsUsed: number | null;
  estimatedDeliveryDays: number | null;
  customerNotes: string | null;
  adminNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
  userEmail: string | null;
  userFullName: string | null;
}

export default function CVReviewContent() {
  const [orders, setOrders] = useState<CVOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<CVOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedOrder, setSelectedOrder] = useState<CVOrder | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadingFile, setUploadingFile] = useState<File | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    filterOrders();
  }, [searchTerm, statusFilter, orders]);

  const fetchOrders = async () => {
    setIsLoading(true);
    const result = await getAllCVOrdersAction();
    if (result.success && result.orders) {
      setOrders(result.orders as CVOrder[]);
    } else {
      toast.error("Failed to load CV orders");
    }
    setIsLoading(false);
  };

  const filterOrders = () => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.userFullName
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          order.userEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((order) => order.orderStatus === statusFilter);
    }

    setFilteredOrders(filtered);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending_payment: {
        label: "Pending",
        color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
        icon: Clock,
      },
      payment_verified: {
        label: "Verified",
        color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        icon: CheckCircle,
      },
      cv_uploaded: {
        label: "In Review",
        color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
        icon: Eye,
      },
      in_progress: {
        label: "In Progress",
        color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
        icon: Clock,
      },
      completed: {
        label: "Completed",
        color: "text-green-600 bg-green-50 dark:bg-green-900/20",
        icon: CheckCircle,
      },
      cancelled: {
        label: "Cancelled",
        color: "text-red-600 bg-red-50 dark:bg-red-900/20",
        icon: XCircle,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.pending_payment;
    const Icon = config.icon;

    return (
      <div
        className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full ${config.color} text-xs font-medium`}
      >
        <Icon className="w-3 h-3" />
        <span>{config.label}</span>
      </div>
    );
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    startTransition(async () => {
      const result = await updateOrderStatusAction(orderId, newStatus as any);
      if (result.success) {
        toast.success("Status updated successfully");
        fetchOrders();
      } else {
        toast.error(result.error || "Failed to update status");
      }
    });
  };

  const handleUploadOptimized = (order: CVOrder) => {
    setSelectedOrder(order);
    setIsUploadModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or DOCX file");
        return;
      }
      setUploadingFile(file);
    }
  };

  const handleUploadSubmit = async () => {
    if (!uploadingFile || !selectedOrder) return;

    startTransition(async () => {
      const formData = new FormData();
      formData.append("file", uploadingFile);

      const result = await uploadOptimizedCVAction(selectedOrder.id, formData);

      if (result.success) {
        toast.success("Optimized CV uploaded successfully");
        setIsUploadModalOpen(false);
        setUploadingFile(null);
        setSelectedOrder(null);
        fetchOrders();
      } else {
        toast.error(result.error || "Failed to upload CV");
      }
    });
  };

  const downloadCV = (url: string, filename: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = filename;
    link.target = "_blank";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-warm-200 via-warm-700 to-warm-800 rounded-2xl p-8 shadow-lg">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            CV Review Dashboard
          </h1>
          <p className="text-warm-50 text-lg">
            Review and manage CV optimization requests
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Stats Cards - Modern with gradients */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="group relative overflow-hidden bg-gradient-to-br from-white to-warm-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-6 border border-warm-100 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-warm-200/10 rounded-full -mr-10 -mt-10"></div>
          <p className="text-sm font-medium text-warm-700 dark:text-warm-300 mb-2">
            Total Orders
          </p>
          <p className="text-3xl font-bold text-warm-200 dark:text-warm-200">
            {orders.length}
          </p>
        </div>
        <div className="group relative overflow-hidden bg-gradient-to-br from-white to-orange-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-6 border border-orange-100 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-orange-500/10 rounded-full -mr-10 -mt-10"></div>
          <p className="text-sm font-medium text-orange-700 dark:text-orange-300 mb-2">
            In Progress
          </p>
          <p className="text-3xl font-bold text-orange-600 dark:text-orange-500">
            {orders.filter((o) => o.orderStatus === "in_progress").length}
          </p>
        </div>
        <div className="group relative overflow-hidden bg-gradient-to-br from-white to-green-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-6 border border-green-100 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -mr-10 -mt-10"></div>
          <p className="text-sm font-medium text-green-700 dark:text-green-300 mb-2">
            Completed
          </p>
          <p className="text-3xl font-bold text-green-600 dark:text-green-500">
            {orders.filter((o) => o.orderStatus === "completed").length}
          </p>
        </div>
        <div className="group relative overflow-hidden bg-gradient-to-br from-white to-purple-50 dark:from-neutral-800 dark:to-neutral-900 rounded-xl p-6 border border-purple-100 dark:border-neutral-700 shadow-sm hover:shadow-md transition-all duration-300">
          <div className="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -mr-10 -mt-10"></div>
          <p className="text-sm font-medium text-purple-700 dark:text-purple-300 mb-2">
            Pending Review
          </p>
          <p className="text-3xl font-bold text-purple-600 dark:text-purple-500">
            {orders.filter((o) => o.orderStatus === "cv_uploaded").length}
          </p>
        </div>
      </div>

      {/* Filters - Enhanced */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-warm-300 dark:text-warm-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search by name, email, or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 border-warm-200/30 dark:border-neutral-600 focus:border-warm-200 focus:ring-warm-200 rounded-xl"
              />
            </div>
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-6 py-3 h-12 border border-warm-200/30 dark:border-neutral-600 rounded-xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 font-medium focus:border-warm-200 focus:ring-2 focus:ring-warm-200/20 transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="cv_uploaded">🔍 In Review</option>
            <option value="in_progress">⏳ In Progress</option>
            <option value="completed">✅ Completed</option>
            <option value="cancelled">❌ Cancelled</option>
          </select>
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm font-medium text-warm-700 dark:text-warm-300">
            Displaying{" "}
            <span className="text-warm-200 font-bold">
              {filteredOrders.length}
            </span>{" "}
            result
            {filteredOrders.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {/* Orders Table - Enhanced */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-warm-50 to-orange-50 dark:from-neutral-900 dark:to-neutral-800 border-b-2 border-warm-200/30 dark:border-neutral-700">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
                  Package
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
                  Revisions
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-warm-800 dark:text-warm-200 uppercase tracking-wider">
                  Submission Date
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
              {filteredOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-neutral-600 dark:text-neutral-400"
                  >
                    No orders found
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-warm-50/30 dark:hover:bg-neutral-900/50 transition-colors duration-150"
                  >
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                          {order.userFullName || "N/A"}
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-0.5">
                          {order.userEmail}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="inline-flex items-center px-3 py-1.5 rounded-lg bg-gradient-to-r from-warm-100 to-warm-200/20 dark:from-warm-900/30 dark:to-warm-800/20 border border-warm-200/30 dark:border-warm-700/30">
                        <span className="text-sm font-semibold text-warm-700 dark:text-warm-300">
                          {order.packageName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        <span className="text-warm-600 dark:text-warm-400">
                          {order.revisionsUsed || 0}
                        </span>
                        <span className="text-neutral-400 mx-1">/</span>
                        <span>{order.maxRevisions || 0}</span>
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        {format(new Date(order.createdAt), "MMM d, yyyy")}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {getStatusBadge(order.orderStatus)}
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center space-x-2">
                        {order.cvFileUrl && (
                          <button
                            onClick={() =>
                              downloadCV(
                                order.cvFileUrl!,
                                `CV_${order.userFullName}.pdf`
                              )
                            }
                            className="p-2.5 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 group"
                            title="Download Original CV"
                          >
                            <Download className="w-5 h-5 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                          </button>
                        )}
                        {order.optimizedCvUrl ? (
                          <Link
                            href={order.optimizedCvUrl}
                            target="_blank"
                            className="p-2.5 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200 group"
                            title="View Optimized CV"
                          >
                            <Eye className="w-5 h-5 text-green-600 dark:text-green-400 group-hover:scale-110 transition-transform" />
                          </Link>
                        ) : (
                          <button
                            onClick={() => handleUploadOptimized(order)}
                            className="p-2.5 hover:bg-warm-50 dark:hover:bg-warm-900/20 rounded-lg transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                            title="Upload Optimized CV"
                            disabled={!order.cvFileUrl}
                          >
                            <Upload className="w-5 h-5 text-warm-600 dark:text-warm-400 group-hover:scale-110 transition-transform" />
                          </button>
                        )}
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button className="p-2.5 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-all duration-200">
                              <MoreVertical className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(order.id, "in_progress")
                              }
                              className="cursor-pointer"
                            >
                              ⏳ Set as In Progress
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(order.id, "completed")
                              }
                              className="cursor-pointer"
                            >
                              ✅ Mark as Completed
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                handleUpdateStatus(order.id, "cancelled")
                              }
                              className="cursor-pointer text-red-600"
                            >
                              ❌ Cancel Order
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload Optimized CV Modal - Enhanced */}
      <Dialog open={isUploadModalOpen} onOpenChange={setIsUploadModalOpen}>
        <DialogContent className="sm:max-w-md border-warm-200/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-warm-800 dark:text-warm-200">
              Upload Optimized CV
            </DialogTitle>
            <DialogDescription className="text-base">
              Upload the optimized CV for{" "}
              <span className="font-semibold text-warm-600">
                {selectedOrder?.userFullName}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <label className="block text-sm font-semibold text-warm-700 dark:text-warm-300 mb-3">
                Select File (PDF or DOCX)
              </label>
              <Input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileSelect}
                disabled={isPending}
                className="border-warm-200/30 focus:border-warm-200 focus:ring-warm-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-warm-100 file:text-warm-700 hover:file:bg-warm-200/50 file:transition-colors"
              />
              {uploadingFile && (
                <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                  <p className="text-sm font-medium text-green-700 dark:text-green-300">
                    ✓ Selected: {uploadingFile.name}
                  </p>
                </div>
              )}
            </div>
            <div className="flex space-x-3">
              <Button
                onClick={handleUploadSubmit}
                disabled={!uploadingFile || isPending}
                className="flex-1 bg-gradient-to-r from-warm-200 to-warm-700 hover:from-warm-300 hover:to-warm-800 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
              >
                {isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Uploading...
                  </>
                ) : (
                  "Upload & Complete"
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setIsUploadModalOpen(false);
                  setUploadingFile(null);
                }}
                disabled={isPending}
                className="border-warm-200/30 hover:bg-warm-50 dark:hover:bg-warm-900/20"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
