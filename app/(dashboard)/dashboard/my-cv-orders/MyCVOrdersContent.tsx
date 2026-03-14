"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Download,
  FileText,
  Clock,
  CheckCircle,
  RefreshCw,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { getUserCVOptimizationOrders } from "@/app/(dashboard)/actions/cv-optimization-actions";
import {
  requestRevisionAction,
  uploadRevisionCVAction,
} from "@/app/(dashboard)/actions/cv-revision-actions";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/common/dialog";
import { Button } from "@/components/common/button";
import { Textarea } from "@/components/common/textarea";
import { Input } from "@/components/common/input";
import { Spinner } from "@/components/common/spinner";
import Link from "next/link";

interface CVOrder {
  id: string;
  packageName: string;
  packagePrice: string;
  orderStatus: string;
  paymentStatus: string;
  cvFileUrl: string | null;
  optimizedCvUrl: string | null;
  maxRevisions: number | null;
  revisionsUsed: number | null;
  customerNotes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function MyCVOrdersContent() {
  const [orders, setOrders] = useState<CVOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<CVOrder | null>(null);
  const [isRevisionModalOpen, setIsRevisionModalOpen] = useState(false);
  const [revisionNotes, setRevisionNotes] = useState("");
  const [revisionFile, setRevisionFile] = useState<File | null>(null);
  const [uploadNewCV, setUploadNewCV] = useState(false);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    const result = await getUserCVOptimizationOrders();
    if (result.success && result.orders) {
      setOrders(result.orders as CVOrder[]);
    } else {
      toast.error("Failed to load your orders");
    }
    setIsLoading(false);
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      pending_payment: {
        label: "Pending Payment",
        color: "text-yellow-600 bg-yellow-50 dark:bg-yellow-900/20",
        icon: Clock,
      },
      payment_verified: {
        label: "Payment Verified",
        color: "text-blue-600 bg-blue-50 dark:bg-blue-900/20",
        icon: CheckCircle,
      },
      cv_uploaded: {
        label: "Under Review",
        color: "text-purple-600 bg-purple-50 dark:bg-purple-900/20",
        icon: FileText,
      },
      in_progress: {
        label: "In Progress",
        color: "text-orange-600 bg-orange-50 dark:bg-orange-900/20",
        icon: RefreshCw,
      },
      completed: {
        label: "Completed",
        color: "text-green-600 bg-green-50 dark:bg-green-900/20",
        icon: CheckCircle,
      },
    };
    return configs[status as keyof typeof configs] || configs.pending_payment;
  };

  const handleRequestRevision = (order: CVOrder) => {
    setSelectedOrder(order);
    setRevisionNotes("");
    setRevisionFile(null);
    setUploadNewCV(false);
    setIsRevisionModalOpen(true);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or DOCX file");
        return;
      }
      setRevisionFile(file);
    }
  };

  const handleSubmitRevision = async () => {
    if (!selectedOrder || !revisionNotes.trim()) {
      toast.error("Please provide revision notes");
      return;
    }

    startTransition(async () => {
      if (uploadNewCV && revisionFile) {
        // Upload new CV with revision notes
        const formData = new FormData();
        formData.append("file", revisionFile);

        const result = await uploadRevisionCVAction(
          selectedOrder.id,
          formData,
          revisionNotes
        );

        if (result.success) {
          toast.success(result.message);
          setIsRevisionModalOpen(false);
          fetchOrders();
        } else {
          toast.error(result.error || "Failed to upload revision");
        }
      } else {
        // Just request revision with notes
        const result = await requestRevisionAction(
          selectedOrder.id,
          revisionNotes
        );

        if (result.success) {
          toast.success(result.message);
          setIsRevisionModalOpen(false);
          fetchOrders();
        } else {
          toast.error(result.error || "Failed to request revision");
        }
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

  const canRequestRevision = (order: CVOrder) => {
    return (
      order.orderStatus === "completed" &&
      order.optimizedCvUrl &&
      (order.revisionsUsed || 0) < (order.maxRevisions || 0)
    );
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
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-warm-200 via-warm-700 to-warm-800 rounded-2xl p-8 shadow-lg">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">My CV Orders</h1>
          <p className="text-warm-50 text-lg">
            Track and manage your CV optimization orders
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
      </div>

      {/* Orders Grid */}
      {orders.length === 0 ? (
        <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 p-12 text-center">
          <FileText className="w-16 h-16 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
            No CV Orders Yet
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-6">
            You haven't placed any CV optimization orders yet.
          </p>
          <Link href="/cv-optimization">
            <Button className="bg-gradient-to-r from-warm-200 to-warm-700 text-white">
              Browse Packages
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {orders.map((order) => {
            const statusConfig = getStatusConfig(order.orderStatus);
            const StatusIcon = statusConfig.icon;
            const revisionsRemaining =
              (order.maxRevisions || 0) - (order.revisionsUsed || 0);

            return (
              <div
                key={order.id}
                className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 p-6 shadow-sm hover:shadow-md transition-all"
              >
                {/* Package Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">
                      {order.packageName}
                    </h3>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                      Ordered on{" "}
                      {format(new Date(order.createdAt), "MMM d, yyyy")}
                    </p>
                  </div>
                  <div
                    className={`inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg ${statusConfig.color} text-sm font-semibold`}
                  >
                    <StatusIcon className="w-4 h-4" />
                    <span>{statusConfig.label}</span>
                  </div>
                </div>

                {/* Order Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Price
                    </span>
                    <span className="font-semibold text-warm-600">
                      ₦{parseFloat(order.packagePrice).toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600 dark:text-neutral-400">
                      Revisions
                    </span>
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">
                      {order.revisionsUsed || 0}/{order.maxRevisions || 0}
                      {revisionsRemaining > 0 && (
                        <span className="text-green-600 ml-2">
                          ({revisionsRemaining} left)
                        </span>
                      )}
                    </span>
                  </div>
                </div>

                {/* Customer Notes */}
                {order.customerNotes && (
                  <div className="mb-4 p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
                    <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">
                      Your Notes:
                    </p>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                      {order.customerNotes}
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {order.optimizedCvUrl && (
                    <Button
                      onClick={() =>
                        downloadCV(
                          order.optimizedCvUrl!,
                          `Optimized_CV_${order.packageName}.pdf`
                        )
                      }
                      className="flex-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download CV
                    </Button>
                  )}
                  {canRequestRevision(order) && (
                    <Button
                      onClick={() => handleRequestRevision(order)}
                      variant="outline"
                      className="flex-1 border-warm-200 text-warm-700 hover:bg-warm-50"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Request Revision
                    </Button>
                  )}
                  {!order.optimizedCvUrl &&
                    order.orderStatus === "completed" && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 italic">
                        Your optimized CV will be available soon
                      </p>
                    )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Revision Request Modal */}
      <Dialog open={isRevisionModalOpen} onOpenChange={setIsRevisionModalOpen}>
        <DialogContent className="sm:max-w-lg border-warm-200/30">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-warm-800 dark:text-warm-200">
              Request Revision
            </DialogTitle>
            <DialogDescription className="text-base">
              Tell us what you'd like us to improve in your CV. You have{" "}
              <span className="font-semibold text-warm-600">
                {(selectedOrder?.maxRevisions || 0) -
                  (selectedOrder?.revisionsUsed || 0)}{" "}
                revisions
              </span>{" "}
              remaining.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-6 py-4">
            <div>
              <label className="block text-sm font-semibold text-warm-700 dark:text-warm-300 mb-2">
                What would you like us to improve?
              </label>
              <Textarea
                value={revisionNotes}
                onChange={(e) => setRevisionNotes(e.target.value)}
                placeholder="Please be specific about what you'd like changed or improved..."
                rows={5}
                className="border-warm-200/30 focus:border-warm-200 focus:ring-warm-200"
              />
            </div>

            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-4">
              <div className="flex items-center space-x-3 mb-3">
                <input
                  type="checkbox"
                  id="uploadNewCV"
                  checked={uploadNewCV}
                  onChange={(e) => setUploadNewCV(e.target.checked)}
                  className="w-4 h-4 text-warm-600 border-neutral-300 rounded focus:ring-warm-500"
                />
                <label
                  htmlFor="uploadNewCV"
                  className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
                >
                  Upload a new version of my CV for revision
                </label>
              </div>

              {uploadNewCV && (
                <div>
                  <Input
                    type="file"
                    accept=".pdf,.docx"
                    onChange={handleFileSelect}
                    disabled={isPending}
                    className="border-warm-200/30 focus:border-warm-200 focus:ring-warm-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-warm-100 file:text-warm-700 hover:file:bg-warm-200/50"
                  />
                  {revisionFile && (
                    <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                      <p className="text-sm font-medium text-green-700 dark:text-green-300">
                        ✓ Selected: {revisionFile.name}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={handleSubmitRevision}
                disabled={
                  !revisionNotes.trim() ||
                  (uploadNewCV && !revisionFile) ||
                  isPending
                }
                className="flex-1 bg-gradient-to-r from-warm-200 to-warm-700 hover:from-warm-300 hover:to-warm-800 text-white font-semibold"
              >
                {isPending ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4 mr-2" />
                    Submit Revision Request
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={() => setIsRevisionModalOpen(false)}
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
