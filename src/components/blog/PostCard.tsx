import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Clock, Eye, Heart } from "lucide-react";
import { Post, formatDate, formatNumber } from "@/lib/data";

interface PostCardProps {
  post: Post;
  variant?: "default" | "featured" | "horizontal";
  index?: number;
}

export default function PostCard({
  post,
  variant = "default",
  index = 0,
}: PostCardProps) {
  if (variant === "featured") {
    return (
      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group relative overflow-hidden rounded-2xl bg-card shadow-soft card-hover"
      >
        <Link to={`/blog/${post.slug}`}>
          <div className="aspect-[16/9] overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-6 text-primary-foreground">
            <div className="flex items-center gap-2 mb-3">
              <span
                className="px-3 py-1 text-xs font-medium rounded-full"
                style={{ backgroundColor: post.category.color }}
              >
                {post.category.name}
              </span>
              {post.trending && (
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-accent text-accent-foreground">
                  Trending
                </span>
              )}
            </div>
            <h3 className="font-display text-2xl lg:text-3xl font-semibold mb-3 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-primary-foreground/80 text-sm line-clamp-2 mb-4">
              {post.excerpt}
            </p>
            <div className="flex items-center gap-4">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-8 h-8 rounded-full object-cover"
              />
              <div className="flex items-center gap-4 text-sm text-primary-foreground/70">
                <span>{post.author.name}</span>
                <span>·</span>
                <span>{formatDate(post.publishedAt)}</span>
                <span>·</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {post.readingTime} min read
                </span>
              </div>
            </div>
          </div>
        </Link>
      </motion.article>
    );
  }

  if (variant === "horizontal") {
    return (
      <motion.article
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: index * 0.1 }}
        className="group flex gap-4 p-4 rounded-xl bg-card hover:bg-secondary/50 transition-colors"
      >
        <Link to={`/blog/${post.slug}`} className="shrink-0">
          <div className="w-24 h-24 rounded-lg overflow-hidden">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
          </div>
        </Link>
        <div className="flex-1 min-w-0">
          <Link to={`/category/${post.category.slug}`}>
            <span
              className="text-xs font-medium"
              style={{ color: post.category.color }}
            >
              {post.category.name}
            </span>
          </Link>
          <Link to={`/blog/${post.slug}`}>
            <h4 className="font-display text-base font-semibold text-foreground line-clamp-2 mt-1 group-hover:text-accent transition-colors">
              {post.title}
            </h4>
          </Link>
          <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
            <span>{formatDate(post.publishedAt)}</span>
            <span className="flex items-center gap-1">
              <Eye className="w-3 h-3" />
              {formatNumber(post.views)}
            </span>
          </div>
        </div>
      </motion.article>
    );
  }

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group bg-card rounded-xl overflow-hidden shadow-soft card-hover"
    >
      <Link to={`/blog/${post.slug}`}>
        <div className="aspect-[16/10] overflow-hidden">
          <img
            src={post.featuredImage}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Link to={`/category/${post.category.slug}`}>
            <span
              className="px-2.5 py-1 text-xs font-medium rounded-full text-primary-foreground"
              style={{ backgroundColor: post.category.color }}
            >
              {post.category.name}
            </span>
          </Link>
        </div>
        <Link to={`/blog/${post.slug}`}>
          <h3 className="font-display text-xl font-semibold text-foreground line-clamp-2 mb-2 group-hover:text-accent transition-colors">
            {post.title}
          </h3>
        </Link>
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between">
          <Link
            to={`/author/${post.author.id}`}
            className="flex items-center gap-2"
          >
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-sm text-muted-foreground">
              {post.author.name}
            </span>
          </Link>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime} min
            </span>
            <span className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              {formatNumber(post.likes)}
            </span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
