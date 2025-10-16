"use client";

import { useState } from "react";
import { Plus, X, GripVertical, Utensils } from "lucide-react";
import { Button } from "@/components/common/button";
import { Input } from "@/components/common/input";
import { motion, AnimatePresence } from "framer-motion";

export interface MenuItem {
  name: string;
  description: string;
  price: string;
}

export interface MenuCategory {
  category: string;
  items: MenuItem[];
}

interface MenuBuilderProps {
  menuHighlights: MenuCategory[];
  onChange: (menuHighlights: MenuCategory[]) => void;
}

export function MenuBuilder({ menuHighlights, onChange }: MenuBuilderProps) {
  const [activeCategoryIndex, setActiveCategoryIndex] = useState<number | null>(
    menuHighlights.length > 0 ? 0 : null
  );

  const addCategory = () => {
    const newCategory: MenuCategory = {
      category: "",
      items: [],
    };
    const updated = [...menuHighlights, newCategory];
    onChange(updated);
    setActiveCategoryIndex(updated.length - 1);
  };

  const removeCategory = (index: number) => {
    const updated = menuHighlights.filter((_, i) => i !== index);
    onChange(updated);
    if (activeCategoryIndex === index) {
      setActiveCategoryIndex(updated.length > 0 ? 0 : null);
    } else if (activeCategoryIndex && activeCategoryIndex > index) {
      setActiveCategoryIndex(activeCategoryIndex - 1);
    }
  };

  const updateCategoryName = (index: number, name: string) => {
    const updated = [...menuHighlights];
    updated[index].category = name;
    onChange(updated);
  };

  const addItem = (categoryIndex: number) => {
    const newItem: MenuItem = {
      name: "",
      description: "",
      price: "",
    };
    const updated = [...menuHighlights];
    updated[categoryIndex].items.push(newItem);
    onChange(updated);
  };

  const removeItem = (categoryIndex: number, itemIndex: number) => {
    const updated = [...menuHighlights];
    updated[categoryIndex].items = updated[categoryIndex].items.filter(
      (_, i) => i !== itemIndex
    );
    onChange(updated);
  };

  const updateItem = (
    categoryIndex: number,
    itemIndex: number,
    field: keyof MenuItem,
    value: string
  ) => {
    const updated = [...menuHighlights];
    updated[categoryIndex].items[itemIndex][field] = value;
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-1">
            Menu Items (Optional)
          </label>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Add menu categories and their items to showcase your offerings
          </p>
        </div>
        <Button
          type="button"
          onClick={addCategory}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Category
        </Button>
      </div>

      {menuHighlights.length === 0 ? (
        <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-xl p-12 text-center">
          <Utensils className="w-12 h-12 text-neutral-400 dark:text-neutral-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">
            No Menu Items Yet
          </h3>
          <p className="text-neutral-600 dark:text-neutral-400 mb-4">
            Add menu categories to get started
          </p>
          <Button
            type="button"
            onClick={addCategory}
            className="bg-gradient-to-r from-warm-200 to-peach-200 hover:from-warm-300 hover:to-peach-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add First Category
          </Button>
        </div>
      ) : (
        <div className="border border-neutral-200 dark:border-neutral-700 rounded-xl overflow-hidden">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 bg-neutral-50 dark:bg-neutral-900 p-2 border-b border-neutral-200 dark:border-neutral-700 overflow-x-auto">
            {menuHighlights.map((category, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveCategoryIndex(index)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
                  activeCategoryIndex === index
                    ? "bg-gradient-to-r from-warm-200 to-peach-200 text-white"
                    : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                }`}
              >
                <GripVertical className="w-4 h-4" />
                <span className="font-medium">
                  {category.category || `Category ${index + 1}`}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCategory(index);
                  }}
                  className="ml-1 hover:bg-white/20 rounded-full p-0.5 transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </button>
            ))}
          </div>

          {/* Active Category Content */}
          <AnimatePresence mode="wait">
            {activeCategoryIndex !== null &&
              menuHighlights[activeCategoryIndex] && (
                <motion.div
                  key={activeCategoryIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="p-6 space-y-6"
                >
                  {/* Category Name Input */}
                  <div>
                    <label className="block text-sm font-medium text-neutral-900 dark:text-white mb-2">
                      Category Name *
                    </label>
                    <Input
                      type="text"
                      value={menuHighlights[activeCategoryIndex].category}
                      onChange={(e) =>
                        updateCategoryName(activeCategoryIndex, e.target.value)
                      }
                      placeholder="e.g., Appetizers, Main Courses, Desserts"
                      required={
                        menuHighlights[activeCategoryIndex].items.length > 0
                      }
                    />
                  </div>

                  {/* Menu Items */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-neutral-900 dark:text-white">
                        Items in this category
                      </label>
                      <Button
                        type="button"
                        onClick={() => addItem(activeCategoryIndex)}
                        size="sm"
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Item
                      </Button>
                    </div>

                    {menuHighlights[activeCategoryIndex].items.length === 0 ? (
                      <div className="border-2 border-dashed border-neutral-200 dark:border-neutral-700 rounded-lg p-8 text-center">
                        <p className="text-neutral-600 dark:text-neutral-400 mb-3">
                          No items in this category yet
                        </p>
                        <Button
                          type="button"
                          onClick={() => addItem(activeCategoryIndex)}
                          size="sm"
                          className="bg-gradient-to-r from-warm-200 to-peach-200"
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          Add First Item
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {menuHighlights[activeCategoryIndex].items.map(
                          (item, itemIndex) => (
                            <motion.div
                              key={itemIndex}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="border border-neutral-200 dark:border-neutral-700 rounded-lg p-4 bg-neutral-50 dark:bg-neutral-800"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <h4 className="text-sm font-semibold text-neutral-900 dark:text-white">
                                  Item #{itemIndex + 1}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() =>
                                    removeItem(activeCategoryIndex, itemIndex)
                                  }
                                  className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Name *
                                  </label>
                                  <Input
                                    type="text"
                                    value={item.name}
                                    onChange={(e) =>
                                      updateItem(
                                        activeCategoryIndex,
                                        itemIndex,
                                        "name",
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g., Grilled Salmon"
                                    required
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Description *
                                  </label>
                                  <Input
                                    type="text"
                                    value={item.description}
                                    onChange={(e) =>
                                      updateItem(
                                        activeCategoryIndex,
                                        itemIndex,
                                        "description",
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g., Fresh Atlantic salmon with herbs"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Price *
                                  </label>
                                  <Input
                                    type="text"
                                    value={item.price}
                                    onChange={(e) =>
                                      updateItem(
                                        activeCategoryIndex,
                                        itemIndex,
                                        "price",
                                        e.target.value
                                      )
                                    }
                                    placeholder="e.g., ₦15,000"
                                    required
                                  />
                                </div>
                              </div>
                            </motion.div>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
          </AnimatePresence>
        </div>
      )}

      {menuHighlights.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-300">
            <strong>Tip:</strong> Add multiple categories and items to give
            customers a preview of your menu. You can always add more or edit
            later.
          </p>
        </div>
      )}
    </div>
  );
}
