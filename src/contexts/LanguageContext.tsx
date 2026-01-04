import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "bn";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations: Record<string, Record<Language, string>> = {
  // Navigation
  "nav.home": { en: "Home", bn: "হোম" },
  "nav.blog": { en: "Blog", bn: "ব্লগ" },
  "nav.categories": { en: "Categories", bn: "বিভাগ" },
  "nav.about": { en: "About", bn: "সম্পর্কে" },
  "nav.contact": { en: "Contact", bn: "যোগাযোগ" },
  "nav.signin": { en: "Sign In", bn: "সাইন ইন" },
  
  // Hero
  "hero.title": { en: "Discover Stories That Matter", bn: "গুরুত্বপূর্ণ গল্প আবিষ্কার করুন" },
  "hero.subtitle": { en: "Explore insightful articles on technology, design, business, and more. Written by experts, for curious minds.", bn: "প্রযুক্তি, ডিজাইন, ব্যবসা এবং আরও অনেক বিষয়ে অন্তর্দৃষ্টিপূর্ণ প্রবন্ধগুলি অন্বেষণ করুন। বিশেষজ্ঞদের দ্বারা লিখিত, কৌতূহলী মনের জন্য।" },
  "hero.explore": { en: "Explore Articles", bn: "প্রবন্ধ অন্বেষণ করুন" },
  "hero.subscribe": { en: "Subscribe", bn: "সাবস্ক্রাইব" },
  
  // Sections
  "section.featured": { en: "Featured Stories", bn: "বিশেষ গল্প" },
  "section.categories": { en: "Explore by Category", bn: "বিভাগ অনুযায়ী অন্বেষণ করুন" },
  "section.latest": { en: "Latest Articles", bn: "সর্বশেষ প্রবন্ধ" },
  "section.trending": { en: "Trending Now", bn: "এখন ট্রেন্ডিং" },
  "section.popular_authors": { en: "Popular Authors", bn: "জনপ্রিয় লেখক" },
  "section.view_all": { en: "View All", bn: "সব দেখুন" },
  "section.view_all_posts": { en: "View All Posts", bn: "সব পোস্ট দেখুন" },
  "section.all_categories": { en: "All Categories", bn: "সব বিভাগ" },
  "section.all_authors": { en: "All Authors", bn: "সব লেখক" },
  
  // Post
  "post.min_read": { en: "min read", bn: "মিনিট পড়ুন" },
  "post.views": { en: "views", bn: "ভিউ" },
  "post.articles": { en: "articles", bn: "প্রবন্ধ" },
  "post.article": { en: "article", bn: "প্রবন্ধ" },
  "post.posts": { en: "posts", bn: "পোস্ট" },
  "post.related": { en: "Related Posts", bn: "সম্পর্কিত পোস্ট" },
  "post.previous": { en: "Previous", bn: "পূর্ববর্তী" },
  "post.next": { en: "Next", bn: "পরবর্তী" },
  "post.share": { en: "Share", bn: "শেয়ার করুন" },
  "post.comments": { en: "Comments", bn: "মন্তব্য" },
  "post.leave_comment": { en: "Leave a comment", bn: "একটি মন্তব্য করুন" },
  "post.submit_comment": { en: "Submit Comment", bn: "মন্তব্য জমা দিন" },
  
  // Newsletter
  "newsletter.title": { en: "Stay Updated", bn: "আপডেট থাকুন" },
  "newsletter.subtitle": { en: "Get the latest articles delivered straight to your inbox.", bn: "সর্বশেষ প্রবন্ধগুলি সরাসরি আপনার ইনবক্সে পান।" },
  "newsletter.placeholder": { en: "Enter your email", bn: "আপনার ইমেইল লিখুন" },
  "newsletter.button": { en: "Subscribe", bn: "সাবস্ক্রাইব" },
  "newsletter.success": { en: "Successfully subscribed!", bn: "সফলভাবে সাবস্ক্রাইব হয়েছে!" },
  
  // Footer
  "footer.description": { en: "A modern publishing platform for curious minds. Discover stories that inspire, educate, and connect.", bn: "কৌতূহলী মনের জন্য একটি আধুনিক প্রকাশনা প্ল্যাটফর্ম। অনুপ্রেরণা, শিক্ষা এবং সংযোগ স্থাপনকারী গল্প আবিষ্কার করুন।" },
  "footer.quick_links": { en: "Quick Links", bn: "দ্রুত লিঙ্ক" },
  "footer.resources": { en: "Resources", bn: "রিসোর্স" },
  "footer.legal": { en: "Legal", bn: "আইনি" },
  "footer.privacy": { en: "Privacy Policy", bn: "গোপনীয়তা নীতি" },
  "footer.terms": { en: "Terms of Service", bn: "সেবার শর্তাবলী" },
  "footer.cookies": { en: "Cookie Policy", bn: "কুকি নীতি" },
  "footer.rights": { en: "All rights reserved.", bn: "সর্বস্বত্ব সংরক্ষিত।" },
  
  // Search
  "search.placeholder": { en: "Search articles...", bn: "প্রবন্ধ খুঁজুন..." },
  "search.results": { en: "Search Results", bn: "অনুসন্ধান ফলাফল" },
  "search.no_results": { en: "No articles found.", bn: "কোন প্রবন্ধ পাওয়া যায়নি।" },
  
  // Filter
  "filter.all": { en: "All", bn: "সব" },
  "filter.category": { en: "Category", bn: "বিভাগ" },
  "filter.sort": { en: "Sort by", bn: "সাজান" },
  "filter.latest": { en: "Latest", bn: "সর্বশেষ" },
  "filter.popular": { en: "Popular", bn: "জনপ্রিয়" },
  "filter.oldest": { en: "Oldest", bn: "পুরাতন" },
  
  // About
  "about.title": { en: "About Pencraft", bn: "পেনক্রাফট সম্পর্কে" },
  "about.description": { en: "Pencraft is a modern publishing platform for curious minds. We believe in the power of well-crafted stories to inspire, educate, and connect people across the globe.", bn: "পেনক্রাফট কৌতূহলী মনের জন্য একটি আধুনিক প্রকাশনা প্ল্যাটফর্ম। আমরা বিশ্বাস করি সুন্দরভাবে তৈরি গল্পগুলি বিশ্বজুড়ে মানুষকে অনুপ্রাণিত, শিক্ষিত এবং সংযুক্ত করতে পারে।" },
  "about.mission": { en: "Our Mission", bn: "আমাদের মিশন" },
  "about.mission_text": { en: "To democratize knowledge sharing and provide a platform where experts and enthusiasts can share their insights with the world.", bn: "জ্ঞান ভাগাভাগিকে গণতান্ত্রিক করা এবং একটি প্ল্যাটফর্ম প্রদান করা যেখানে বিশেষজ্ঞ এবং উত্সাহীরা বিশ্বের সাথে তাদের অন্তর্দৃষ্টি ভাগ করতে পারেন।" },
  "about.coverage": { en: "What We Cover", bn: "আমরা কী কভার করি" },
  "about.coverage_text": { en: "From technology and design to business strategy and personal growth, our diverse team of writers brings you thoughtful perspectives on the topics that matter most.", bn: "প্রযুক্তি এবং ডিজাইন থেকে ব্যবসায়িক কৌশল এবং ব্যক্তিগত বৃদ্ধি পর্যন্ত, আমাদের বৈচিত্র্যময় লেখক দল আপনার কাছে সবচেয়ে গুরুত্বপূর্ণ বিষয়গুলিতে চিন্তাশীল দৃষ্টিভঙ্গি নিয়ে আসে।" },
  
  // Contact
  "contact.title": { en: "Get in Touch", bn: "যোগাযোগ করুন" },
  "contact.subtitle": { en: "Have a question or feedback? We'd love to hear from you.", bn: "কোন প্রশ্ন বা মতামত আছে? আমরা আপনার কাছ থেকে শুনতে চাই।" },
  "contact.name": { en: "Name", bn: "নাম" },
  "contact.email": { en: "Email", bn: "ইমেইল" },
  "contact.message": { en: "Message", bn: "বার্তা" },
  "contact.send": { en: "Send Message", bn: "বার্তা পাঠান" },
  "contact.success": { en: "Message sent successfully!", bn: "বার্তা সফলভাবে পাঠানো হয়েছে!" },
  
  // Login
  "login.title": { en: "Welcome back", bn: "স্বাগতম" },
  "login.subtitle": { en: "Sign in to your account to continue", bn: "চালিয়ে যেতে আপনার অ্যাকাউন্টে সাইন ইন করুন" },
  "login.email": { en: "Email", bn: "ইমেইল" },
  "login.password": { en: "Password", bn: "পাসওয়ার্ড" },
  "login.signin": { en: "Sign In", bn: "সাইন ইন" },
  "login.signup": { en: "Sign Up", bn: "সাইন আপ" },
  "login.forgot": { en: "Forgot password?", bn: "পাসওয়ার্ড ভুলে গেছেন?" },
  "login.no_account": { en: "Don't have an account?", bn: "অ্যাকাউন্ট নেই?" },
  "login.have_account": { en: "Already have an account?", bn: "ইতিমধ্যে অ্যাকাউন্ট আছে?" },
  "login.create_account": { en: "Create your account", bn: "আপনার অ্যাকাউন্ট তৈরি করুন" },
  "login.name": { en: "Full Name", bn: "পুরো নাম" },
  
  // Authors
  "authors.title": { en: "Our Authors", bn: "আমাদের লেখকগণ" },
  "authors.subtitle": { en: "Meet the talented writers and experts behind our articles. Each brings unique perspectives and expertise.", bn: "আমাদের প্রবন্ধগুলির পিছনে প্রতিভাবান লেখক এবং বিশেষজ্ঞদের সাথে পরিচিত হন। প্রত্যেকে অনন্য দৃষ্টিভঙ্গি এবং দক্ষতা নিয়ে আসেন।" },
  
  // Categories
  "categories.title": { en: "Categories", bn: "বিভাগসমূহ" },
  "categories.subtitle": { en: "Explore our articles organized by topic. Find exactly what you're looking for.", bn: "বিষয় অনুযায়ী সংগঠিত আমাদের প্রবন্ধগুলি অন্বেষণ করুন। আপনি যা খুঁজছেন ঠিক তা খুঁজে পান।" },
  
  // 404
  "notfound.title": { en: "Page Not Found", bn: "পৃষ্ঠা পাওয়া যায়নি" },
  "notfound.message": { en: "The page you're looking for doesn't exist.", bn: "আপনি যে পৃষ্ঠাটি খুঁজছেন সেটি বিদ্যমান নেই।" },
  "notfound.back": { en: "Go Back Home", bn: "হোমে ফিরে যান" },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("language") as Language) || "en";
    }
    return "en";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
    // Add Bengali font class to body when Bengali is selected
    if (language === "bn") {
      document.body.classList.add("font-bengali");
    } else {
      document.body.classList.remove("font-bengali");
    }
  }, [language]);

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
