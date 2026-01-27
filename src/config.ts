export const SITE = {
  website: "https://deobfuscated.dev/", // replace this with your deployed domain
  author: "David Kasabji",
  profile: "https://deobfuscated.dev/",
  desc: "Research notes on cyber intrusions, adversary tradecraft, and other cybersecurity topics.",
  title: "Deobfuscated",
  ogImage: "astro-deobfuscated-1.png",
  lightAndDarkMode: true,
  postPerIndex: 4,
  postPerPage: 4,
  scheduledPostMargin: 15 * 60 * 1000, // 15 minutes
  showArchives: true,
  showBackButton: true, // show back button in post detail
  editPost: {
    enabled: true,
    text: "Edit page",
    url: "https://github.com/satnaing/astro-paper/edit/main/",
  },
  dynamicOgImage: true,
  dir: "ltr", // "rtl" | "auto"
  lang: "en", // html lang code. Set this empty and default will be "en"
  timezone: "Europe/Ljubljana", // Default global timezone (IANA format) https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
} as const;
