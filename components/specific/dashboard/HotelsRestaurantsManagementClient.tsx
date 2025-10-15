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
          <div className="flex gap-4 mb-8 border-b border-neutral-200 dark:border-neutral-700">
            <button
              onClick={() => setActiveTab("hotels")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "hotels"
                  ? "border-warm-200 text-warm-200"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <HotelIcon className="w-5 h-5" />
              Hotels ({hotels.length})
            </button>
            <button
              onClick={() => setActiveTab("restaurants")}
              className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors border-b-2 ${
                activeTab === "restaurants"
                  ? "border-warm-200 text-warm-200"
                  : "border-transparent text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
              }`}
            >
              <UtensilsCrossed className="w-5 h-5" />
              Restaurants ({restaurants.length})
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
      className="bg-neutral-50 dark:bg-neutral-800 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative h-48 bg-neutral-200 dark:bg-neutral-700">
        {hotel.featuredImage ? (
          <Image
            src={hotel.featuredImage}
            alt={hotel.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <HotelIcon className="w-16 h-16 text-neutral-400" />
          </div>
        )}
        {/* Published Badge */}
        <div className="absolute top-3 right-3">
          {hotel.isPublished ? (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
              Published
            </span>
          ) : (
            <span className="px-3 py-1 bg-neutral-500 text-white text-xs font-medium rounded-full">
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-1">
          {hotel.name}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
          {hotel.location}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
          {hotel.description}
        </p>
        <div className="text-lg font-bold text-warm-200 mb-4">
          {hotel.currency}
          {hotel.pricePerNight.toLocaleString()}/night
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(hotel.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors text-sm font-medium"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() => onTogglePublish(hotel.id, hotel.isPublished)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors text-sm font-medium"
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
            className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
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
      className="bg-neutral-50 dark:bg-neutral-800 rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 hover:shadow-lg transition-shadow"
    >
      {/* Image */}
      <div className="relative h-48 bg-neutral-200 dark:bg-neutral-700">
        {restaurant.featuredImage ? (
          <Image
            src={restaurant.featuredImage}
            alt={restaurant.name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <UtensilsCrossed className="w-16 h-16 text-neutral-400" />
          </div>
        )}
        {/* Published Badge */}
        <div className="absolute top-3 right-3">
          {restaurant.isPublished ? (
            <span className="px-3 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
              Published
            </span>
          ) : (
            <span className="px-3 py-1 bg-neutral-500 text-white text-xs font-medium rounded-full">
              Draft
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 line-clamp-1">
          {restaurant.name}
        </h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2">
          {restaurant.location}
        </p>
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-2 line-clamp-2">
          {restaurant.description}
        </p>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
            {restaurant.cuisine}
          </span>
          <span className="text-sm text-neutral-500">•</span>
          <span className="text-sm font-bold text-warm-200">
            {restaurant.priceRange}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(restaurant.id)}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors text-sm font-medium"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
          <button
            onClick={() =>
              onTogglePublish(restaurant.id, restaurant.isPublished)
            }
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-white dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-colors text-sm font-medium"
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
            className="px-3 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
        <Icon className="w-10 h-10 text-neutral-400" />
      </div>
      <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2">
        No {type} yet
      </h3>
      <p className="text-neutral-600 dark:text-neutral-400 mb-6 max-w-md">
        You haven't added any {type} yet. Start by adding your first{" "}
        {isHotel ? "hotel" : "restaurant"}.
      </p>
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-warm-200 to-peach-200 hover:from-warm-300 hover:to-peach-300 text-white rounded-lg transition-all shadow-lg font-medium"
      >
        <Plus className="w-5 h-5" />
        Add {isHotel ? "Hotel" : "Restaurant"}
      </button>
    </motion.div>
  );
}
