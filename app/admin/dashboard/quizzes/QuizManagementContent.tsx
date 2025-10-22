"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  Trash2,
  MoreVertical,
  Plus,
  FileText,
  Archive,
  X,
  Upload,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  getAdminQuizzesAction,
  deleteQuizAction,
  createQuizAction,
  updateQuizAction,
  getQuizForEditAction,
} from "@/app/(dashboard)/actions/quiz-actions";
import {
  uploadQuizFeaturedImage,
  deleteUploadedFile,
} from "@/app/(dashboard)/actions/upload-actions";
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
import { Label } from "@/components/common/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/common/select";
import { useSession } from "next-auth/react";
import Image from "next/image";

// Define the quiz schema for form validation
const quizSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.string().min(2, "Category is required"),
  difficulty: z.enum(["Beginner", "Intermediate", "Advanced"]),
  estimatedTime: z.string().min(1, "Estimated time is required"),
  status: z.enum(["draft", "published"]),
  questions: z
    .array(
      z.object({
        questionText: z
          .string()
          .min(5, "Question must be at least 5 characters"),
        options: z
          .array(
            z.object({
              optionText: z.string().min(1, "Option text is required"),
              isCorrect: z.boolean(),
            })
          )
          .length(4, "Each question must have exactly 4 options")
          .refine(
            (options) => options.filter((opt) => opt.isCorrect).length === 1,
            "Each question must have exactly one correct answer"
          ),
      })
    )
    .min(1, "Quiz must have at least 1 question"),
});

type QuizFormData = z.infer<typeof quizSchema>;

