"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";

import {
  Shield,
  Lock,
  Eye,
  Database,
  UserCheck,
  Mail,
  FileText,
  AlertCircle,
} from "lucide-react";
import { LifestyleSubscriptionForm } from "@/components/specific/lifestyle/LifestyleSubscriptionForm";

export default function PrivacyPolicyPage() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const { theme } = useTheme();

  const sections = [
    {
      id: "information-collection",
      icon: Database,
      title: "Information We Collect",
      content:
        "We collect information you provide directly to us, including name, email address, phone number, and any other information you choose to provide. We also automatically collect certain information about your device when you use our services, including IP address, browser type, operating system, and usage data.",
    },
    {
      id: "how-we-use",
      icon: UserCheck,
      title: "How We Use Your Information",
      content:
        "We use the information we collect to provide, maintain, and improve our services, communicate with you, send you updates and marketing materials (with your consent), monitor and analyze trends and usage, detect and prevent fraud and abuse, and comply with legal obligations.",
    },
    {
      id: "information-sharing",
      icon: Eye,
      title: "Information Sharing and Disclosure",
      content:
        "We do not sell your personal information. We may share your information with service providers who perform services on our behalf, when required by law or to protect our rights, in connection with a business transfer or merger, and with your consent or at your direction.",
    },
    {
      id: "data-security",
      icon: Lock,
      title: "Data Security",
      content:
        "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.",
    },
    {
      id: "your-rights",
      icon: Shield,
      title: "Your Rights and Choices",
      content:
        "You have the right to access, correct, or delete your personal information. You can opt out of marketing communications at any time. You may also have additional rights depending on your location, including the right to data portability and the right to object to certain processing activities.",
    },
    {
      id: "cookies",
      icon: FileText,
      title: "Cookies and Tracking Technologies",
      content:
        "We use cookies and similar tracking technologies to collect information about your browsing activities. You can control cookies through your browser settings. Note that disabling cookies may affect the functionality of our services.",
    },
    {
      id: "children",
      icon: AlertCircle,
      title: "Children's Privacy",
      content:
        "Our services are not directed to children under 13 years of age. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us immediately.",
    },
    {
      id: "contact",
      icon: Mail,
      title: "Contact Us",
      content:
        "If you have any questions about this Privacy Policy or our privacy practices, please contact us at info@kimberly-ryan.net.",
    },
  ];

  return (
    <>
      <section
        className={`w-full py-16 ${theme === "dark" ? "bg-peach-600" : "bg-warm-500"}`}
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="text-left space-y-8"
          >
            {/* Lifestyle Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
              className="text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
            >
              Privacy Policy
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
              className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed"
            >
              Your privacy is important to us. This policy explains how we
              collect, use, and protect your personal information.
            </motion.p>

            {/* Subscription Form */}

            {/* Privacy Policy Text */}
          </motion.div>
        </div>
      </section>
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
              At KRACADA, we are committed to protecting your privacy and
              ensuring transparency in how we handle your personal information.
              This Privacy Policy describes our practices concerning the
              collection, use, and disclosure of your information through our
              website, services, and applications.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Quick Navigation */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:col-span-1"
            >
              <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg sticky top-6">
                <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  Quick Navigation
                </h2>
                <nav className="space-y-2">
                  {sections.map((section, index) => (
                    <motion.a
                      key={section.id}
                      href={`#${section.id}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById(section.id)
                          ?.scrollIntoView({ behavior: "smooth" });
                        setActiveSection(section.id);
                      }}
                      className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                        activeSection === section.id
                          ? "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400"
                          : "hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      <section.icon className="w-4 h-4 flex-shrink-0" />
                      <span className="text-sm font-medium">
                        {section.title}
                      </span>
                    </motion.a>
                  ))}
                </nav>
              </div>
            </motion.div>

            {/* Content Sections */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="lg:col-span-2 space-y-8"
            >
              {sections.map((section, index) => (
                <motion.div
                  key={section.id}
                  id={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                      <section.icon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    {section.content}
                  </p>
                </motion.div>
              ))}

              {/* Changes to Policy */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-8 text-white shadow-lg"
              >
                <div className="flex items-start gap-4">
                  <AlertCircle className="w-8 h-8 flex-shrink-0" />
                  <div>
                    <h3 className="text-2xl font-bold mb-4">
                      Changes to This Privacy Policy
                    </h3>
                    <p className="leading-relaxed opacity-90">
                      We may update this Privacy Policy from time to time to
                      reflect changes in our practices or for other operational,
                      legal, or regulatory reasons. We will notify you of any
                      material changes by posting the new Privacy Policy on this
                      page and updating the "Last Updated" date. We encourage
                      you to review this Privacy Policy periodically to stay
                      informed about how we are protecting your information.
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Consent */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white dark:bg-neutral-900 rounded-2xl p-8 shadow-lg border-2 border-orange-200 dark:border-orange-900/50"
              >
                <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">
                  Your Consent
                </h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  By using our services, you consent to the collection and use
                  of your information as described in this Privacy Policy. If
                  you do not agree with this policy, please do not use our
                  services.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
}
