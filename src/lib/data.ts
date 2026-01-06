// Blog data types and mock data

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
  twitter?: string;
  linkedin?: string;
  postCount: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  postCount: number;
  color: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
  postCount: number;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: Author;
  category: Category;
  tags: Tag[];
  publishedAt: string;
  readingTime: number;
  views: number;
  likes: number;
  featured: boolean;
  trending: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: {
    name: string;
    avatar: string;
  };
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

// Mock Authors
export const authors: Author[] = [
  {
    id: "1",
    name: "Alexandra Chen",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    bio: "Senior tech writer and former software engineer. Passionate about making complex topics accessible to everyone.",
    role: "Senior Editor",
    twitter: "alexchen",
    linkedin: "alexandra-chen",
    postCount: 47,
  },
  {
    id: "2",
    name: "Marcus Williams",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    bio: "Design thinking advocate and UX researcher with 10+ years in the industry.",
    role: "Design Lead",
    twitter: "marcuswdesign",
    postCount: 32,
  },
  {
    id: "3",
    name: "Sarah Mitchell",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    bio: "Startup founder turned writer. I write about entrepreneurship, growth, and the future of work.",
    role: "Contributing Writer",
    linkedin: "sarahmitchell",
    postCount: 28,
  },
  {
    id: "4",
    name: "James Rodriguez",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "AI researcher and machine learning engineer exploring the intersection of technology and humanity.",
    role: "Tech Columnist",
    twitter: "jamesrodai",
    postCount: 41,
  },
];

// Mock Categories
export const categories: Category[] = [
  {
    id: "1",
    name: "Technology",
    slug: "technology",
    description: "Latest trends in tech, software development, and digital innovation.",
    postCount: 156,
    color: "hsl(220 70% 50%)",
  },
  {
    id: "2",
    name: "Design",
    slug: "design",
    description: "UI/UX, product design, and creative inspiration.",
    postCount: 89,
    color: "hsl(340 70% 50%)",
  },
  {
    id: "3",
    name: "Business",
    slug: "business",
    description: "Entrepreneurship, startups, and business strategy.",
    postCount: 124,
    color: "hsl(160 70% 40%)",
  },
  {
    id: "4",
    name: "Lifestyle",
    slug: "lifestyle",
    description: "Work-life balance, productivity, and personal growth.",
    postCount: 67,
    color: "hsl(30 70% 50%)",
  },
  {
    id: "5",
    name: "AI & Machine Learning",
    slug: "ai-ml",
    description: "Artificial intelligence, deep learning, and the future of automation.",
    postCount: 78,
    color: "hsl(270 70% 50%)",
  },
];

// Mock Tags
export const tags: Tag[] = [
  { id: "1", name: "React", slug: "react", postCount: 45 },
  { id: "2", name: "JavaScript", slug: "javascript", postCount: 78 },
  { id: "3", name: "TypeScript", slug: "typescript", postCount: 34 },
  { id: "4", name: "CSS", slug: "css", postCount: 56 },
  { id: "5", name: "Node.js", slug: "nodejs", postCount: 29 },
  { id: "6", name: "Python", slug: "python", postCount: 42 },
  { id: "7", name: "UI Design", slug: "ui-design", postCount: 38 },
  { id: "8", name: "Startups", slug: "startups", postCount: 51 },
  { id: "9", name: "Remote Work", slug: "remote-work", postCount: 23 },
  { id: "10", name: "Productivity", slug: "productivity", postCount: 31 },
];

