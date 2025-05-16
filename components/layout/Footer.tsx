"use client";

import Link from "next/link";
import { Logo } from "@/components/common/Logo";
import Newsletter from "@/components/specific/Newsletter";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white">
      {/* Newsletter Section */}
      <div className="container mx-auto px-8 py-12">
        <Newsletter />
      </div>

      {/* Divider */}
      <div className="container mx-auto px-8">
        <div className="border-t border-warm-200" />
      </div>

      {/* Links Section */}
      <div className="container mx-auto px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-semibold text-sm mb-4 text-warm-50">
              Quick Links
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-peach-50 font-semibold hover:text-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-peach-50 font-semibold hover:text-white"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-peach-50 font-semibold hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 text-warm-50">Jobs</h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/jobs"
                  className="text-peach-50 font-semibold hover:text-white"
                >
                  Job Opportunities
                </Link>
              </li>
              <li>
                <Link
                  href="/cv-review"
                  className="text-peach-50 font-semibold hover:text-white"
                >
                  CV Review
                </Link>
              </li>
              <li>
                <Link
                  href="/articles"
                  className="text-peach-50 font-semibold hover:text-white"
                >
                  Articles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-sm mb-4 text-warm-50">
              Lifestyle
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/lifestyle"
                  className="text-peach-50 font-semibold hover:text-white"
                >
                  Lifestyle
                </Link>
              </li>
              <li>
                <Link
                  href="/hotels-restaurants"
                  className="text-peach-50 font-semibold hover:text-white"
                >
                  Hotels & Restaurants
                </Link>
              </li>
              <li>
                <Link
                  href="/travel-tourism"
                  className="text-peach-50 font-semibold hover:text-white"
                >
                  Travel & Tourism
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="container mx-auto px-8">
        <div className="border-t border-warm-200" />
      </div>

      {/* Logo & Copyright */}
      <div className="container mx-auto px-8 py-8">
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-4">
          <Logo variant="white" />
          <p className="text-warm-50">
            © {currentYear} Kracada. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
