"use client";

import { useEffect, useState } from "react";
import {
  Search,
  Eye,
  EyeOff,
  Trash2,
  MoreVertical,
  Hotel as HotelIcon,
  UtensilsCrossed,
  MapPin,
} from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  getAdminHotelsAction,
  getAdminRestaurantsAction,
  deleteHotelAction,
  deleteRestaurantAction,
  toggleHotelPublishAction,
  toggleRestaurantPublishAction,
} from "@/app/(dashboard)/actions/hospitality-management-actions";
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

interface Hotel {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  pricePerNight: number;
  currency: string;
  rating: string;
  reviewCount: number;
  featuredImage: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    fullName: string | null;
    email: string;
  } | null;
}

interface Restaurant {
  id: string;
  name: string;
  description: string;
  location: string;
  category: string;
  cuisine: string;
  priceRange: string;
  rating: string;
  reviewCount: number;
  featuredImage: string | null;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  owner: {
    id: string;
    fullName: string | null;
    email: string;
  } | null;
}

type ActiveView = "hotels" | "restaurants";

export default function HospitalityManagementContent() {
  const router = useRouter();
  const [activeView, setActiveView] = useState<ActiveView>("hotels");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
    type: "hotel" | "restaurant";
  } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState({
    totalHotels: 0,
    publishedHotels: 0,
    draftHotels: 0,
    totalRestaurants: 0,
    publishedRestaurants: 0,
    draftRestaurants: 0,
  });

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset to page 1 when filters or view change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter, activeView]);

  // Fetch stats on mount and after actions
  useEffect(() => {
    fetchStats();
  }, []);

  // Fetch items when view, page, or filters change
  useEffect(() => {
    if (activeView === "hotels") {
      fetchHotels();
    } else {
      fetchRestaurants();
    }
  }, [currentPage, debouncedSearchTerm, statusFilter, activeView]);

  const fetchStats = async () => {
    // Fetch all hotels
    const hotelsResult = await getAdminHotelsAction({ limit: 1000 });
    if (hotelsResult.success && hotelsResult.data) {
      const allHotels = hotelsResult.data.hotels;
      setStats((prev) => ({
        ...prev,
        totalHotels: allHotels.length,
        publishedHotels: allHotels.filter((h: any) => h.isPublished).length,
        draftHotels: allHotels.filter((h: any) => !h.isPublished).length,
      }));
    }

    // Fetch all restaurants
    const restaurantsResult = await getAdminRestaurantsAction({ limit: 1000 });
    if (restaurantsResult.success && restaurantsResult.data) {
      const allRestaurants = restaurantsResult.data.restaurants;
      setStats((prev) => ({
        ...prev,
        totalRestaurants: allRestaurants.length,
        publishedRestaurants: allRestaurants.filter((r: any) => r.isPublished)
          .length,
        draftRestaurants: allRestaurants.filter((r: any) => !r.isPublished)
          .length,
      }));
    }
  };

  const fetchHotels = async () => {
    setIsLoading(true);
    const result = await getAdminHotelsAction({
      page: currentPage,
      limit: 10,
      status: statusFilter !== "all" ? (statusFilter as any) : undefined,
      search: debouncedSearchTerm || undefined,
    });

    if (result.success && result.data) {
      setHotels(result.data.hotels as Hotel[]);
      setTotalPages(result.data.pagination.totalPages);
      setTotalCount(result.data.pagination.total);
    } else {
      toast.error("Failed to load hotels");
    }
    setIsLoading(false);
  };

  const fetchRestaurants = async () => {
    setIsLoading(true);
    const result = await getAdminRestaurantsAction({
      page: currentPage,
      limit: 10,
      status: statusFilter !== "all" ? (statusFilter as any) : undefined,
      search: debouncedSearchTerm || undefined,
    });

    if (result.success && result.data) {
      setRestaurants(result.data.restaurants as Restaurant[]);
      setTotalPages(result.data.pagination.totalPages);
      setTotalCount(result.data.pagination.total);
    } else {
      toast.error("Failed to load restaurants");
    }
    setIsLoading(false);
  };

  const getStatusBadge = (isPublished: boolean) => {
    if (isPublished) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-green-700 bg-green-100 dark:bg-green-900/30 dark:text-green-300 border border-green-300 dark:border-green-700">
          Published
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-gray-700 bg-gray-100 dark:bg-gray-800 dark:text-gray-300 border border-gray-300 dark:border-gray-600">
        Hidden
      </span>
    );
  };

  const handleDeleteClick = (
    id: string,
    name: string,
    type: "hotel" | "restaurant"
  ) => {
    setItemToDelete({ id, name, type });
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!itemToDelete) return;

    setIsDeleting(true);
    const result =
      itemToDelete.type === "hotel"
        ? await deleteHotelAction(itemToDelete.id)
        : await deleteRestaurantAction(itemToDelete.id);

    if (result.success) {
      toast.success(result.message);
      setIsDeleteModalOpen(false);
      setItemToDelete(null);
      if (activeView === "hotels") {
        fetchHotels();
      } else {
        fetchRestaurants();
      }
      fetchStats();
    } else {
      toast.error(result.message || "Failed to delete item");
    }
    setIsDeleting(false);
  };

  const handleTogglePublish = async (
    id: string,
    type: "hotel" | "restaurant"
  ) => {
    const result =
      type === "hotel"
        ? await toggleHotelPublishAction(id)
        : await toggleRestaurantPublishAction(id);

    if (result.success) {
      toast.success(result.message);
      if (activeView === "hotels") {
        fetchHotels();
      } else {
        fetchRestaurants();
      }
      fetchStats();
    } else {
      toast.error(result.message || "Failed to toggle status");
    }
  };

  const currentItems = activeView === "hotels" ? hotels : restaurants;

  return (
    <div className="space-y-6">
      {/* Header with gradient */}
      <div className="relative overflow-hidden bg-gradient-to-br from-warm-200 via-warm-700 to-warm-800 rounded-2xl p-8 shadow-lg">
        <div className="relative z-10">
          <h1 className="text-4xl font-bold text-white mb-2">
            Hospitality Management
          </h1>
          <p className="text-warm-50 text-lg">
            Manage hotels and restaurants, moderate content, and review user
            listings
          </p>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full -ml-24 -mb-24"></div>
      </div>

      {/* Tab Switcher */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 shadow-sm">
        <div className="flex border-b border-warm-100 dark:border-neutral-700">
          <button
            onClick={() => setActiveView("hotels")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors relative ${
              activeView === "hotels"
                ? "text-warm-600 dark:text-warm-400"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <HotelIcon className="w-5 h-5" />
            Hotels ({stats.totalHotels})
            {activeView === "hotels" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-warm-200 to-peach-200"></div>
            )}
          </button>
          <button
            onClick={() => setActiveView("restaurants")}
            className={`flex-1 flex items-center justify-center gap-2 px-6 py-4 font-semibold transition-colors relative ${
              activeView === "restaurants"
                ? "text-warm-600 dark:text-warm-400"
                : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            }`}
          >
            <UtensilsCrossed className="w-5 h-5" />
            Restaurants ({stats.totalRestaurants})
            {activeView === "restaurants" && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-warm-200 to-peach-200"></div>
            )}
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 border border-warm-100 dark:border-neutral-700 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                Total {activeView === "hotels" ? "Hotels" : "Restaurants"}
              </p>
              <p className="text-3xl font-bold text-neutral-900 dark:text-white">
                {activeView === "hotels"
                  ? stats.totalHotels
                  : stats.totalRestaurants}
              </p>
            </div>
            <div className="w-12 h-12 bg-warm-100 dark:bg-warm-900/30 rounded-lg flex items-center justify-center">
              {activeView === "hotels" ? (
                <HotelIcon className="w-6 h-6 text-warm-600 dark:text-warm-400" />
              ) : (
                <UtensilsCrossed className="w-6 h-6 text-warm-600 dark:text-warm-400" />
              )}
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
                {activeView === "hotels"
                  ? stats.publishedHotels
                  : stats.publishedRestaurants}
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
                Hidden
              </p>
              <p className="text-3xl font-bold text-gray-600 dark:text-gray-400">
                {activeView === "hotels"
                  ? stats.draftHotels
                  : stats.draftRestaurants}
              </p>
            </div>
            <div className="w-12 h-12 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
              <EyeOff className="w-6 h-6 text-gray-600 dark:text-gray-400" />
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
              placeholder={`Search ${activeView} by name, location${activeView === "restaurants" ? ", cuisine" : ""}...`}
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
            <option value="published">Published</option>
            <option value="draft">Hidden</option>
          </select>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white dark:bg-neutral-800 rounded-xl border border-warm-100 dark:border-neutral-700 shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Spinner />
          </div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-12">
            {activeView === "hotels" ? (
              <HotelIcon className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            ) : (
              <UtensilsCrossed className="w-12 h-12 text-neutral-300 dark:text-neutral-600 mx-auto mb-4" />
            )}
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
              No {activeView} found
            </h3>
            <p className="text-neutral-600 dark:text-neutral-400 mb-4">
              {searchTerm || statusFilter !== "all"
                ? "Try adjusting your filters"
                : `No ${activeView} have been listed yet`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-warm-50 to-orange-50 dark:from-neutral-900 dark:to-neutral-800 border-b-2 border-warm-200 dark:border-warm-800">
                <tr>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[25%]">
                    Name
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[15%]">
                    Location
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[12%]">
                    Owner
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[10%]">
                    Status
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[12%]">
                    Rating
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[15%]">
                    Created
                  </th>
                  <th className="px-4 py-4 text-right text-xs font-semibold text-warm-900 dark:text-warm-100 uppercase tracking-wider w-[8%]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-100 dark:divide-neutral-700">
                {currentItems.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`hover:bg-warm-50/50 dark:hover:bg-neutral-800/50 transition-all duration-200 ${
                      index % 2 === 0
                        ? "bg-white dark:bg-neutral-800"
                        : "bg-neutral-50/30 dark:bg-neutral-850/30"
                    }`}
                  >
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <Link
                          href={`/hotels-restaurants/${activeView}/${item.id}`}
                          className="font-semibold text-neutral-900 dark:text-white hover:text-warm-600 dark:hover:text-warm-400 transition-colors line-clamp-1 leading-tight mb-1"
                        >
                          {item.name}
                        </Link>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          {item.category}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1 text-sm text-neutral-600 dark:text-neutral-400">
                        <MapPin className="w-3.5 h-3.5" />
                        <span className="line-clamp-1">{item.location}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-warm-400 to-orange-500 flex items-center justify-center text-white text-xs font-bold">
                          {item.owner?.fullName
                            ? item.owner.fullName
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .substring(0, 2)
                            : "?"}
                        </div>
                        <div className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-1">
                          {item.owner?.fullName || "Unknown"}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      {getStatusBadge(item.isPublished)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-1">
                        <span className="text-yellow-500">⭐</span>
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {parseFloat(item.rating || "0").toFixed(1)}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400">
                          ({item.reviewCount})
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                          {format(new Date(item.createdAt), "MMM dd, yyyy")}
                        </span>
                        <span className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          {format(new Date(item.createdAt), "h:mm a")}
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
                            onClick={() =>
                              router.push(
                                `/hotels-restaurants/${activeView}/${item.id}`
                              )
                            }
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleTogglePublish(
                                item.id,
                                activeView === "hotels" ? "hotel" : "restaurant"
                              )
                            }
                          >
                            {item.isPublished ? (
                              <>
                                <EyeOff className="w-4 h-4 mr-2" />
                                Hide
                              </>
                            ) : (
                              <>
                                <Eye className="w-4 h-4 mr-2" />
                                Publish
                              </>
                            )}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() =>
                              handleDeleteClick(
                                item.id,
                                item.name,
                                activeView === "hotels" ? "hotel" : "restaurant"
                              )
                            }
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
            <DialogTitle>
              Delete {itemToDelete?.type === "hotel" ? "Hotel" : "Restaurant"}
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{itemToDelete?.name}"? This
              action cannot be undone and will also delete all reviews and
              bookmarks associated with this listing.
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