// Mock Posts
export const posts: Post[] = [
  {
    id: "1",
    title: "The Future of Web Development: What to Expect in 2025",
    slug: "future-of-web-development-2025",
    excerpt: "From AI-powered coding assistants to the evolution of frameworks, here's what's shaping the future of how we build for the web.",
    content: `
## Introduction

The web development landscape is evolving at an unprecedented pace. As we look ahead to 2025 and beyond, several transformative trends are reshaping how developers build, deploy, and maintain web applications.

## The Rise of AI-Assisted Development

One of the most significant shifts we're witnessing is the integration of AI into the development workflow. Tools like GitHub Copilot and Claude are no longer novelties—they're becoming essential parts of how developers write code.

> "AI won't replace developers, but developers who use AI will replace those who don't."

### Key AI Development Trends

- **Intelligent Code Completion**: Beyond simple autocomplete, AI now understands context and intent
- **Automated Testing**: AI-generated test cases based on code analysis
- **Bug Detection**: Proactive identification of potential issues before they reach production

## The Framework Evolution

The JavaScript framework landscape continues to mature. While React, Vue, and Angular remain dominant, we're seeing a shift toward:

1. **Edge-first rendering** with frameworks like Next.js and Remix
2. **Islands architecture** for better performance
3. **Server components** reducing client-side JavaScript

\`\`\`javascript
// Example of a modern React Server Component
async function BlogPost({ slug }) {
  const post = await getPost(slug);
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  );
}
\`\`\`

## Performance as a Feature

With Core Web Vitals becoming a ranking factor, performance optimization is no longer optional. Modern developers are focusing on:

- **Partial hydration** to minimize JavaScript execution
- **Image optimization** with next-gen formats like AVIF
- **Edge computing** for faster response times globally

## Conclusion

The future of web development is exciting and full of opportunities. By embracing these trends while maintaining focus on fundamentals, developers can build faster, more accessible, and more powerful applications than ever before.
    `,
    featuredImage: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=630&fit=crop",
    author: authors[0],
    category: categories[0],
    tags: [tags[0], tags[1], tags[2]],
    publishedAt: "2025-01-02",
    readingTime: 8,
    views: 12453,
    likes: 847,
    featured: true,
    trending: true,
  },
  {
    id: "2",
    title: "Mastering the Art of Minimalist Design",
    slug: "mastering-minimalist-design",
    excerpt: "Less is more, but achieving effective minimalism requires deep understanding of user needs and design principles.",
    content: `
## The Philosophy of Less

Minimalism in design isn't about removing elements—it's about ensuring every element serves a purpose. Great minimalist design feels effortless because of the careful consideration behind every decision.

## Core Principles

### 1. Intentional White Space

White space (or negative space) isn't empty—it's the breathing room that makes content digestible. Strategic use of white space guides the eye and creates visual hierarchy.

### 2. Typography as Design

When you strip away decorative elements, typography becomes your primary tool for creating interest and hierarchy. Choose fonts that speak volumes with minimal variation.

### 3. Color with Purpose

A minimalist color palette typically features:
- One or two primary colors
- Neutral backgrounds
- Strategic accent colors for CTAs

## The Reduction Process

Start with everything, then ask: "Does this help the user achieve their goal?" If not, it goes.
    `,
    featuredImage: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&h=630&fit=crop",
    author: authors[1],
    category: categories[1],
    tags: [tags[6]],
    publishedAt: "2025-01-01",
    readingTime: 6,
    views: 8934,
    likes: 623,
    featured: true,
    trending: false,
  },
  {
    id: "3",
    title: "Building a Successful SaaS: Lessons from the Trenches",
    slug: "building-successful-saas",
    excerpt: "After bootstrapping my startup to $1M ARR, here are the hard-won lessons that made all the difference.",
    content: `
## The Journey Begins

Three years ago, I left my comfortable corporate job to build a SaaS product. What followed was the most challenging and rewarding experience of my life.

## Lesson 1: Solve Your Own Problem

The best SaaS products come from founders who deeply understand the problem they're solving. I built what I needed as a project manager, and it resonated with thousands of others.

## Lesson 2: Launch Before You're Ready

Perfectionism is the enemy of progress. Our first version was embarrassingly basic, but it let us validate our assumptions and iterate based on real feedback.

## Lesson 3: Customer Success is Product Success

Every churned customer represents a failure in our product or communication. We invested heavily in onboarding and support, and our retention numbers reflect that investment.
    `,
    featuredImage: "https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1200&h=630&fit=crop",
    author: authors[2],
    category: categories[2],
    tags: [tags[7]],
    publishedAt: "2024-12-30",
    readingTime: 10,
    views: 15678,
    likes: 1234,
    featured: false,
    trending: true,
  },
  {
    id: "4",
    title: "Understanding Large Language Models: A Developer's Guide",
    slug: "understanding-llms-developers-guide",
    excerpt: "Demystifying the technology behind ChatGPT, Claude, and the AI revolution transforming software development.",
    content: `
## What Are Large Language Models?

Large Language Models (LLMs) are neural networks trained on vast amounts of text data to understand and generate human-like language. But what makes them special?

## The Architecture

At their core, LLMs use the Transformer architecture, which enables them to:
- Process long sequences of text efficiently
- Understand context and relationships between words
- Generate coherent, contextually appropriate responses

## Practical Applications for Developers

### Code Generation
LLMs can help write boilerplate code, suggest implementations, and even debug issues.

### Documentation
Automatically generate documentation from code comments and function signatures.

### Testing
Create test cases based on code analysis and requirements.

## Best Practices

1. **Prompt Engineering**: The way you ask matters. Be specific and provide context.
2. **Validation**: Always review AI-generated code before production.
3. **Iteration**: Use AI as a collaborative tool, not a replacement.
    `,
    featuredImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop",
    author: authors[3],
    category: categories[4],
    tags: [tags[5]],
    publishedAt: "2024-12-28",
    readingTime: 12,
    views: 21456,
    likes: 1876,
    featured: true,
    trending: true,
  },
  {
    id: "5",
    title: "The Remote Work Revolution: Creating Your Ideal Home Office",
    slug: "remote-work-home-office-setup",
    excerpt: "Transform your workspace into a productivity powerhouse with these science-backed strategies.",
    content: `
## The New Reality

Remote work is here to stay. Whether you're fully remote or hybrid, your home office setup directly impacts your productivity, creativity, and well-being.

## Essential Elements

### Ergonomics First
- Monitor at eye level
- Chair with proper lumbar support
- Keyboard and mouse at elbow height

### Lighting Matters
Natural light boosts mood and productivity. Position your desk near windows when possible, and invest in quality artificial lighting for darker hours.

### Minimize Distractions
Create physical and mental boundaries between work and home life.
    `,
    featuredImage: "https://images.unsplash.com/photo-1593062096033-9a26b09da705?w=1200&h=630&fit=crop",
    author: authors[2],
    category: categories[3],
    tags: [tags[8], tags[9]],
    publishedAt: "2024-12-25",
    readingTime: 7,
    views: 6789,
    likes: 445,
    featured: false,
    trending: false,
  },
  {
    id: "6",
    title: "CSS Grid vs Flexbox: When to Use Which",
    slug: "css-grid-vs-flexbox",
    excerpt: "Understanding the strengths of each layout system and how to combine them for powerful responsive designs.",
    content: `
## The Layout Dilemma

Both CSS Grid and Flexbox are powerful layout tools, but they excel in different scenarios. Let's break down when to use each.

## Flexbox: One-Dimensional Layouts

Flexbox works best when you're dealing with content in a single direction—either a row or a column.

\`\`\`css
.nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## Grid: Two-Dimensional Layouts

Grid shines when you need precise control over both rows and columns simultaneously.

\`\`\`css
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}
\`\`\`

## Combining Both

The real power comes from using both together. Use Grid for the overall page layout and Flexbox for component-level alignment.
    `,
    featuredImage: "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=1200&h=630&fit=crop",
    author: authors[0],
    category: categories[0],
    tags: [tags[3]],
    publishedAt: "2024-12-22",
    readingTime: 5,
    views: 9876,
    likes: 567,
    featured: false,
    trending: false,
  },
  {
    id: "8",
    title: "বাংলাদেশের ডিজিটাল রূপান্তর: একটি নতুন যুগের সূচনা",
    slug: "bangladesh-digital-transformation",
    excerpt: "বাংলাদেশ কীভাবে প্রযুক্তি ও উদ্ভাবনের মাধ্যমে তার অর্থনীতি ও সমাজকে রূপান্তরিত করছে তার একটি গভীর বিশ্লেষণ।",
    content: `
## ডিজিটাল বাংলাদেশের স্বপ্ন

বাংলাদেশ আজ ডিজিটাল রূপান্তরের এক অভূতপূর্ব যাত্রায়। সরকারি সেবা থেকে শুরু করে ব্যবসা-বাণিজ্য, শিক্ষা থেকে স্বাস্থ্যসেবা - প্রতিটি ক্ষেত্রে প্রযুক্তির ছোঁয়া লেগেছে।

## ই-কমার্সের উত্থান

বাংলাদেশের ই-কমার্স সেক্টর গত কয়েক বছরে অভূতপূর্ব বৃদ্ধি পেয়েছে। দারাজ, ইভ্যালি, চালডাল এর মতো প্ল্যাটফর্মগুলো মানুষের কেনাকাটার ধরন বদলে দিয়েছে।

### মোবাইল ফিনান্সিয়াল সার্ভিসেস

বিকাশ, নগদ, রকেট - এই মোবাইল ফিনান্সিয়াল সেবাগুলো গ্রামীণ বাংলাদেশেও আর্থিক অন্তর্ভুক্তি নিশ্চিত করেছে।

## ফ্রিল্যান্সিং হাব

বাংলাদেশ এখন বিশ্বের দ্বিতীয় বৃহত্তম ফ্রিল্যান্সিং জনশক্তি সরবরাহকারী দেশ। লক্ষ লক্ষ তরুণ আন্তর্জাতিক ক্লায়েন্টদের সাথে কাজ করছে।

## ভবিষ্যতের পথে

- স্মার্ট সিটি প্রকল্প
- ৫জি নেটওয়ার্ক সম্প্রসারণ
- কৃত্রিম বুদ্ধিমত্তা গবেষণা
- স্টার্টআপ ইকোসিস্টেম উন্নয়ন
    `,
    featuredImage: "https://images.unsplash.com/photo-1598618443855-232ee0f819f6?w=1200&h=630&fit=crop",
    author: authors[0],
    category: categories[0],
    tags: [tags[0], tags[1]],
    publishedAt: "2025-01-03",
    readingTime: 7,
    views: 8543,
    likes: 654,
    featured: true,
    trending: true,
  },
  {
    id: "9",
    title: "ঢাকার রাস্তায় স্ট্রিট ফুড: স্বাদের অনন্য অভিজ্ঞতা",
    slug: "dhaka-street-food-experience",
    excerpt: "ঢাকার জনপ্রিয় স্ট্রিট ফুড এবং তাদের পেছনের গল্প - ফুচকা থেকে ঝালমুড়ি, চটপটি থেকে আচার।",
    content: `
## ঢাকার স্ট্রিট ফুড সংস্কৃতি

ঢাকা শহরের প্রাণ হলো এর রাস্তার খাবার। প্রতিটি গলি-মোড়ে সুস্বাদু খাবারের গন্ধ ভেসে বেড়ায়।

## জনপ্রিয় স্ট্রিট ফুড

### ফুচকা

টক-ঝাল-মিষ্টি স্বাদের অনন্য সংমিশ্রণ। তেঁতুলের জল আর আলুর পুর দিয়ে তৈরি এই খাবার সবার প্রিয়।

### চটপটি

বুটের ডাল, ডিম, পেঁয়াজ আর মসলার মিশ্রণে তৈরি এই খাবার ঢাকার বিশেষত্ব।

### ঝালমুড়ি

মুড়ি, চানাচুর, শশা, পেঁয়াজ আর কাঁচা মরিচের মিশ্রণ - হালকা নাস্তার জন্য আদর্শ।

## সেরা স্পট

1. পুরান ঢাকার চকবাজার
2. নিউ মার্কেট এলাকা
3. ধানমন্ডি লেক
4. গুলশান-বনানী এলাকা
    `,
    featuredImage: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=1200&h=630&fit=crop",
    author: authors[1],
    category: categories[3],
    tags: [tags[8]],
    publishedAt: "2025-01-02",
    readingTime: 5,
    views: 12340,
    likes: 890,
    featured: false,
    trending: true,
  },
  {
    id: "10",
    title: "সুন্দরবন: বিশ্বের বৃহত্তম ম্যানগ্রোভ বনের রহস্য",
    slug: "sundarbans-largest-mangrove-forest",
    excerpt: "সুন্দরবনের অপার সৌন্দর্য, রয়েল বেঙ্গল টাইগার এবং জীববৈচিত্র্যের এক অনন্য যাত্রা।",
    content: `
## সুন্দরবন: প্রকৃতির এক বিস্ময়

সুন্দরবন বিশ্বের বৃহত্তম ম্যানগ্রোভ বন এবং ইউনেস্কো ওয়ার্ল্ড হেরিটেজ সাইট। এটি বাংলাদেশ ও ভারত জুড়ে বিস্তৃত।

## রয়েল বেঙ্গল টাইগার

সুন্দরবনের সবচেয়ে বিখ্যাত বাসিন্দা হলো রয়েল বেঙ্গল টাইগার। এই বাঘ সাঁতার কাটতে পারে এবং ম্যানগ্রোভ বনে বিচরণে অভ্যস্ত।

### জীববৈচিত্র্য

- ২৬০ প্রজাতির পাখি
- ১২০ প্রজাতির মাছ
- ৪২ প্রজাতির স্তন্যপায়ী
- বিভিন্ন প্রজাতির সরীসৃপ

## সুন্দরী গাছ

সুন্দরবনের নামকরণ হয়েছে সুন্দরী গাছ থেকে। এই গাছ লবণাক্ত পানিতে বেঁচে থাকতে পারে।

## জলবায়ু পরিবর্তনের প্রভাব

- সমুদ্রপৃষ্ঠের উচ্চতা বৃদ্ধি
- ঘূর্ণিঝড়ের তীব্রতা বৃদ্ধি
- লবণাক্ততার পরিবর্তন
- বন্যপ্রাণীর আবাসস্থল হুমকির মুখে
    `,
    featuredImage: "https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=1200&h=630&fit=crop",
    author: authors[2],
    category: categories[3],
    tags: [tags[8]],
    publishedAt: "2024-12-31",
    readingTime: 8,
    views: 9876,
    likes: 723,
    featured: true,
    trending: false,
  },
];