interface Quiz {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedTime: string;
  featuredImage: string | null;
  featuredImageKey: string | null;
  status: "draft" | "published" | "archived";
  adminId: string;
  attemptCount: number;
  viewCount: number;
  publishedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function QuizManagementContent() {
  const router = useRouter();
  const { data: session } = useSession();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null);
  const [featuredImagePreview, setFeaturedImagePreview] = useState<
    string | null
  >(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [uploadedImageKey, setUploadedImageKey] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
  });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      difficulty: "Beginner",
      estimatedTime: "",
      status: "draft",
      questions: [
        {
          questionText: "",
          options: [
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },
          ],
        },
      ],
    },
  });

  const {
    fields: questionFields,
    append: appendQuestion,
    remove: removeQuestion,
  } = useFieldArray({
    control,
    name: "questions",
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

  // Fetch stats on mount and after actions
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch quizzes with server-side filtering and pagination
  useEffect(() => {
    fetchQuizzes();
  }, [currentPage, debouncedSearchTerm, statusFilter]);

  const fetchStats = async () => {
    const result = await getAdminQuizzesAction({ limit: 1000 });
    if (result.success && result.data) {
      const allQuizzes = result.data.quizzes;
      setStats({
        total: allQuizzes.length,
        published: allQuizzes.filter((q: any) => q.status === "published")
          .length,
        draft: allQuizzes.filter((q: any) => q.status === "draft").length,
        archived: allQuizzes.filter((q: any) => q.status === "archived").length,
      });
    }
  };

  const fetchQuizzes = async () => {
    setIsLoading(true);
    const result = await getAdminQuizzesAction({
      page: currentPage,
      limit: 10,
      status: statusFilter !== "all" ? (statusFilter as any) : undefined,
      search: debouncedSearchTerm || undefined,
    });

    if (result.success && result.data) {
      setQuizzes(result.data.quizzes as Quiz[]);
      setTotalPages(result.data.pagination.totalPages);
      setTotalCount(result.data.pagination.total);
    } else {
      toast.error("Failed to load quizzes");
    }
    setIsLoading(false);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      draft: {
        label: "Draft",
        color:
          "text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600",
      },
      published: {
        label: "Published",
        color:
          "text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 border border-green-300 dark:border-green-700",
      },
      archived: {
        label: "Archived",
        color:
          "text-orange-700 bg-orange-100 dark:bg-orange-900/30 dark:text-orange-300 border border-orange-300 dark:border-orange-700",
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

    return (
      <span
        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const handleDeleteClick = (quiz: Quiz) => {
    setQuizToDelete(quiz);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!quizToDelete) return;

    setIsDeleting(true);
    const result = await deleteQuizAction(quizToDelete.id);

    if (result.success) {
      toast.success("Quiz deleted successfully");
      setIsDeleteModalOpen(false);
      setQuizToDelete(null);
      fetchQuizzes();
      fetchStats();
    } else {
      toast.error(result.message || "Failed to delete quiz");
    }
    setIsDeleting(false);
  };

  const handleCreateClick = () => {
    setIsEditing(false);
    setEditingQuizId(null);
    setFeaturedImagePreview(null);
    setUploadedImageUrl(null);
    setUploadedImageKey(null);
    reset({
      title: "",
      description: "",
      category: "",
      difficulty: "Beginner",
      estimatedTime: "",
      status: "draft",
      questions: [
        {
          questionText: "",
          options: [
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },
            { optionText: "", isCorrect: false },
          ],
        },
      ],
    });
    setIsCreateModalOpen(true);
  };

  const handleEditClick = async (quiz: Quiz) => {
    setIsEditing(true);
    setEditingQuizId(quiz.id);
    setFeaturedImagePreview(quiz.featuredImage);
    setUploadedImageUrl(quiz.featuredImage);
    setUploadedImageKey(quiz.featuredImageKey);

    // Fetch full quiz data with questions
    const result = await getQuizForEditAction(quiz.id);
    if (result.success && result.data) {
      const quizData = result.data as any;
      reset({
        title: quizData.title,
        description: quizData.description,
        category: quizData.category,
        difficulty: quizData.difficulty,
        estimatedTime: quizData.estimatedTime,
        status: quizData.status,
        questions: quizData.questions.map((q: any) => ({
          questionText: q.questionText,
          options: q.options.map((opt: any) => ({
            optionText: opt.optionText,
            isCorrect: opt.isCorrect,
          })),
        })),
      });
      setIsCreateModalOpen(true);
    } else {
      toast.error("Failed to load quiz data");
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "image/gif",
    ];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid file type. Please upload an image file.");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size exceeds 5MB limit.");
      return;
    }

    setFeaturedImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setFeaturedImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImage = async () => {
    if (!featuredImageFile || !session?.user?.id) return;

    setIsUploadingImage(true);
    const formData = new FormData();
    formData.append("file", featuredImageFile);
    formData.append("adminId", session.user.id);
    formData.append("quizTitle", watch("title") || "quiz");

    const result = await uploadQuizFeaturedImage(formData);

    if (result.success && result.url) {
      setUploadedImageUrl(result.url);
      setUploadedImageKey(result.key || null);
      toast.success("Image uploaded successfully");
    } else {
      toast.error(result.error || "Failed to upload image");
    }
    setIsUploadingImage(false);
  };

  const handleRemoveImage = async () => {
    if (uploadedImageKey) {
      await deleteUploadedFile(uploadedImageKey);
    }
    setFeaturedImageFile(null);
    setFeaturedImagePreview(null);
    setUploadedImageUrl(null);
    setUploadedImageKey(null);
  };

  const onSubmit = async (data: QuizFormData) => {
    setIsSubmitting(true);

    try {
      // Upload image if there's a file selected
      let imageUrl = uploadedImageUrl;
      let imageKey = uploadedImageKey;

      if (featuredImageFile && !uploadedImageUrl) {
        if (!session?.user?.id) {
          toast.error("Session expired. Please log in again.");
          setIsSubmitting(false);
          return;
        }

        const formData = new FormData();
        formData.append("file", featuredImageFile);
        formData.append("adminId", session.user.id);
        formData.append("quizTitle", data.title || "quiz");

        const uploadResult = await uploadQuizFeaturedImage(formData);

        if (uploadResult.success && uploadResult.url) {
          imageUrl = uploadResult.url;
          imageKey = uploadResult.key || null;
        } else {
          toast.error(uploadResult.error || "Failed to upload image");
          setIsSubmitting(false);
          return;
        }
      }

      const quizData = {
        ...data,
        featuredImage: imageUrl || undefined,
        featuredImageKey: imageKey || undefined,
      };

      let result;
      if (isEditing && editingQuizId) {
        result = await updateQuizAction({ ...quizData, id: editingQuizId });
      } else {
        result = await createQuizAction(quizData);
      }

      if (result.success) {
        toast.success(result.message);
        setIsCreateModalOpen(false);
        fetchQuizzes();
        fetchStats();
        reset();
        setFeaturedImageFile(null);
        setFeaturedImagePreview(null);
        setUploadedImageUrl(null);
        setUploadedImageKey(null);
      } else {
        toast.error(result.message || "Failed to save quiz");
      }
    } catch (error) {
      console.error("Submit error:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-warm-200 via-warm-700 to-warm-800 rounded-2xl p-8 shadow-lg">
        <div className="relative z-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Quiz Management
            </h1>
            <p className="text-warm-50 text-lg">
              Create, manage, and publish quizzes for the platform
            </p>
          </div>
          <Button
            onClick={handleCreateClick}
            className="bg-white text-warm-700 hover:bg-warm-50"
          >
            <Plus className="w-4 h-4 mr-2" />
            Create Quiz
          </Button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-warm-100 dark:border-neutral-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Total Quizzes
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
                Published
              </p>
              <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                {stats.published}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <Eye className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Drafts
              </p>
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                {stats.draft}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-orange-100 dark:border-orange-900/30 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Archived
              </p>
              <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                {stats.archived}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <Archive className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 p-6 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search by title, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-warm-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="published">Published</option>
            <option value="draft">Draft</option>
            <option value="archived">Archived</option>
          </select>
        </div>
      </div>

      {/* Quizzes Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : quizzes.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              No quizzes found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : "Create your first quiz to get started"}
            </p>
            {!searchTerm && statusFilter === "all" && (
              <Button onClick={handleCreateClick}>
                <Plus className="w-4 h-4 mr-2" />
                Create Quiz
              </Button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-warm-50 to-orange-50 dark:from-neutral-900 dark:to-neutral-800 border-b-2 border-warm-200 dark:border-warm-800">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[30%]">
                    Title
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[15%]">
                    Category
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[10%]">
                    Difficulty
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[10%]">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[15%]">
                    Stats
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[12%]">
                    Published
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[8%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 dark:divide-neutral-700">
                {quizzes.map((quiz, index) => (
                  <tr
                    key={quiz.id}
                    className={`hover:bg-warm-50/50 dark:hover:bg-neutral-800/50 transition-all duration-200 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-neutral-800"
                        : "bg-neutral-50/30 dark:bg-neutral-850/30"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <Link
                          href={`/quiz/${quiz.id}`}
                          className="font-semibold text-neutral-900 dark:text-white hover:text-warm-600 dark:hover:text-warm-400 transition-colors line-clamp-2 leading-tight"
                        >
                          {quiz.title}
                        </Link>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 text-xs bg-gradient-to-r from-warm-100 to-orange-100 dark:from-warm-900/30 dark:to-orange-900/30 text-warm-700 dark:text-warm-300 rounded-md font-medium">
                        {quiz.category}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {quiz.difficulty}
                      </span>
                    </td>
                    <td className="px-4 py-4">{getStatusBadge(quiz.status)}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-md">
                          <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                          <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                            {quiz.viewCount}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 px-2.5 py-1 bg-green-50 dark:bg-green-900/20 rounded-md">
                          <span className="text-xs">✓</span>
                          <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                            {quiz.attemptCount}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {quiz.publishedAt
                            ? format(new Date(quiz.publishedAt), "MMM dd, yyyy")
                            : "Not published"}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => router.push(`/quiz/${quiz.id}`)}
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditClick(quiz)}
                          >
                            <FileText className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(quiz)}
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

      {/* Create/Edit Quiz Dialog - Part 2 will continue in next file due to size */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Quiz" : "Create New Quiz"}
            </DialogTitle>
            <DialogDescription>
              {isEditing
                ? "Update the quiz details and questions"
                : "Fill in the quiz details and add questions"}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-5">
              <div className="border-b-2 border-warm-200 dark:border-warm-800 pb-3">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                  Basic Information
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                  Fill in the quiz details and metadata
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Quiz Title *</Label>
                  <Input
                    id="title"
                    {...register("title")}
                    placeholder="Enter quiz title"
                  />
                  {errors.title && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    {...register("category")}
                    placeholder="e.g., Technology, Programming"
                  />
                  {errors.category && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.category.message}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter quiz description"
                  rows={3}
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-warm-500 focus:border-transparent"
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="difficulty">Difficulty *</Label>
                  <select
                    id="difficulty"
                    {...register("difficulty")}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-warm-500 focus:border-transparent"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                  {errors.difficulty && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.difficulty.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="estimatedTime">Estimated Time *</Label>
                  <Input
                    id="estimatedTime"
                    {...register("estimatedTime")}
                    placeholder="e.g., 5, 10 min, 10-15 min"
                  />
                  {errors.estimatedTime && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <span className="text-red-500">⚠</span>
                      {errors.estimatedTime.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="status">Status *</Label>
                  <select
                    id="status"
                    {...register("status")}
                    className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-600 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-warm-500 focus:border-transparent"
                  >
                    <option value="draft">Draft</option>
                    <option value="published">Published</option>
                  </select>
                </div>
              </div>

              {/* Featured Image Upload */}
              <div>
                <Label className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                  Featured Image (Optional)
                </Label>
                <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1 mb-3">
                  Image will be uploaded automatically when you submit the quiz
                </p>
                <div className="mt-2 space-y-4">
                  {featuredImagePreview ? (
                    <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-warm-300 dark:border-warm-700 shadow-md">
                      <Image
                        src={featuredImagePreview}
                        alt="Featured image preview"
                        fill
                        className="object-cover"
                      />
                      <button
                        type="button"
                        onClick={handleRemoveImage}
                        className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-all shadow-lg hover:scale-110"
                      >
                        <X className="w-5 h-5" />
                      </button>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                        <p className="text-white text-sm font-medium flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Ready to upload on submit
                        </p>
                      </div>
                    </div>
                  ) : (
                    <label className="block w-full h-64 border-2 border-dashed border-warm-300 dark:border-warm-700 rounded-xl hover:border-warm-500 dark:hover:border-warm-500 transition-all cursor-pointer bg-gradient-to-br from-warm-50/50 to-orange-50/30 dark:from-warm-900/10 dark:to-orange-900/10 hover:shadow-md">
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-warm-400 to-warm-600 flex items-center justify-center mb-4 shadow-lg">
                          <Upload className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-base font-semibold text-neutral-900 dark:text-white mb-1">
                          Click to upload featured image
                        </p>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          PNG, JPG, WebP, GIF (max 5MB)
                        </p>
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Questions */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white">
                    Questions
                  </h3>
                  <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                    Add at least one question with 4 options each
                  </p>
                </div>
                <Button
                  type="button"
                  onClick={() =>
                    appendQuestion({
                      questionText: "",
                      options: [
                        { optionText: "", isCorrect: false },
                        { optionText: "", isCorrect: false },
                        { optionText: "", isCorrect: false },
                        { optionText: "", isCorrect: false },
                      ],
                    })
                  }
                  className="bg-gradient-to-r from-warm-500 to-orange-600 hover:from-warm-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Question
                </Button>
              </div>

              {questionFields.map((field, questionIndex) => (
                <div
                  key={field.id}
                  className="p-6 border-2 border-warm-200 dark:border-warm-800 rounded-xl space-y-4 bg-gradient-to-br from-white to-warm-50/30 dark:from-neutral-800 dark:to-warm-900/10 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-warm-400 to-warm-600 flex items-center justify-center text-white font-bold text-sm">
                        {questionIndex + 1}
                      </div>
                      <Label className="text-base font-semibold text-neutral-800 dark:text-neutral-200">
                        Question {questionIndex + 1} *
                      </Label>
                    </div>
                    {questionFields.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeQuestion(questionIndex)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 -mt-1"
                      >
                        <X className="w-5 h-5" />
                      </Button>
                    )}
                  </div>

                  <textarea
                    {...register(`questions.${questionIndex}.questionText`)}
                    placeholder="Enter your question here..."
                    rows={3}
                    className="w-full px-4 py-3 border-2 border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-warm-500 focus:border-warm-500 transition-all placeholder:text-neutral-400"
                  />
                  {errors.questions?.[questionIndex]?.questionText && (
                    <p className="text-sm text-red-600 mt-1 flex items-center gap-1">
                      <span className="text-red-500">⚠</span>
                      {errors.questions[questionIndex]?.questionText?.message}
                    </p>
                  )}

                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Options (Click radio button to mark correct answer)
                    </Label>
                    {[0, 1, 2, 3].map((optionIndex) => {
                      const isCorrect = watch(
                        `questions.${questionIndex}.options.${optionIndex}.isCorrect`
                      );
                      return (
                        <div
                          key={optionIndex}
                          className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                            isCorrect
                              ? "border-green-500 bg-green-50 dark:bg-green-900/20"
                              : "border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800"
                          }`}
                        >
                          <input
                            type="radio"
                            name={`question-${questionIndex}-correct`}
                            checked={isCorrect}
                            onChange={() => {
                              // Set all options to false first
                              [0, 1, 2, 3].forEach((i) => {
                                setValue(
                                  `questions.${questionIndex}.options.${i}.isCorrect`,
                                  i === optionIndex
                                );
                              });
                            }}
                            className="w-5 h-5 text-green-600 focus:ring-green-500 cursor-pointer"
                          />
                          <Input
                            {...register(
                              `questions.${questionIndex}.options.${optionIndex}.optionText`
                            )}
                            placeholder={`Option ${optionIndex + 1}`}
                            className="flex-1 border-0 focus:ring-0 bg-transparent"
                          />
                          {isCorrect && (
                            <span className="text-xs font-semibold text-green-600 dark:text-green-400 px-2 py-1 bg-green-100 dark:bg-green-900/40 rounded">
                              Correct
                            </span>
                          )}
                        </div>
                      );
                    })}
                    {errors.questions?.[questionIndex]?.options && (
                      <p className="text-sm text-red-600 mt-1">
                        {errors.questions[questionIndex]?.options?.message ||
                          "Please fill all options and select one correct answer"}
                      </p>
                    )}
                  </div>
                </div>
              ))}

              {errors.questions &&
                typeof errors.questions.message === "string" && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.questions.message}
                  </p>
                )}
            </div>

            <DialogFooter className="gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
                disabled={isSubmitting}
                className="border-neutral-300 dark:border-neutral-600"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-warm-500 to-orange-600 hover:from-warm-600 hover:to-orange-700 text-white shadow-md hover:shadow-lg transition-all min-w-[140px]"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isEditing ? "Updating..." : "Creating..."}
                  </>
                ) : (
                  <>{isEditing ? "Update Quiz" : "Create Quiz"}</>
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Quiz</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{quizToDelete?.title}"? This
              action cannot be undone and will also delete all questions,
              options, and attempts associated with this quiz.
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
