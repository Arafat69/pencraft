import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Twitter, Linkedin, ArrowLeft, FileText, Globe, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { useAuthor } from "@/hooks/useAuthors";
import { usePostsByAuthor } from "@/hooks/usePosts";
import { mapDbAuthor, mapDbPost } from "@/lib/data";

export default function AuthorPage() {
  const { id } = useParams<{ id: string }>();
  const { data: dbAuthor, isLoading: authorLoading } = useAuthor(id || "");
  const { data: dbPosts, isLoading: postsLoading } = usePostsByAuthor(id || "");

  const author = dbAuthor ? mapDbAuthor(dbAuthor) : null;
  const posts = (dbPosts || []).map(mapDbPost);
  const isLoading = authorLoading || postsLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="container-blog py-16 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </Layout>
    );
  }

  if (!author) {
    return (
      <Layout>
        <div className="container-blog py-16 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Author Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The author you're looking for doesn't exist.
          </p>
          <Link to="/authors">
            <Button>
              <ArrowLeft className="w-4 h-4 mr-2" />
              View All Authors
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Author Header */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container-blog">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center md:items-start gap-8"
          >
            <img
              src={author.avatar}
              alt={author.name}
              className="w-32 h-32 rounded-full object-cover ring-4 ring-background shadow-elevated"
            />
            <div className="text-center md:text-left">
              <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-2">
                {author.name}
              </h1>
              <p className="text-lg text-accent mb-4">{author.role}</p>
              <p className="text-muted-foreground max-w-xl mb-6">{author.bio}</p>

              <div className="flex items-center justify-center md:justify-start gap-4 flex-wrap">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  {posts.length} articles
                </div>

                {author.twitter && (
                  <a
                    href={`https://twitter.com/${author.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Twitter className="w-4 h-4" />@{author.twitter}
                  </a>
                )}

                {author.linkedin && (
                  <a
                    href={`https://linkedin.com/in/${author.linkedin}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}

                {author.website && (
                  <a
                    href={author.website.startsWith("http") ? author.website : `https://${author.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    Website
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Author's Posts */}
      <section className="py-12 lg:py-16">
        <div className="container-blog">
          <h2 className="font-display text-2xl font-semibold text-foreground mb-8">
            Articles by {author.name}
          </h2>

          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No articles by this author yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
