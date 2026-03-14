"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLink } from "lucide-react";

export const NewsArticleContent = () => {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white dark:bg-[#0D0D0D]"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Introduction Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
            Introduction
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              Duis aute irure dolor in reprehenderit in voluptate velit esse
              cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
              cupidatat non proident, sunt in culpa qui officia deserunt mollit
              anim id est laborum.
            </p>
          </div>
        </motion.section>

        {/* First Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mb-12"
        >
          <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden">
            <Image
              src="/images/news-image-one.jpg"
              alt="Team collaboration in modern office"
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <ExternalLink className="w-4 h-4" />
            <span>Image courtesy of Moose Photos via Pexels</span>
          </div>
        </motion.div>

        {/* More Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mb-12"
        >
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              Sed ut perspiciatis unde omnis iste natus error sit voluptatem
              accusantium doloremque laudantium, totam rem aperiam, eaque ipsa
              quae ab illo inventore veritatis et quasi architecto beatae vitae
              dicta sunt explicabo.
            </p>
          </div>
        </motion.div>

        {/* Quote Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-12"
        >
          <blockquote className="border-l-4 border-orange-500 pl-6 py-4">
            <p className="text-lg md:text-xl italic text-neutral-700 dark:text-neutral-300 mb-4 leading-relaxed">
              "In a world older and more complete than ours they move finished
              and complete, gifted with extensions of the senses we have lost or
              never attained, living by voices we shall never hear."
            </p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-full flex items-center justify-center">
                <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-300">
                  OR
                </span>
              </div>
              <div>
                <p className="font-semibold text-neutral-900 dark:text-white">
                  Olivia Rhye
                </p>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  Product Designer
                </p>
              </div>
            </div>
          </blockquote>
        </motion.div>

        {/* Software and Tools Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
            Software and tools
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut fugit, sed quia consequuntur magni dolores eos qui ratione
              voluptatem sequi nesciunt.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet,
              consectetur, adipisci velit, sed quia non numquam eius modi
              tempora incidunt ut labore et dolore magnam aliquam quaerat
              voluptatem.
            </p>
          </div>
        </motion.section>

        {/* Other Resources Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-neutral-900 dark:text-white mb-6">
            Other resources
          </h2>
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              At vero eos et accusamus et iusto odio dignissimos ducimus qui
              blanditiis praesentium voluptatum deleniti atque corrupti quos
              dolores et quas molestias excepturi sint occaecati cupiditate non
              provident.
            </p>
            <ol className="list-decimal list-inside space-y-3 text-neutral-700 dark:text-neutral-300">
              <li>Lectus id duis vitae porttitor enim gravida morbi.</li>
              <li>
                Eu turpis posuere semper feugiat volutpat elit, ultrices
                suspendisse. Auctor vel in vitae placerat.
              </li>
              <li>
                Suspendisse maecenas ac donec scelerisque diam sed est duis
                purus.
              </li>
            </ol>
          </div>
        </motion.section>

        {/* Second Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mb-12"
        >
          <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden">
            <Image
              src="/images/news-image-two.jpg"
              alt="Golden retriever dog"
              fill
              className="object-cover"
            />
          </div>
          <div className="mt-4 flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
            <ExternalLink className="w-4 h-4" />
            <span>Image courtesy of Helena Lopes via Pexels</span>
          </div>
        </motion.div>

        {/* Conclusion */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          className="mb-12"
        >
          <div className="prose prose-lg max-w-none">
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              Similique sunt in culpa qui officia deserunt mollitia animi, id
              est laborum et dolorum fuga. Et harum quidem rerum facilis est et
              expedita distinctio.
            </p>
            <p className="text-neutral-700 dark:text-neutral-300 mb-6 leading-relaxed">
              Nam libero tempore, cum soluta nobis est eligendi optio cumque
              nihil impedit quo minus id quod maxime placeat facere possimus,
              omnis voluptas assumenda est, omnis dolor repellendus.
            </p>
          </div>
        </motion.div>
      </div>
    </motion.article>
  );
};
