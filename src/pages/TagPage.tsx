import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Hash, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { useTag } from "@/hooks/useTags";
import { usePostsByTag } from "@/hooks/usePosts";
import { mapDbTag, mapDbPost } from "@/lib/data";

export default function TagPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: dbTag, isLoading: tagLoading } = useTag(slug || "");
  const { data: dbPosts, isLoading: postsLoading } = usePostsByTag(slug || "");

  const tag = dbTag ? mapDbTag(dbTag) : null;
  const posts = (dbPosts || []).map(mapDbPost);
  const isLoading = tagLoading || postsLoading;

  if (isLoading) {
    return (
      <Layout>
        <div className="container-blog py-16 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-accent" />
        </div>
      </Layout>
    );
  }

  if (!tag) {
    return (
      <Layout>
        <div className="container-blog py-16 text-center">
          <h1 className="font-display text-3xl font-bold text-foreground mb-4">
            Tag Not Found
          </h1>
          <p className="text-muted-foreground mb-6">
            The tag you're looking for doesn't exist.
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

  return (
    <Layout>
      {/* Tag Header */}
      <section className="py-16 lg:py-24 bg-secondary/30">
        <div className="container-blog">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6">
              <Hash className="w-8 h-8 text-accent" />
            </div>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-foreground mb-4">
              {tag.name}
            </h1>
            <p className="text-lg text-muted-foreground">
              {posts.length} article{posts.length !== 1 ? "s" : ""} tagged with #{tag.name}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-12 lg:py-16">
        <div className="container-blog">
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post, index) => (
                <PostCard key={post.id} post={post} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                No articles with this tag yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
