import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Category } from "@/lib/data";

interface CategoryCardProps {
  category: Category;
  index?: number;
}

export default function CategoryCard({ category, index = 0 }: CategoryCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
    >
      <Link
        to={`/category/${category.slug}`}
        className="group block p-6 rounded-xl bg-card hover:shadow-elevated transition-all duration-300"
        style={{
          borderLeft: `4px solid ${category.color}`,
        }}
      >
        <div className="flex items-start justify-between mb-3">
          <div
            className="w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${category.color}20` }}
          >
            <span
              className="text-2xl font-display font-bold"
              style={{ color: category.color }}
            >
              {category.name.charAt(0)}
            </span>
          </div>
          <ArrowRight
            className="w-5 h-5 text-muted-foreground opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
            style={{ color: category.color }}
          />
        </div>
        <h3 className="font-display text-lg font-semibold text-foreground mb-2">
          {category.name}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
          {category.description}
        </p>
        <span className="text-xs font-medium text-muted-foreground">
          {category.postCount} articles
        </span>
      </Link>
    </motion.div>
  );
}
