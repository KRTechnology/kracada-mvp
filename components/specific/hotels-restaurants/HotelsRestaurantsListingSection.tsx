"use client";

import { HotelsRestaurantsSubTabType } from "@/components/specific/dashboard/SubTabSwitcher";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { useState, useRef } from "react";
import { HotelCard } from "./HotelCard";
import { RestaurantCard } from "./RestaurantCard";
import { Pagination } from "@/components/common/Pagination";

// Types for content items
interface Hotel {
  id: number;
  name: string;
  description: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  pricePerNight: number;
  currency: string;
  amenities: string[];
  category: string;
}

interface Restaurant {
  id: number;
  name: string;
  description: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  cuisine: string;
  category: string;
  openingHours: string;
  contact: string;
}

// Sample Lagos hotels data
const lagosHotelsData: Hotel[] = [
  {
    id: 1,
    name: "Eko Hotel & Suites",
    description:
      "Luxury waterfront hotel with stunning Lagos lagoon views, world-class amenities and exceptional service.",
    image: "/images/hotel-image-one.jpg",
    location: "Victoria Island, Lagos",
    rating: 4.5,
    reviewCount: 1247,
    pricePerNight: 85000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Luxury Hotel",
  },
  {
    id: 2,
    name: "Four Points by Sheraton Lagos",
    description:
      "Modern business hotel located in the heart of Victoria Island with contemporary rooms and facilities.",
    image: "/images/hotel-image-two.jpg",
    location: "Victoria Island, Lagos",
    rating: 4.3,
    reviewCount: 892,
    pricePerNight: 75000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Business Hotel",
  },
  {
    id: 3,
    name: "Radisson Blu Anchorage Hotel",
    description:
      "Upscale hotel with panoramic lagoon views, offering elegant accommodations and premium dining options.",
    image: "/images/hotel-image-three.jpg",
    location: "Victoria Island, Lagos",
    rating: 4.4,
    reviewCount: 1156,
    pricePerNight: 95000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Luxury Hotel",
  },
  {
    id: 4,
    name: "The Wheatbaker Hotel",
    description:
      "Boutique luxury hotel known for its sophisticated design, personalized service and gourmet dining.",
    image: "/images/hotel-image-four.jpg",
    location: "Ikoyi, Lagos",
    rating: 4.6,
    reviewCount: 567,
    pricePerNight: 120000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Boutique Hotel",
  },
  {
    id: 5,
    name: "Lagos Continental Hotel",
    description:
      "Established hotel offering comfortable accommodations with excellent location and reliable service.",
    image: "/images/hotel-image-one.jpg",
    location: "Victoria Island, Lagos",
    rating: 4.1,
    reviewCount: 743,
    pricePerNight: 55000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Business Hotel",
  },
  {
    id: 6,
    name: "Protea Hotel Lagos Kuramo Waters",
    description:
      "Beachfront hotel with private beach access, offering relaxation and tranquility away from the city hustle.",
    image: "/images/hotel-image-two.jpg",
    location: "Victoria Island, Lagos",
    rating: 4.2,
    reviewCount: 634,
    pricePerNight: 68000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Beach Resort",
  },
  {
    id: 7,
    name: "Southern Sun Ikoyi",
    description:
      "Contemporary hotel in upscale Ikoyi district, perfect for business travelers and leisure guests.",
    image: "/images/hotel-image-three.jpg",
    location: "Ikoyi, Lagos",
    rating: 4.3,
    reviewCount: 821,
    pricePerNight: 72000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Business Hotel",
  },
  {
    id: 8,
    name: "InterContinental Lagos",
    description:
      "Premium international hotel brand offering luxury accommodations and world-class hospitality.",
    image: "/images/hotel-image-four.jpg",
    location: "Victoria Island, Lagos",
    rating: 4.5,
    reviewCount: 1089,
    pricePerNight: 110000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Luxury Hotel",
  },
  {
    id: 9,
    name: "Golden Tulip Lagos",
    description:
      "Stylish hotel with modern amenities, offering comfort and convenience in the heart of Lagos.",
    image: "/images/hotel-image-one.jpg",
    location: "Festac Town, Lagos",
    rating: 4.0,
    reviewCount: 456,
    pricePerNight: 42000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Mid-Range Hotel",
  },
  {
    id: 10,
    name: "Lagos Marriott Hotel Ikeja",
    description:
      "International standard hotel near the airport, ideal for business and transit guests.",
    image: "/images/hotel-image-two.jpg",
    location: "Ikeja, Lagos",
    rating: 4.4,
    reviewCount: 967,
    pricePerNight: 78000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Business Hotel",
  },
  {
    id: 11,
    name: "BON Hotel Delta",
    description:
      "Comfortable hotel offering good value accommodation with essential amenities and friendly service.",
    image: "/images/hotel-image-three.jpg",
    location: "Warri, Delta State",
    rating: 3.9,
    reviewCount: 324,
    pricePerNight: 35000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Budget Hotel",
  },
  {
    id: 12,
    name: "The George Hotel",
    description:
      "Boutique hotel with unique character, personalized service and attention to detail.",
    image: "/images/hotel-image-four.jpg",
    location: "Ikoyi, Lagos",
    rating: 4.3,
    reviewCount: 445,
    pricePerNight: 89000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Boutique Hotel",
  },
  {
    id: 13,
    name: "Transcorp Hilton Abuja",
    description:
      "Premier luxury hotel in Nigeria's capital, offering exceptional service and world-class facilities.",
    image: "/images/hotel-image-one.jpg",
    location: "Abuja, FCT",
    rating: 4.6,
    reviewCount: 1534,
    pricePerNight: 125000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Luxury Hotel",
  },
  {
    id: 14,
    name: "Sheraton Lagos Hotel",
    description:
      "Iconic Lagos hotel with rich history, offering timeless elegance and modern comforts.",
    image: "/images/hotel-image-two.jpg",
    location: "Ikeja, Lagos",
    rating: 4.2,
    reviewCount: 678,
    pricePerNight: 82000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Luxury Hotel",
  },
  {
    id: 15,
    name: "Ibis Lagos Ikeja",
    description:
      "Modern economy hotel offering smart accommodation solutions for budget-conscious travelers.",
    image: "/images/hotel-image-three.jpg",
    location: "Ikeja, Lagos",
    rating: 4.0,
    reviewCount: 512,
    pricePerNight: 38000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Budget Hotel",
  },
  {
    id: 16,
    name: "The Civic Centre Hotel",
    description:
      "Central located hotel offering convenient access to Lagos business district and entertainment areas.",
    image: "/images/hotel-image-four.jpg",
    location: "Victoria Island, Lagos",
    rating: 3.8,
    reviewCount: 298,
    pricePerNight: 48000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Mid-Range Hotel",
  },
  {
    id: 17,
    name: "Villa Maha Residence",
    description:
      "Exclusive boutique hotel offering luxury villa-style accommodations with personalized service.",
    image: "/images/hotel-image-one.jpg",
    location: "Lekki, Lagos",
    rating: 4.5,
    reviewCount: 234,
    pricePerNight: 135000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Luxury Resort",
  },
  {
    id: 18,
    name: "Presken Hotel",
    description:
      "Contemporary hotel with modern design and efficient service, perfect for short and extended stays.",
    image: "/images/hotel-image-two.jpg",
    location: "Surulere, Lagos",
    rating: 3.9,
    reviewCount: 387,
    pricePerNight: 45000,
    currency: "₦",
    amenities: ["Wi-Fi", "Parking", "Breakfast"],
    category: "Mid-Range Hotel",
  },
];