// Helper functions
export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((post) => post.slug === slug);
}

export function getPostsByCategory(categorySlug: string): Post[] {
  return posts.filter((post) => post.category.slug === categorySlug);
}

export function getPostsByTag(tagSlug: string): Post[] {
  return posts.filter((post) => post.tags.some((tag) => tag.slug === tagSlug));
}

export function getPostsByAuthor(authorId: string): Post[] {
  return posts.filter((post) => post.author.id === authorId);
}

export function getFeaturedPosts(): Post[] {
  return posts.filter((post) => post.featured);
}

export function getTrendingPosts(): Post[] {
  return posts.filter((post) => post.trending);
}

export function getRelatedPosts(post: Post, limit: number = 3): Post[] {
  return posts
    .filter(
      (p) =>
        p.id !== post.id &&
        (p.category.id === post.category.id ||
          p.tags.some((tag) => post.tags.some((t) => t.id === tag.id)))
    )
    .slice(0, limit);
}

export function getAuthorById(id: string): Author | undefined {
  return authors.find((author) => author.id === id);
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((category) => category.slug === slug);
}

export function getTagBySlug(slug: string): Tag | undefined {
  return tags.find((tag) => tag.slug === slug);
}

export function searchPosts(query: string): Post[] {
  const lowercaseQuery = query.toLowerCase();
  return posts.filter(
    (post) =>
      post.title.toLowerCase().includes(lowercaseQuery) ||
      post.excerpt.toLowerCase().includes(lowercaseQuery) ||
      post.content.toLowerCase().includes(lowercaseQuery) ||
      post.tags.some((tag) => tag.name.toLowerCase().includes(lowercaseQuery))
  );
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + "M";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  }
  return num.toString();
}
