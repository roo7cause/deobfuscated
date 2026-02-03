export const SITE = {
  website: "https://deobfuscated.dev/", // replace this with your deployed domain
  author: "David Kasabji",
  profile: "https://deobfuscated.dev/",
  desc: "Research notes on cyber intrusions, adversary tradecraft, and other cybersecurity topics.",
  title: "Deobfuscated",
  ogImage: "deobfuscated_thumbnail_v2_square_1080",
  lightAndDarkMode: false,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/roo7cause/deobfuscated/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Europe/Ljubljana", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
