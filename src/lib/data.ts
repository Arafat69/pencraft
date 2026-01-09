// Blog data types and utility functions

export interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  role: string;
  email?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
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

// Convert DB author to frontend Author type
export function mapDbAuthor(dbAuthor: any): Author {
  return {
    id: dbAuthor.id,
    name: dbAuthor.name || "",
    avatar: dbAuthor.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: dbAuthor.bio || "",
    role: dbAuthor.website ? "Writer" : "Contributor",
    email: dbAuthor.email,
    twitter: dbAuthor.twitter,
    linkedin: dbAuthor.linkedin,
    website: dbAuthor.website,
    postCount: dbAuthor.postCount || 0,
  };
}

// Convert DB category to frontend Category type
export function mapDbCategory(dbCategory: any): Category {
  return {
    id: dbCategory.id,
    name: dbCategory.name || "",
    slug: dbCategory.slug || "",
    description: dbCategory.description || "",
    postCount: dbCategory.postCount || 0,
    color: dbCategory.color || "hsl(220 70% 50%)",
  };
}

// Convert DB tag to frontend Tag type
export function mapDbTag(dbTag: any): Tag {
  return {
    id: dbTag.id,
    name: dbTag.name || "",
    slug: dbTag.slug || "",
    postCount: dbTag.postCount || 0,
  };
}

// Convert DB post to frontend Post type
export function mapDbPost(dbPost: any): Post {
  const defaultAuthor: Author = {
    id: "",
    name: "Unknown Author",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    bio: "",
    role: "Contributor",
    postCount: 0,
  };

  const defaultCategory: Category = {
    id: "",
    name: "Uncategorized",
    slug: "uncategorized",
    description: "",
    postCount: 0,
    color: "hsl(220 70% 50%)",
  };

  return {
    id: dbPost.id,
    title: dbPost.title || "",
    slug: dbPost.slug || "",
    excerpt: dbPost.excerpt || "",
    content: dbPost.content || "",
    featuredImage: dbPost.cover_image || "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=1200&h=630&fit=crop",
    author: dbPost.author ? mapDbAuthor(dbPost.author) : defaultAuthor,
    category: dbPost.category ? mapDbCategory(dbPost.category) : defaultCategory,
    tags: (dbPost.tags || []).map(mapDbTag),
    publishedAt: dbPost.published_at || dbPost.created_at || new Date().toISOString(),
    readingTime: parseInt(dbPost.read_time?.replace(/\D/g, "") || "5") || 5,
    views: 0,
    likes: 0,
    featured: dbPost.is_featured || false,
    trending: dbPost.is_trending || false,
  };
}

// Helper functions
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

// Empty arrays as fallback - data comes from database now
export const posts: Post[] = [];
export const authors: Author[] = [];
export const categories: Category[] = [];
export const tags: Tag[] = [];

// Legacy helper functions that return empty - use hooks instead
export function getPostBySlug(slug: string): Post | undefined {
  return undefined;
}

export function getRelatedPosts(post: Post, limit: number = 3): Post[] {
  return [];
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return undefined;
}

export function getAuthorById(id: string): Author | undefined {
  return undefined;
}

export function getTagBySlug(slug: string): Tag | undefined {
  return undefined;
}

export function getPostsByCategory(slug: string): Post[] {
  return [];
}

export function getPostsByAuthor(id: string): Post[] {
  return [];
}

export function getPostsByTag(slug: string): Post[] {
  return [];
}

export function getFeaturedPosts(): Post[] {
  return [];
}

export function getTrendingPosts(): Post[] {
  return [];
}
