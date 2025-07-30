import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getUserProfileAction } from "@/app/(dashboard)/actions/profile-actions";

export default async function DashboardHomePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // Check if user has completed profile
  const profileResult = await getUserProfileAction();
  if (!profileResult.success || !profileResult.data?.hasCompletedProfile) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900">
      {/* Header */}
      <div className="bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800">
        <div className="container mx-auto px-4 py-6">
          <div className="max-w-[1010px] mx-auto">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-[#334155] dark:text-neutral-100">
                  Welcome back!
                </h1>
                <p className="text-[#64748B] dark:text-neutral-400 mt-1">
                  Here's what's happening with your profile today.
                </p>
              </div>
              <div className="flex items-center gap-4">
                <button className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5z"
                    />
                  </svg>
                </button>
                <button className="p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100">
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 17h5l-5 5v-5z"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-slate-100 dark:bg-neutral-800 min-h-[calc(100vh-120px)]">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-[1010px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6">
                  <div className="text-center">
                    {/* Profile Picture */}
                    <div className="relative w-24 h-24 mx-auto mb-4">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-blue-400 flex items-center justify-center">
                        <svg
                          className="w-12 h-12 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                    </div>

                    {/* Name and Account Type */}
                    <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100 mb-2">
                      {profileResult.data?.firstName}{" "}
                      {profileResult.data?.lastName}
                    </h2>
                    <span className="inline-block px-3 py-1 bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium mb-4">
                      {profileResult.data?.accountType}
                    </span>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mb-6">
                      <button className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                        Edit Profile
                      </button>
                      <button className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors">
                        Create a post
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column - Content */}
              <div className="lg:col-span-2 space-y-6">
                {/* About Me Section */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    About me
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">
                    I'm a Product Designer based in Melbourne, Australia. I
                    enjoy working on product design, design systems, and Webflow
                    projects, but I don't take myself too seriously. I've worked
                    with some of the world's most exciting companies, including
                    Coinbase, Stripe, and Linear. I'm passionate about helping
                    startups grow, improve their UX and customer experience, and
                    to raise venture capital through good design.
                  </p>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed mt-4">
                    My work has been featured on Typewolf, Mindsparkle Magazine,
                    Webflow, Fonts In Use, CSS Winner, httpster, Siteinspire,
                    and Best Website Gallery.
                  </p>
                  <button className="text-orange-500 hover:text-orange-600 font-medium mt-4">
                    Read more
                  </button>
                </div>

                {/* Contact Information */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">🇦🇺</span>
                      <span className="text-neutral-700 dark:text-neutral-300">
                        Melbourne, Australia
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-700 dark:text-neutral-300">
                        rileyomoore.com
                      </span>
                      <svg
                        className="w-4 h-4 text-neutral-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-700 dark:text-neutral-300">
                        @riley
                      </span>
                      <svg
                        className="w-4 h-4 text-neutral-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-neutral-700 dark:text-neutral-300">
                        hello@rileyomoore.com
                      </span>
                      <svg
                        className="w-4 h-4 text-neutral-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Experience Section */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-4">
                    Experience
                  </h3>
                  <div className="space-y-4">
                    {/* Experience Item 1 */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                          Lead Product Designer
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Polymath • Full-time
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-500">
                          May 2020 - Present
                        </p>
                      </div>
                    </div>

                    {/* Experience Item 2 */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                      <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                          Product Designer
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Spherule • Full-time
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-500">
                          Jan 2018 - May 2020
                        </p>
                      </div>
                    </div>

                    {/* Experience Item 3 */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                      <div className="w-12 h-12 bg-black rounded-full flex items-center justify-center flex-shrink-0">
                        <div className="w-6 h-6 bg-white rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                          UX Designer
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          Acme Group • Full-time
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-500">
                          Mar 2017 - Jan 2018
                        </p>
                      </div>
                    </div>

                    {/* Experience Item 4 */}
                    <div className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-neutral-800 rounded-lg">
                      <div className="w-12 h-12 bg-blue-400 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-6 h-6 text-white"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M3 15a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zM3 7a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V7z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-neutral-900 dark:text-neutral-100">
                          Visual Designer
                        </h4>
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">
                          CloudWatch • Full-time
                        </p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-500">
                          Apr 2015 - Mar 2017
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Skills Section */}
                <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                      Skills
                    </h3>
                    <button className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300">
                      <svg
                        className="w-5 h-5"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                      </svg>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Skill Name",
                      "Skill Name",
                      "Skill Name",
                      "Skill Name",
                      "Skill Name",
                    ].map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
