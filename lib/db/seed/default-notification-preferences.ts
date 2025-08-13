import { NewDefaultNotificationPreference } from "../schema/notification-preferences";

// Default notification preferences that new users inherit
// These match the current UI implementation
export const defaultNotificationPreferencesData: NewDefaultNotificationPreference[] =
  [
    // Alerts category
    {
      category: "alerts",
      event: "password_change",
      noneEnabled: false,
      inAppEnabled: true,
      emailEnabled: true,
      eventDescription: "I change my password",
      categoryDescription: "Updates about critical activity.",
      displayOrder: 1,
    },
    {
      category: "alerts",
      event: "new_browser_signin",
      noneEnabled: true,
      inAppEnabled: false,
      emailEnabled: false,
      eventDescription: "A new browser is used to sign in",
      categoryDescription: "Updates about critical activity.",
      displayOrder: 2,
    },
    {
      category: "alerts",
      event: "new_device_linked",
      noneEnabled: false,
      inAppEnabled: false,
      emailEnabled: true,
      eventDescription: "A new device is linked",
      categoryDescription: "Updates about critical activity.",
      displayOrder: 3,
    },

    // Jobs category
    {
      category: "jobs",
      event: "new_job_post",
      noneEnabled: false,
      inAppEnabled: true,
      emailEnabled: false,
      eventDescription: "A new job post",
      categoryDescription: "Updates about job activity.",
      displayOrder: 4,
    },
    {
      category: "jobs",
      event: "job_application_status",
      noneEnabled: false,
      inAppEnabled: true,
      emailEnabled: false,
      eventDescription: "Job application status",
      categoryDescription: "Updates about job activity.",
      displayOrder: 5,
    },

    // Articles category
    {
      category: "articles",
      event: "new_topics",
      noneEnabled: false,
      inAppEnabled: false,
      emailEnabled: true,
      eventDescription: "New topics",
      categoryDescription: "Updates from articles.",
      displayOrder: 6,
    },
    {
      category: "articles",
      event: "new_comment_on_article",
      noneEnabled: true,
      inAppEnabled: false,
      emailEnabled: false,
      eventDescription: "New comment on article",
      categoryDescription: "Updates from articles.",
      displayOrder: 7,
    },
    {
      category: "articles",
      event: "likes_on_article",
      noneEnabled: true,
      inAppEnabled: false,
      emailEnabled: false,
      eventDescription: "Likes on article post",
      categoryDescription: "Updates from articles.",
      displayOrder: 8,
    },

    // News category
    {
      category: "news",
      event: "news_updates",
      noneEnabled: false,
      inAppEnabled: false,
      emailEnabled: true,
      eventDescription: "News updates",
      categoryDescription: "Updates from news.",
      displayOrder: 9,
    },
  ];

// Helper function to get default preferences by category
export const getDefaultPreferencesByCategory = () => {
  const categories = ["alerts", "jobs", "articles", "news"] as const;

  return categories.map((category) => {
    const categoryPreferences = defaultNotificationPreferencesData.filter(
      (pref) => pref.category === category
    );

    return {
      id: category,
      title: category.charAt(0).toUpperCase() + category.slice(1),
      description: categoryPreferences[0]?.categoryDescription || "",
      settings: categoryPreferences.map((pref) => ({
        id: pref.event,
        category: pref.category,
        event: pref.event,
        noneEnabled: pref.noneEnabled,
        inAppEnabled: pref.inAppEnabled,
        emailEnabled: pref.emailEnabled,
        eventDescription: pref.eventDescription,
        categoryDescription: pref.categoryDescription,
        displayOrder: pref.displayOrder,
      })),
    };
  });
};
