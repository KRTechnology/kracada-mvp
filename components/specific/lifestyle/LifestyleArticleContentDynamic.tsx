"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { LifestyleArticleFooter } from "./LifestyleArticleFooter";

interface LifestyleArticleContentDynamicProps {
  post: any;
}

export function LifestyleArticleContentDynamic({
  post,
}: LifestyleArticleContentDynamicProps) {
  return (
    <motion.article
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white dark:bg-[#0D0D0D]"
    >
      <div className="container mx-auto px-4 py-8">
        {/* Featured Image */}
        {post.featuredImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <div className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden">
              <Image
                src={post.featuredImage}
                alt={post.title}
                fill
                className="object-cover"
              />
            </div>
          </motion.div>
        )}

        {/* Article Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-p:text-neutral-700 dark:prose-p:text-neutral-300 prose-a:text-orange-500 prose-strong:text-neutral-900 dark:prose-strong:text-white prose-img:rounded-lg prose-img:my-4 prose-ul:list-disc prose-ul:pl-6 prose-ol:list-decimal prose-ol:pl-6 prose-li:text-neutral-700 dark:prose-li:text-neutral-300"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Categories */}
        {post.categories && post.categories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mt-12 pt-8 border-t border-neutral-200 dark:border-neutral-700"
          >
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">
              Categories
            </h3>
            <div className="flex flex-wrap gap-2">
              {post.categories.map((category: string) => (
                <span
                  key={category}
                  className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 text-sm rounded-full"
                >
                  {category}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* Article Footer with Comments */}
      <LifestyleArticleFooter postId={post.id} />
    </motion.article>
  );
}
