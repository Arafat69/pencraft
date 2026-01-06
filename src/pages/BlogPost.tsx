import { useState, useEffect } from "react";
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
  MessageCircle,
  Languages,
} from "lucide-react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import Newsletter from "@/components/blog/Newsletter";
import {
  getPostBySlug,
  getRelatedPosts,
  formatDate,
  formatNumber,
  posts,
} from "@/lib/data";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { postTranslations } from "@/lib/translations";

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const [readingProgress, setReadingProgress] = useState(0);
  const [liked, setLiked] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const [isBengali, setIsBengali] = useState(false);

  const post = getPostBySlug(slug || "");
  const relatedPosts = post ? getRelatedPosts(post, 3) : [];

  // Get previous and next posts
  const currentIndex = posts.findIndex((p) => p.slug === slug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

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

  // Get translated title
  const postTrans = post ? postTranslations[post.id] : null;
  const displayTitle = isBengali && postTrans ? postTrans.title : post?.title;

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

  const handleLike = () => {
    setLiked(!liked);
    toast.success(liked ? "Removed from likes" : "Added to likes!");
  };

  const handleBookmark = () => {
    setBookmarked(!bookmarked);
    toast.success(
      bookmarked ? "Removed from bookmarks" : "Saved to bookmarks!"
    );
  };

  // Parse markdown content to HTML (simple version)
  const renderContent = (content: string) => {
    return content
      .split("\n")
      .map((line, i) => {
        // Headers
        if (line.startsWith("## ")) {
          return (
            <h2
              key={i}
              className="font-display text-2xl lg:text-3xl font-semibold text-foreground mt-10 mb-4"
            >
              {line.replace("## ", "")}
            </h2>
          );
        }
        if (line.startsWith("### ")) {
          return (
            <h3
              key={i}
              className="font-display text-xl lg:text-2xl font-semibold text-foreground mt-8 mb-3"
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
              className="border-l-4 border-accent pl-4 py-2 my-6 italic text-muted-foreground"
            >
              {line.replace("> ", "")}
            </blockquote>
          );
        }
        // List items
        if (line.startsWith("- ")) {
          return (
            <li key={i} className="ml-4 text-foreground/85">
              {line.replace("- ", "")}
            </li>
          );
        }
        if (line.match(/^\d+\. /)) {
          return (
            <li key={i} className="ml-4 text-foreground/85">
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
            <p key={i} className="text-foreground/85 leading-relaxed mb-4">
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
              <h1 className={`font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-tight mb-4 ${isBengali ? 'font-bengali' : ''}`}>
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
            {/* Sticky Sidebar - Social & Actions */}
            <aside className="lg:w-16 order-2 lg:order-1">
              <div className="lg:sticky lg:top-24 flex lg:flex-col items-center gap-3 justify-center lg:justify-start py-4 border-t lg:border-t-0 lg:border-l border-border lg:pl-0">
                <button
                  onClick={handleLike}
                  className={`p-3 rounded-full transition-colors ${
                    liked
                      ? "bg-accent text-accent-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Heart className={`w-5 h-5 ${liked ? "fill-current" : ""}`} />
                </button>
                <span className="text-sm text-muted-foreground">
                  {formatNumber(post.likes + (liked ? 1 : 0))}
                </span>

                <button
                  onClick={handleBookmark}
                  className={`p-3 rounded-full transition-colors ${
                    bookmarked
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Bookmark
                    className={`w-5 h-5 ${bookmarked ? "fill-current" : ""}`}
                  />
                </button>

                <div className="w-full h-px lg:w-px lg:h-8 bg-border my-2" />

                <button
                  onClick={() => handleShare("twitter")}
                  className="p-3 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare("linkedin")}
                  className="p-3 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare("facebook")}
                  className="p-3 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Facebook className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleShare("copy")}
                  className="p-3 rounded-full bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                >
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </aside>

            {/* Main Content */}
            <article
              id="article-content"
              className="flex-1 max-w-3xl order-1 lg:order-2"
            >
              <div className="prose-blog">{renderContent(post.content)}</div>

              {/* Tags */}
              <div className="mt-10 pt-6 border-t border-border">
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link
                      key={tag.id}
                      to={`/tag/${tag.slug}`}
                      className="px-3 py-1.5 bg-secondary text-sm text-muted-foreground rounded-full hover:bg-muted hover:text-foreground transition-colors"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Author Box */}
              <div className="mt-10 p-6 bg-card rounded-xl">
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link to={`/author/${post.author.id}`}>
                    <img
                      src={post.author.avatar}
                      alt={post.author.name}
                      className="w-16 h-16 rounded-full object-cover"
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
              <div className="mt-12">
                <div className="flex items-center gap-2 mb-6">
                  <MessageCircle className="w-5 h-5 text-accent" />
                  <h3 className="font-display text-xl font-semibold text-foreground">
                    Comments
                  </h3>
                </div>
                <div className="p-8 bg-card rounded-xl text-center">
                  <p className="text-muted-foreground mb-4">
                    Join the conversation! Sign in to leave a comment.
                  </p>
                  <Link to="/login">
                    <Button>Sign In to Comment</Button>
                  </Link>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-12 lg:py-16 bg-secondary/30">
          <div className="container-blog">
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground mb-8">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost, index) => (
                <PostCard key={relatedPost.id} post={relatedPost} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Newsletter */}
      <section className="py-12 lg:py-16">
        <div className="container-blog">
          <Newsletter />
        </div>
      </section>
    </Layout>
  );
}
