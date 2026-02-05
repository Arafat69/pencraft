import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  Eye,
  Heart,
  Share2,
  Bookmark,
  Twitter,
  Linkedin,
  Facebook,
  ArrowLeft,
  ArrowRight,
  Languages,
  Loader2,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import Newsletter from "@/components/blog/Newsletter";
import CommentSection from "@/components/blog/CommentSection";
import { formatDate, formatNumber, mapDbPost } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { postTranslations } from "@/lib/translations";
import { useLikesAndBookmarks } from "@/hooks/useLikesAndBookmarks";
import { usePost, usePosts } from "@/hooks/usePosts";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [readingProgress, setReadingProgress] = useState(0);
  const [isBengali, setIsBengali] = useState(false);

  const { data: dbPosts, isLoading } = usePosts();
  const posts = useMemo(() => (dbPosts || []).map(mapDbPost), [dbPosts]);
  
  const post = posts.find((p) => p.slug === slug);
  // Calculate suggested posts based on matching tags (prioritized) or category
  const suggestedPosts = post
    ? posts
        .filter((p) => p.id !== post.id)
        .map((p) => {
          // Count matching tags
          const matchingTags = p.tags.filter((t) =>
            post.tags.some((pt) => pt.id === t.id)
          );
          const tagScore = matchingTags.length;
          const categoryMatch = p.category.id === post.category.id ? 1 : 0;
          return { ...p, matchingTags, tagScore, categoryMatch };
        })
        .filter((p) => p.tagScore > 0 || p.categoryMatch > 0) // Only include if there's at least one match
        .sort((a, b) => {
          // Prioritize by tag matches first, then category
          if (b.tagScore !== a.tagScore) return b.tagScore - a.tagScore;
          return b.categoryMatch - a.categoryMatch;
        })
        .slice(0, 4) // Show 4 suggested articles
    : [];

  const { liked, bookmarked, likeCount, toggleLike, toggleBookmark } =
    useLikesAndBookmarks(slug || "");

  // Get previous and next posts
  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  // Reading progress bar
  useEffect(() => {
    const handleScroll = () => {
      const article = document.getElementById("article-content");
      if (!article) return;

      const articleTop = article.offsetTop;
      const articleHeight = article.offsetHeight;
      const windowHeight = window.innerHeight;
      const scrollY = window.scrollY;

      const start = articleTop - windowHeight;
      const end = articleTop + articleHeight;
      const progress = Math.min(
        Math.max((scrollY - start) / (end - start), 0),
        1
      );
      setReadingProgress(progress * 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Check if text contains Bengali characters
  const isBengaliPost = post ? /[\u0980-\u09FF]/.test(post.title) : false;

  // Get translated title
  const postTrans = post ? postTranslations[post.id] : null;
  const displayTitle = isBengali && postTrans ? postTrans.title : post?.title;

  if (isLoading) {
    return (
      <Layout>
        <div className="container-blog py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent mx-auto" />
          <p className="text-muted-foreground mt-4">Loading article...</p>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container-blog py-16 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Article Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/blog">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  const handleShare = (platform: string) => {
    const url = window.location.href;
    const text = post.title;
    let shareUrl = "";

    switch (platform) {
      case "twitter":
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`;
        break;
      case "linkedin":
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          url
        )}`;
        break;
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`;
        break;
      default:
        navigator.clipboard.writeText(url);
        toast.success("Link copied to clipboard!");
        return;
    }

    window.open(shareUrl, "_blank", "width=600,height=400");
  };

  // Parse and render content (supports both old markdown and new JSON blocks)
  const renderContent = (content: string) => {
    // Try to parse as JSON blocks first
    try {
      const blocks = JSON.parse(content);
      if (Array.isArray(blocks)) {
        return blocks.map((block: { id: string; type: string; content: string; imageUrl?: string; caption?: string }, i: number) => {
          switch (block.type) {
            case "heading1":
              return (
                <h2
                  key={block.id || i}
                  className="font-bengali-display text-2xl lg:text-3xl font-bold text-foreground mt-10 mb-4"
                >
                  {block.content}
                </h2>
              );
            case "heading2":
              return (
                <h3
                  key={block.id || i}
                  className="font-bengali-display text-xl lg:text-2xl font-semibold text-foreground mt-8 mb-3"
                >
                  {block.content}
                </h3>
              );
            case "paragraph":
              return (
                <p
                  key={block.id || i}
                  className="font-bengali text-foreground/85 leading-relaxed mb-4 text-lg"
                >
                  {block.content}
                </p>
              );
            case "quote":
              return (
                <blockquote
                  key={block.id || i}
                  className="border-l-4 border-accent pl-4 py-2 my-6 italic text-muted-foreground font-bengali"
                >
                  <p>{block.content}</p>
                  {block.caption && (
                    <cite className="block mt-2 text-sm not-italic">— {block.caption}</cite>
                  )}
                </blockquote>
              );
            case "image":
              return (
                <figure key={block.id || i} className="my-8">
                  {block.imageUrl && (
                    <img
                      src={block.imageUrl}
                      alt={block.caption || "Content image"}
                      className="w-full rounded-lg"
                    />
                  )}
                  {block.caption && (
                    <figcaption className="text-center text-sm text-muted-foreground mt-2 font-bengali">
                      {block.caption}
                    </figcaption>
                  )}
                </figure>
              );
            default:
              return null;
          }
        });
      }
    } catch {
      // Fall back to markdown parsing for old content
    }

    // Legacy markdown parsing
    return content
      .split("\n")
      .map((line, i) => {
        // Headers
        if (line.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="font-bengali-display text-2xl lg:text-3xl font-semibold text-foreground mt-10 mb-4"
            >
              {line.replace("## ", "")}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="font-bengali-display text-xl lg:text-2xl font-semibold text-foreground mt-8 mb-3"
            >
              {line.replace("### ", "")}
            </h3>
          );
        }
        // Blockquote
        if (line.startsWith("> ")) {
          return (
            <blockquote
              key={i}
              className="border-l-4 border-accent pl-4 py-2 my-6 italic text-muted-foreground font-bengali"
            >
              {line.replace("> ", "")}
            </blockquote>
          );
        }
        // List items
        if (line.startsWith("- ")) {
          return (
            <li key={i} className="ml-4 text-foreground/85 font-bengali">
              {line.replace("- ", "")}
            </li>
          );
        }
        if (line.match(/^\d+\. /)) {
          return (
            <li key={i} className="ml-4 text-foreground/85 font-bengali">
              {line.replace(/^\d+\. /, "")}
            </li>
          );
        }
        // Code block start/end
        if (line.startsWith("```")) {
          return null;
        }
        // Regular paragraph
        if (line.trim()) {
          return (
            <p key={i} className="font-bengali text-foreground/85 leading-relaxed mb-4">
              {line}
            </p>
          );
        }
        return null;
      })
      .filter(Boolean);
  };

  return (
    <Layout>
      {/* Reading Progress Bar */}
      <div
        className="reading-progress"
        style={{ width: `${readingProgress}%` }}
      />

      {/* Article Header */}
      <section className="py-12 lg:py-16 bg-secondary/30">
        <div className="container-blog">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto text-center"
          >
            {/* Breadcrumb */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-6">
              <Link to="/blog" className="hover:text-foreground">
                Blog
              </Link>
              <span>/</span>
              <Link
                to={`/category/${post.category.slug}`}
                className="hover:text-foreground"
                style={{ color: post.category.color }}
              >
                {post.category.name}
              </Link>
            </div>

            {/* Title with Language Toggle */}
            <div className="relative">
              <h1 className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 ${isBengaliPost || isBengali ? 'font-bengali-display' : 'font-display'}`}>
                {displayTitle}
              </h1>
              <button
                onClick={() => setIsBengali(!isBengali)}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-full bg-accent/10 text-accent hover:bg-accent/20 transition-colors mb-6"
              >
                <Languages className="w-4 h-4" />
                {isBengali ? "English" : "বাংলা"}
              </button>
            </div>

            {/* Excerpt */}
            <p className="text-lg text-muted-foreground mb-8">{post.excerpt}</p>

            {/* Meta */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-muted-foreground">
              <Link
                to={`/author/${post.author.id}`}
                className="flex items-center gap-2"
              >
                <img
                  src={post.author.avatar}
                  alt={post.author.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <span className="font-medium text-foreground">
                  {post.author.name}
                </span>
              </Link>
              <span>·</span>
              <span>{formatDate(post.publishedAt)}</span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {post.readingTime} min read
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {formatNumber(post.views)} views
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Image */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="container-blog -mt-8 relative z-10"
      >
        <div className="aspect-[2/1] rounded-2xl overflow-hidden shadow-elevated">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>

      {/* Article Content */}
      <section className="py-12 lg:py-16">
        <div className="container-blog">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Sticky Sidebar - Social & Actions (Desktop Only) */}
            <aside className="hidden lg:block lg:w-16">
              <div className="lg:sticky lg:top-24 flex flex-col items-center gap-3 p-3 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/30">
                <button
                  onClick={toggleLike}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    liked
                      ? "bg-accent text-accent-foreground shadow-lg shadow-accent/30"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  <Heart className={`w-5 h-5 transition-transform ${liked ? "fill-current scale-110" : "hover:scale-110"}`} />
                </button>
                <span className="text-sm font-medium text-muted-foreground">
                  {formatNumber(likeCount)}
                </span>

                <button
                  onClick={toggleBookmark}
                  className={`p-3 rounded-full transition-all duration-200 ${
                    bookmarked
                      ? "bg-primary text-primary-foreground shadow-lg"
                      : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80"
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 transition-transform ${bookmarked ? "fill-current scale-110" : "hover:scale-110"}`}
                  />
                </button>

                <div className="w-6 h-px bg-border my-2" />

                <button
                  onClick={() => handleShare("twitter")}
                  className="p-3 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200 hover:scale-105"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="p-3 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200 hover:scale-105"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare("facebook")}
                  className="p-3 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200 hover:scale-105"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="p-3 rounded-full bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-all duration-200 hover:scale-105"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <article id="article-content" className="flex-1 max-w-3xl">
              <div className="prose-blog">{renderContent(post.content)}</div>

              {/* Tags */}
              <div className="mt-10 pt-6 border-t border-border/50">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      to={`/tag/${tag.slug}`}
                      className="px-3 py-1.5 bg-secondary/60 text-sm text-muted-foreground rounded-full hover:bg-accent hover:text-accent-foreground transition-all duration-200 border border-transparent hover:border-accent/30"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Author Box */}
              <div className="mt-10 p-6 bg-card rounded-xl border border-border/30 shadow-soft">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={`/author/${post.author.id}`}>
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-16 h-16 rounded-full object-cover ring-2 ring-border/50 hover:ring-accent/50 transition-all duration-200"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link to={`/author/${post.author.id}`}>
                      <h4 className="font-display text-lg font-semibold text-foreground">
                        {post.author.name}
                      </h4>
                    </Link>
                    <p className="text-sm text-accent mb-2">{post.author.role}</p>
                    <p className="text-sm text-muted-foreground">
                      {post.author.bio}
                    </p>
                  </div>
                </div>
              </div>

              {/* Post Navigation */}
              <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
                {prevPost && (
                  <Link
                    to={`/blog/${prevPost.slug}`}
                    className="p-4 bg-card rounded-xl hover:bg-secondary/50 transition-colors group"
                  >
                    <span className="text-xs text-muted-foreground flex items-center gap-1 mb-2">
                      <ArrowLeft className="w-3 h-3" />
                      Previous
                    </span>
                    <h4 className="font-display text-sm font-medium text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                      {prevPost.title}
                    </h4>
                  </Link>
                )}
                {nextPost && (
                  <Link
                    to={`/blog/${nextPost.slug}`}
                    className="p-4 bg-card rounded-xl hover:bg-secondary/50 transition-colors group text-right sm:ml-auto"
                  >
                    <span className="text-xs text-muted-foreground flex items-center justify-end gap-1 mb-2">
                      Next
                      <ArrowRight className="w-3 h-3" />
                    </span>
                    <h4 className="font-display text-sm font-medium text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                      {nextPost.title}
                    </h4>
                  </Link>
                )}
              </div>

              {/* Comments Section */}
              <CommentSection postSlug={post.slug} />
            </article>
          </div>
        </div>
      </section>

      {/* Suggested Articles - Based on Matching Tags */}
      {suggestedPosts.length > 0 && (
        <section className="py-12 lg:py-16 bg-secondary/30">
          <div className="container-blog">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground">
                  আপনার জন্য সাজেস্টেড আর্টিকেল
                </h2>
                <p className="text-muted-foreground mt-1">
                  একই ট্যাগ ও ক্যাটাগরির উপর ভিত্তি করে
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {suggestedPosts.map((suggestedPost, index) => (
                <motion.div
                  key={suggestedPost.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="group"
                >
                  <Link to={`/blog/${suggestedPost.slug}`} className="block">
                    <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-3">
                      <img
                        src={suggestedPost.featuredImage}
                        alt={suggestedPost.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                      
                      {/* Matching Tags Badge */}
                      {suggestedPost.matchingTags.length > 0 && (
                        <div className="absolute top-3 right-3 flex flex-wrap gap-1 justify-end max-w-[60%]">
                          {suggestedPost.matchingTags.slice(0, 2).map((tag) => (
                            <span
                              key={tag.id}
                              className="px-2 py-0.5 bg-accent text-accent-foreground text-xs font-medium rounded-full"
                            >
                              #{tag.name}
                            </span>
                          ))}
                          {suggestedPost.matchingTags.length > 2 && (
                            <span className="px-2 py-0.5 bg-muted text-muted-foreground text-xs font-medium rounded-full">
                              +{suggestedPost.matchingTags.length - 2}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <span
                        className="text-xs font-medium"
                        style={{ color: suggestedPost.category.color || 'var(--accent)' }}
                      >
                        {suggestedPost.category.name}
                      </span>
                      <h3 className="font-bengali-display font-semibold text-foreground line-clamp-2 group-hover:text-accent transition-colors">
                        {suggestedPost.title}
                      </h3>
                      <p className="font-bengali text-sm text-muted-foreground line-clamp-2">
                        {suggestedPost.excerpt}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Clock className="w-3 h-3" />
                        <span>{suggestedPost.readingTime} মিনিট</span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-12 lg:py-16 pb-24 lg:pb-16">
        <div className="container-blog">
          <Newsletter />
        </div>
      </section>

      {/* Mobile Fixed Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden bg-background/95 backdrop-blur-lg border-t border-border z-40">
        <div className="flex items-center justify-around py-3 px-4">
          <button
            onClick={toggleLike}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors ${
              liked ? "text-accent" : "text-muted-foreground"
            }`}
          >
            <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
            <span className="text-xs font-medium">{formatNumber(likeCount)}</span>
          </button>

          <button
            onClick={toggleBookmark}
            className={`flex flex-col items-center gap-1 px-4 py-1 rounded-lg transition-colors ${
              bookmarked ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <Bookmark className={`w-5 h-5 ${bookmarked ? "fill-current" : ""}`} />
            <span className="text-xs font-medium">Save</span>
          </button>

          <button
            onClick={() => handleShare("copy")}
            className="flex flex-col items-center gap-1 px-4 py-1 rounded-lg text-muted-foreground"
          >
            <Share2 className="w-5 h-5" />
            <span className="text-xs font-medium">Share</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