// Sample Lagos restaurants data
const lagosRestaurantsData: Restaurant[] = [
  {
    id: 1,
    name: "Sky Restaurant & Bar",
    description:
      "Upscale rooftop dining with panoramic city views, serving international cuisine and premium cocktails.",
    image: "/images/hotel-image-one.jpg",
    location: "Victoria Island, Lagos",
    rating: 4.6,
    reviewCount: 892,
    priceRange: "$$$",
    cuisine: "International",
    category: "Fine Dining",
    openingHours: "6:00 PM - 12:00 AM",
    contact: "+234 801 234 5678",
  },
  {
    id: 2,
    name: "The Yellow Chilli",
    description:
      "Contemporary Nigerian restaurant offering traditional dishes with modern presentation and flavors.",
    image: "/images/hotel-image-two.jpg",
    location: "Ikoyi, Lagos",
    rating: 4.4,
    reviewCount: 567,
    priceRange: "$$",
    cuisine: "Nigerian",
    category: "Local Cuisine",
    openingHours: "11:00 AM - 10:00 PM",
    contact: "+234 802 345 6789",
  },
  {
    id: 3,
    name: "Nkoyo",
    description:
      "Authentic Nigerian cuisine in an elegant setting, specializing in traditional Efik and Ibibio dishes.",
    image: "/images/hotel-image-three.jpg",
    location: "Victoria Island, Lagos",
    rating: 4.5,
    reviewCount: 734,
    priceRange: "$$",
    cuisine: "Nigerian",
    category: "Traditional",
    openingHours: "12:00 PM - 11:00 PM",
    contact: "+234 803 456 7890",
  },
  {
    id: 4,
    name: "Cilantro Restaurant",
    description:
      "Mediterranean and Continental cuisine with fresh ingredients and sophisticated preparation techniques.",
    image: "/images/hotel-image-four.jpg",
    location: "Lekki Phase 1, Lagos",
    rating: 4.3,
    reviewCount: 445,
    priceRange: "$$$",
    cuisine: "Mediterranean",
    category: "Continental",
    openingHours: "12:00 PM - 12:00 AM",
    contact: "+234 804 567 8901",
  },
  {
    id: 5,
    name: "Terra Kulture",
    description:
      "Cultural dining experience featuring Nigerian art, crafts, and authentic local cuisine in a gallery setting.",
    image: "/images/hotel-image-one.jpg",
    location: "Victoria Island, Lagos",
    rating: 4.2,
    reviewCount: 623,
    priceRange: "$$",
    cuisine: "Nigerian",
    category: "Cultural",
    openingHours: "10:00 AM - 9:00 PM",
    contact: "+234 805 678 9012",
  },
  {
    id: 6,
    name: "Shiro Restaurant",
    description:
      "Premium Asian fusion restaurant offering sushi, Chinese, and Japanese cuisine in elegant surroundings.",
    image: "/images/hotel-image-two.jpg",
    location: "Victoria Island, Lagos",
    rating: 4.4,
    reviewCount: 512,
    priceRange: "$$$",
    cuisine: "Asian",
    category: "Asian Fusion",
    openingHours: "5:00 PM - 11:00 PM",
    contact: "+234 806 789 0123",
  },
  {
    id: 7,
    name: "Zuma Grill",
    description:
      "Trendy grill house specializing in premium steaks, grilled seafood, and international comfort food.",
    image: "/images/hotel-image-three.jpg",
    location: "Lekki, Lagos",
    rating: 4.3,
    reviewCount: 389,
    priceRange: "$$$",
    cuisine: "Grill",
    category: "Steakhouse",
    openingHours: "4:00 PM - 12:00 AM",
    contact: "+234 807 890 1234",
  },
  {
    id: 8,
    name: "The Place Restaurant",
    description:
      "Casual dining restaurant known for grilled fish, chicken, and Nigerian favorites in a relaxed atmosphere.",
    image: "/images/hotel-image-four.jpg",
    location: "Ikeja, Lagos",
    rating: 4.1,
    reviewCount: 756,
    priceRange: "$$",
    cuisine: "Nigerian",
    category: "Casual Dining",
    openingHours: "11:00 AM - 11:00 PM",
    contact: "+234 808 901 2345",
  },
  {
    id: 9,
    name: "Dylan's Bar & Grill",
    description:
      "Sports bar and grill offering international dishes, craft cocktails, and live sports entertainment.",
    image: "/images/hotel-image-one.jpg",
    location: "Victoria Island, Lagos",
    rating: 4.0,
    reviewCount: 467,
    priceRange: "$$",
    cuisine: "International",
    category: "Sports Bar",
    openingHours: "12:00 PM - 2:00 AM",
    contact: "+234 809 012 3456",
  },
  {
    id: 10,
    name: "Bukka Hut",
    description:
      "Popular chain restaurant serving affordable Nigerian meals in a fast-casual dining environment.",
    image: "/images/hotel-image-two.jpg",
    location: "Multiple Locations",
    rating: 3.9,
    reviewCount: 1234,
    priceRange: "$",
    cuisine: "Nigerian",
    category: "Fast Casual",
    openingHours: "7:00 AM - 10:00 PM",
    contact: "+234 810 123 4567",
  },
  {
    id: 11,
    name: "Casper & Gambini's",
    description:
      "International café chain offering Mediterranean cuisine, fresh salads, and artisanal coffee.",
    image: "/images/hotel-image-three.jpg",
    location: "Lekki, Lagos",
    rating: 4.2,
    reviewCount: 345,
    priceRange: "$$",
    cuisine: "Mediterranean",
    category: "Café",
    openingHours: "8:00 AM - 10:00 PM",
    contact: "+234 811 234 5678",
  },
  {
    id: 12,
    name: "Jevinik Restaurant",
    description:
      "Family-friendly restaurant serving continental and Nigerian dishes with excellent customer service.",
    image: "/images/hotel-image-four.jpg",
    location: "Ikeja, Lagos",
    rating: 4.0,
    reviewCount: 598,
    priceRange: "$$",
    cuisine: "Continental",
    category: "Family Dining",
    openingHours: "11:00 AM - 10:00 PM",
    contact: "+234 812 345 6789",
  },
  {
    id: 13,
    name: "La Taverna Restaurant",
    description:
      "Italian restaurant offering authentic pasta, pizza, and wine in a cozy Mediterranean atmosphere.",
    image: "/images/hotel-image-one.jpg",
    location: "Victoria Island, Lagos",
    rating: 4.3,
    reviewCount: 423,
    priceRange: "$$",
    cuisine: "Italian",
    category: "Italian",
    openingHours: "12:00 PM - 11:00 PM",
    contact: "+234 813 456 7890",
  },
  {
    id: 14,
    name: "Sailor's Lounge",
    description:
      "Upscale lounge and restaurant with live music, cocktails, and contemporary international cuisine.",
    image: "/images/hotel-image-two.jpg",
    location: "Victoria Island, Lagos",
    rating: 4.1,
    reviewCount: 356,
    priceRange: "$$$",
    cuisine: "International",
    category: "Lounge",
    openingHours: "6:00 PM - 2:00 AM",
    contact: "+234 814 567 8901",
  },
  {
    id: 15,
    name: "Mr. Biggs",
    description:
      "Nigerian fast food chain serving local favorites, fried chicken, and continental dishes since 1973.",
    image: "/images/hotel-image-three.jpg",
    location: "Multiple Locations",
    rating: 3.7,
    reviewCount: 987,
    priceRange: "$",
    cuisine: "Fast Food",
    category: "Fast Food",
    openingHours: "7:00 AM - 10:00 PM",
    contact: "+234 815 678 9012",
  },
  {
    id: 16,
    name: "Brass & Copper Restaurant",
    description:
      "Elegant dining establishment offering refined Nigerian and continental cuisine with excellent wine selection.",
    image: "/images/hotel-image-four.jpg",
    location: "Ikoyi, Lagos",
    rating: 4.4,
    reviewCount: 289,
    priceRange: "$$$",
    cuisine: "Continental",
    category: "Fine Dining",
    openingHours: "6:00 PM - 11:00 PM",
    contact: "+234 816 789 0123",
  },
  {
    id: 17,
    name: "Hashigo Sushi Bar",
    description:
      "Authentic Japanese sushi bar with fresh fish, traditional preparation, and sake selection.",
    image: "/images/hotel-image-one.jpg",
    location: "Lekki, Lagos",
    rating: 4.5,
    reviewCount: 178,
    priceRange: "$$$$",
    cuisine: "Japanese",
    category: "Sushi Bar",
    openingHours: "5:00 PM - 11:00 PM",
    contact: "+234 817 890 1234",
  },
  {
    id: 18,
    name: "Orchid Bistro",
    description:
      "Charming bistro offering French-inspired cuisine, fresh pastries, and artisanal coffee in Lekki.",
    image: "/images/hotel-image-two.jpg",
    location: "Lekki Phase 1, Lagos",
    rating: 4.2,
    reviewCount: 267,
    priceRange: "$$",
    cuisine: "French",
    category: "Bistro",
    openingHours: "8:00 AM - 9:00 PM",
    contact: "+234 818 901 2345",
  },
];

