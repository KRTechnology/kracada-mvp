"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Hotel, Restaurant } from "@/lib/db/schema";
import {
  Plus,
  Hotel as HotelIcon,
  UtensilsCrossed,
  Eye,
  EyeOff,
  Pencil,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  deleteHotelAction,
  deleteRestaurantAction,
  toggleHotelPublishAction,
  toggleRestaurantPublishAction,
} from "@/app/(dashboard)/actions/hotels-restaurants-actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/common/alert-dialog";

interface HotelsRestaurantsManagementClientProps {
  hotels: Hotel[];
  restaurants: Restaurant[];
  userId: string;
}

type TabType = "hotels" | "restaurants";

export function HotelsRestaurantsManagementClient({
  hotels: initialHotels,
  restaurants: initialRestaurants,
  userId,
}: HotelsRestaurantsManagementClientProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("hotels");
  const [hotels, setHotels] = useState(initialHotels);
  const [restaurants, setRestaurants] = useState(initialRestaurants);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    type: "hotel" | "restaurant" | null;
    id: string | null;
    name: string;
  }>({ open: false, type: null, id: null, name: "" });
  const [isDeleting, setIsDeleting] = useState(false);

  const handleAddHotel = () => {
    router.push("/dashboard/hotels-restaurants/add-hotel");
  };

  const handleAddRestaurant = () => {
    router.push("/dashboard/hotels-restaurants/add-restaurant");
  };

  const handleEditHotel = (hotelId: string) => {
    router.push(`/dashboard/hotels-restaurants/edit-hotel/${hotelId}`);
  };

  const handleEditRestaurant = (restaurantId: string) => {
    router.push(
      `/dashboard/hotels-restaurants/edit-restaurant/${restaurantId}`
    );
  };

  const handleDeleteHotel = async () => {
    if (!deleteDialog.id) return;

    setIsDeleting(true);
    const result = await deleteHotelAction(deleteDialog.id);
    setIsDeleting(false);

    if (result.success) {
      setHotels(hotels.filter((h) => h.id !== deleteDialog.id));
      toast.success("Hotel deleted successfully");
      setDeleteDialog({ open: false, type: null, id: null, name: "" });
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete hotel");
    }
  };

  const handleDeleteRestaurant = async () => {
    if (!deleteDialog.id) return;

    setIsDeleting(true);
    const result = await deleteRestaurantAction(deleteDialog.id);
    setIsDeleting(false);

    if (result.success) {
      setRestaurants(restaurants.filter((r) => r.id !== deleteDialog.id));
      toast.success("Restaurant deleted successfully");
      setDeleteDialog({ open: false, type: null, id: null, name: "" });
      router.refresh();
    } else {
      toast.error(result.error || "Failed to delete restaurant");
    }
  };

  const handleToggleHotelPublish = async (
    hotelId: string,
    currentStatus: boolean
  ) => {
    const result = await toggleHotelPublishAction(hotelId, !currentStatus);

    if (result.success) {
      setHotels(
        hotels.map((h) =>
          h.id === hotelId ? { ...h, isPublished: !currentStatus } : h
        )
      );
      toast.success(
        !currentStatus ? "Hotel published successfully" : "Hotel unpublished"
      );
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update hotel status");
    }
  };

  const handleToggleRestaurantPublish = async (
    restaurantId: string,
    currentStatus: boolean
  ) => {
    const result = await toggleRestaurantPublishAction(
      restaurantId,
      !currentStatus
    );

    if (result.success) {
      setRestaurants(
        restaurants.map((r) =>
          r.id === restaurantId ? { ...r, isPublished: !currentStatus } : r
        )
      );
      toast.success(
        !currentStatus
          ? "Restaurant published successfully"
          : "Restaurant unpublished"
      );
      router.refresh();
    } else {
      toast.error(result.error || "Failed to update restaurant status");
    }
  };

  const openDeleteDialog = (
    type: "hotel" | "restaurant",
    id: string,
    name: string
  ) => {
    setDeleteDialog({ open: true, type, id, name });
  };

  const handleDelete = () => {
    if (deleteDialog.type === "hotel") {
      handleDeleteHotel();
    } else if (deleteDialog.type === "restaurant") {
      handleDeleteRestaurant();
    }
  };

  const hasHotels = hotels.length > 0;
  const hasRestaurants = restaurants.length > 0;

  return (
    <div className="min-h-screen">
      <div className="mx-4 md:mx-[88px] mt-4 pb-10">
        <div className="bg-white dark:bg-dark-container rounded-2xl shadow-sm overflow-hidden p-6 md:p-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-2">
              Manage Properties
            </h1>
            <p className="text-neutral-600 dark:text-neutral-400">
              Manage your hotels and restaurants
            </p>
          </motion.div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8">
            <button
              onClick={() => setActiveTab("hotels")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
                activeTab === "hotels"
                  ? "text-warm-200"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <HotelIcon className="w-5 h-5" />
              Hotels ({hotels.length})
              {activeTab === "hotels" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-warm-200 to-peach-200 rounded-full"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab("restaurants")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors relative ${
                activeTab === "restaurants"
                  ? "text-warm-200"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <UtensilsCrossed className="w-5 h-5" />
              Restaurants ({restaurants.length})
              {activeTab === "restaurants" && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-warm-200 to-peach-200 rounded-full"></div>
              )}
            </button>
          </div>

          {/* Hotels Tab Content */}
          {activeTab === "hotels" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Your Hotels
                </h2>
                <button
                  onClick={handleAddHotel}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-warm-200 to-peach-200 hover:from-warm-300 hover:to-peach-300 text-white rounded-lg transition-all shadow-sm font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Hotel
                </button>
              </div>

              {hasHotels ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hotels.map((hotel) => (
                    <HotelCard
                      key={hotel.id}
                      hotel={hotel}
                      onEdit={handleEditHotel}
                      onDelete={openDeleteDialog}
                      onTogglePublish={handleToggleHotelPublish}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState type="hotels" onAdd={handleAddHotel} />
              )}
            </motion.div>
          )}

          {/* Restaurants Tab Content */}
          {activeTab === "restaurants" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
                  Your Restaurants
                </h2>
                <button
                  onClick={handleAddRestaurant}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-warm-200 to-peach-200 hover:from-warm-300 hover:to-peach-300 text-white rounded-lg transition-all shadow-sm font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Restaurant
                </button>
              </div>

              {hasRestaurants ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restaurants.map((restaurant) => (
                    <RestaurantCard
                      key={restaurant.id}
                      restaurant={restaurant}
                      onEdit={handleEditRestaurant}
                      onDelete={openDeleteDialog}
                      onTogglePublish={handleToggleRestaurantPublish}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState type="restaurants" onAdd={handleAddRestaurant} />
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={deleteDialog.open}
        onOpenChange={(open) =>
          !isDeleting && setDeleteDialog({ ...deleteDialog, open })
        }
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete "{deleteDialog.name}". This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 hover:bg-red-600"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// Hotel Card Component
function HotelCard({
  hotel,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  hotel: Hotel;
  onEdit: (id: string) => void;
  onDelete: (type: "hotel" | "restaurant", id: string, name: string) => void;
  onTogglePublish: (id: string, currentStatus: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-white to-warm-50/30 dark:from-neutral-800 dark:to-neutral-700/50 rounded-2xl overflow-hidden border border-warm-100/50 dark:border-neutral-600/50 hover:shadow-xl hover:shadow-warm-200/10 dark:hover:shadow-neutral-900/20 transition-all duration-300 hover:-translate-y-1 group"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-warm-100 to-peach-100 dark:from-neutral-700 dark:to-neutral-600 overflow-hidden">
        {hotel.featuredImage ? (
          <Image
            src={hotel.featuredImage}
            alt={hotel.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HotelIcon className="w-16 h-16 text-warm-300 dark:text-warm-200" />
          </div>
        )}
        {/* Published Badge */}
        <div className="absolute top-3 right-3">
          {hotel.isPublished ? (
            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium rounded-full shadow-lg">
              Published
            </span>
          ) : (
            <span className="px-3 py-1 bg-gradient-to-r from-neutral-500 to-neutral-600 text-white text-xs font-medium rounded-full shadow-lg">
              Draft
            </span>
          )}
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 line-clamp-1 group-hover:text-warm-200 transition-colors">
          {hotel.name}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 flex items-center gap-1">
          <span className="w-1 h-1 bg-warm-200 rounded-full"></span>
          {hotel.location}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
          {hotel.description}
        </p>
        <div className="text-xl font-bold bg-gradient-to-r from-warm-200 to-peach-200 bg-clip-text text-transparent mb-4">
          {hotel.currency}
          {hotel.pricePerNight.toLocaleString()}/night
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(hotel.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-warm-100 to-peach-100 dark:from-neutral-700 dark:to-neutral-600 border border-warm-200/50 dark:border-neutral-500 text-neutral-700 dark:text-neutral-300 rounded-xl hover:from-warm-200 hover:to-peach-200 hover:text-white transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onTogglePublish(hotel.id, hotel.isPublished)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            {hotel.isPublished ? (
              <>
                <EyeOff className="w-4 h-4" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Publish
              </>
            )}
          </button>
          <button
            onClick={() => onDelete("hotel", hotel.id, hotel.name)}
            className="px-3 py-2.5 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:from-red-100 hover:to-rose-100 dark:hover:from-red-800/30 dark:hover:to-rose-800/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Restaurant Card Component
function RestaurantCard({
  restaurant,
  onEdit,
  onDelete,
  onTogglePublish,
}: {
  restaurant: Restaurant;
  onEdit: (id: string) => void;
  onDelete: (type: "hotel" | "restaurant", id: string, name: string) => void;
  onTogglePublish: (id: string, currentStatus: boolean) => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-to-br from-white to-peach-50/30 dark:from-neutral-800 dark:to-neutral-700/50 rounded-2xl overflow-hidden border border-peach-100/50 dark:border-neutral-600/50 hover:shadow-xl hover:shadow-peach-200/10 dark:hover:shadow-neutral-900/20 transition-all duration-300 hover:-translate-y-1 group"
    >
      {/* Image */}
      <div className="relative h-48 bg-gradient-to-br from-peach-100 to-orange-100 dark:from-neutral-700 dark:to-neutral-600 overflow-hidden">
        {restaurant.featuredImage ? (
          <Image
            src={restaurant.featuredImage}
            alt={restaurant.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed className="w-16 h-16 text-peach-300 dark:text-peach-200" />
          </div>
        )}
        {/* Published Badge */}
        <div className="absolute top-3 right-3">
          {restaurant.isPublished ? (
            <span className="px-3 py-1 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-medium rounded-full shadow-lg">
              Published
            </span>
          ) : (
            <span className="px-3 py-1 bg-gradient-to-r from-neutral-500 to-neutral-600 text-white text-xs font-medium rounded-full shadow-lg">
              Draft
            </span>
          )}
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 line-clamp-1 group-hover:text-peach-200 transition-colors">
          {restaurant.name}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 flex items-center gap-1">
          <span className="w-1 h-1 bg-peach-200 rounded-full"></span>
          {restaurant.location}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-2">
          {restaurant.description}
        </p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300 bg-peach-100 dark:bg-peach-900/20 px-2 py-1 rounded-lg">
            {restaurant.cuisine}
          </span>
          <span className="text-sm text-neutral-500">•</span>
          <span className="text-sm font-bold bg-gradient-to-r from-peach-200 to-orange-200 bg-clip-text text-transparent">
            {restaurant.priceRange}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(restaurant.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-peach-100 to-orange-100 dark:from-neutral-700 dark:to-neutral-600 border border-peach-200/50 dark:border-neutral-500 text-neutral-700 dark:text-neutral-300 rounded-xl hover:from-peach-200 hover:to-orange-200 hover:text-white transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() =>
              onTogglePublish(restaurant.id, restaurant.isPublished)
            }
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-700 text-blue-700 dark:text-blue-300 rounded-xl hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-800/30 dark:hover:to-indigo-800/30 transition-all duration-200 text-sm font-medium shadow-sm hover:shadow-md"
          >
            {restaurant.isPublished ? (
              <>
                <EyeOff className="w-4 h-4" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="w-4 h-4" />
                Publish
              </>
            )}
          </button>
          <button
            onClick={() =>
              onDelete("restaurant", restaurant.id, restaurant.name)
            }
            className="px-3 py-2.5 bg-gradient-to-r from-red-50 to-rose-50 dark:from-red-900/20 dark:to-rose-900/20 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-400 rounded-xl hover:from-red-100 hover:to-rose-100 dark:hover:from-red-800/30 dark:hover:to-rose-800/30 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

// Empty State Component
function EmptyState({
  type,
  onAdd,
}: {
  type: "hotels" | "restaurants";
  onAdd: () => void;
}) {
  const isHotel = type === "hotels";
  const Icon = isHotel ? HotelIcon : UtensilsCrossed;
  const gradientColors = isHotel
    ? "from-warm-100 to-peach-100 dark:from-warm-900/20 dark:to-peach-900/20"
    : "from-peach-100 to-orange-100 dark:from-peach-900/20 dark:to-orange-900/20";
  const iconColor = isHotel
    ? "text-warm-300 dark:text-warm-200"
    : "text-peach-300 dark:text-peach-200";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-20 px-4 text-center"
    >
      <div
        className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${gradientColors} flex items-center justify-center mb-6 shadow-lg`}
      >
        <Icon className={`w-12 h-12 ${iconColor}`} />
      </div>
      <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-3">
        No {type} yet
      </h3>
      <p className="text-neutral-600 dark:text-neutral-400 mb-8 max-w-md text-lg">
        You haven't added any {type} yet. Start by adding your first{" "}
        {isHotel ? "hotel" : "restaurant"} to showcase your business.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-warm-200 to-peach-200 hover:from-warm-300 hover:to-peach-300 text-white rounded-xl transition-all duration-300 shadow-xl hover:shadow-2xl font-semibold text-lg hover:-translate-y-1"
      >
        <Plus className="w-6 h-6" />
        Add {isHotel ? "Hotel" : "Restaurant"}
      </button>
    </motion.div>
  );
}
