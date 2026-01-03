import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Twitter, Linkedin } from "lucide-react";
import { Author } from "@/lib/data";

interface AuthorCardProps {
  author: Author;
  index?: number;
  variant?: "default" | "compact";
}

export default function AuthorCard({
  author,
  index = 0,
  variant = "default",
}: AuthorCardProps) {
  if (variant === "compact") {
    return (
      <Link
        to={`/author/${author.id}`}
        className="flex items-center gap-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors"
      >
        <img
          src={author.avatar}
          alt={author.name}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div>
          <h4 className="font-medium text-foreground text-sm">{author.name}</h4>
          <p className="text-xs text-muted-foreground">{author.role}</p>
        </div>
      </Link>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-card rounded-xl p-6 text-center shadow-soft card-hover"
    >
      <Link to={`/author/${author.id}`}>
        <img
          src={author.avatar}
          alt={author.name}
          className="w-20 h-20 rounded-full object-cover mx-auto mb-4 ring-4 ring-secondary"
        />
        <h3 className="font-display text-lg font-semibold text-foreground mb-1">
          {author.name}
        </h3>
        <p className="text-sm text-accent mb-3">{author.role}</p>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
          {author.bio}
        </p>
      </Link>
      <div className="flex items-center justify-center gap-2">
        {author.twitter && (
          <a
            href={`https://twitter.com/${author.twitter}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Twitter className="w-4 h-4" />
          </a>
        )}
        {author.linkedin && (
          <a
            href={`https://linkedin.com/in/${author.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        )}
      </div>
      <div className="mt-4 pt-4 border-t border-border">
        <span className="text-sm text-muted-foreground">
          {author.postCount} articles
        </span>
      </div>
    </motion.div>
  );
}