interface HotelsRestaurantsListingSectionProps {
  activeTab?: HotelsRestaurantsSubTabType;
}

export const HotelsRestaurantsListingSection = ({
  activeTab = "Hotels",
}: HotelsRestaurantsListingSectionProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const sectionRef = useRef<HTMLElement>(null);

  // Get data based on active tab
  const getData = () => {
    switch (activeTab) {
      case "Restaurants":
        return lagosRestaurantsData;
      case "Hotels":
      default:
        return lagosHotelsData;
    }
  };

  const data = getData();
  const totalPages = Math.ceil(data.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to the section start instead of top
    if (sectionRef.current) {
      const sectionTop = sectionRef.current.offsetTop;
      const offset = 100; // Add some offset from the top
      window.scrollTo({
        top: sectionTop - offset,
        behavior: "smooth",
      });
    }
  };

  // Get current page items
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = data.slice(startIndex, endIndex);

  return (
    <section ref={sectionRef} className="bg-white dark:bg-dark">
      <div className="container mx-auto px-4 py-12">
        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="bg-gradient-to-r from-warm-50 via-orange-50 to-peach-50 dark:from-neutral-800 dark:via-neutral-700 dark:to-neutral-800 rounded-2xl p-8 shadow-lg border border-warm-100 dark:border-neutral-700">
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder={`Search ${activeTab?.toLowerCase()}...`}
                    className="w-full px-6 py-4 rounded-xl border-2 border-warm-100 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-warm-200 shadow-sm transition-all"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <svg
                      className="w-5 h-5 text-neutral-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <select className="px-6 py-4 rounded-xl border-2 border-warm-100 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-warm-200 shadow-sm transition-all min-w-[140px]">
                  <option>Location</option>
                  <option>Victoria Island</option>
                  <option>Ikoyi</option>
                  <option>Lekki</option>
                  <option>Ikeja</option>
                </select>
                <select className="px-6 py-4 rounded-xl border-2 border-warm-100 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-warm-200 shadow-sm transition-all min-w-[120px]">
                  <option>Rating</option>
                  <option>4+ Stars</option>
                  <option>3+ Stars</option>
                  <option>2+ Stars</option>
                </select>
                <select className="px-6 py-4 rounded-xl border-2 border-warm-100 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-warm-200 focus:border-warm-200 shadow-sm transition-all min-w-[140px]">
                  <option>Price range</option>
                  <option>$ - Budget</option>
                  <option>$$ - Moderate</option>
                  <option>$$$ - Expensive</option>
                  <option>$$$$ - Luxury</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <div className="text-neutral-700 dark:text-neutral-300 font-medium">
                Displaying{" "}
                <span className="text-warm-200 font-bold">{data.length}</span>{" "}
                results
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8 items-stretch"
        >
          {currentItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="h-full"
            >
              {activeTab === "Restaurants" ? (
                <RestaurantCard restaurant={item as Restaurant} index={index} />
              ) : (
                <HotelCard hotel={item as Hotel} index={index} />
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};
