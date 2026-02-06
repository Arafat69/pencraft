import { useState, useMemo } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Search as SearchIcon, Loader2, FileText, Package, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import PostCard from "@/components/blog/PostCard";
import { Button } from "@/components/ui/button";
import { usePosts } from "@/hooks/usePosts";
import { useProducts } from "@/hooks/useProducts";
import { mapDbPost } from "@/lib/data";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SearchPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const [activeTab, setActiveTab] = useState<"all" | "articles" | "products">("all");

  const { data: dbPosts, isLoading: postsLoading } = usePosts();
  const { data: products, isLoading: productsLoading } = useProducts();

  const posts = useMemo(() => (dbPosts || []).map(mapDbPost), [dbPosts]);
  const isLoading = postsLoading || productsLoading;

  // Search through posts - includes tags and secret keywords
  const filteredPosts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    
    return posts.filter((post) => {
      // Check title, excerpt, content
      const titleMatch = post.title.toLowerCase().includes(q);
      const excerptMatch = post.excerpt.toLowerCase().includes(q);
      const contentMatch = post.content.toLowerCase().includes(q);
      
      // Check visible tags
      const tagMatch = post.tags.some((tag) => 
        tag.name.toLowerCase().includes(q) || tag.slug.toLowerCase().includes(q)
      );
      
      // Check category
      const categoryMatch = post.category.name.toLowerCase().includes(q);
      
      // Check author
      const authorMatch = post.author.name.toLowerCase().includes(q);
      
      // Check secret keywords (from DB via dbPosts)
      const dbPost = (dbPosts || []).find(p => p.id === post.id);
      const secretKeywords = (dbPost as unknown as { secret_keywords?: string[] })?.secret_keywords || [];
      const secretMatch = secretKeywords.some((kw: string) => 
        kw.toLowerCase().includes(q)
      );
      
      return titleMatch || excerptMatch || contentMatch || tagMatch || categoryMatch || authorMatch || secretMatch;
    });
  }, [posts, dbPosts, query]);

  // Search through products - includes secret keywords
  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    
    return (products || []).filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(q);
      const descMatch = (product.description || "").toLowerCase().includes(q);
      const categoryMatch = (product.category || "").toLowerCase().includes(q);
      
      // Check secret keywords
      const secretKeywords = (product as unknown as { secret_keywords?: string[] }).secret_keywords || [];
      const secretMatch = secretKeywords.some((kw: string) => 
        kw.toLowerCase().includes(q)
      );
      
      return nameMatch || descMatch || categoryMatch || secretMatch;
    });
  }, [products, query]);

  const totalResults = filteredPosts.length + filteredProducts.length;

  return (
    <Layout>
      {/* Search Header */}
      <section className="py-12 lg:py-16 bg-secondary/30">
        <div className="container-blog">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 text-accent rounded-full text-sm font-medium mb-6">
              <SearchIcon className="w-4 h-4" />
              Search Results
            </div>
            <h1 className="font-display text-3xl lg:text-4xl font-bold text-foreground mb-4">
              {query ? `Results for "${query}"` : "Search"}
            </h1>
            {query && (
              <p className="text-muted-foreground">
                Found {totalResults} result{totalResults !== 1 ? "s" : ""} across articles and products
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* Search Results */}
      <section className="py-8 lg:py-12">
        <div className="container-blog">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
            </div>
          ) : !query ? (
            <div className="text-center py-16">
              <SearchIcon className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                Enter a search term
              </h3>
              <p className="text-muted-foreground">
                Use the search bar in the header to find articles and products
              </p>
            </div>
          ) : totalResults === 0 ? (
            <div className="text-center py-16">
              <SearchIcon className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">
                No results found
              </h3>
              <p className="text-muted-foreground mb-6">
                Try different keywords or check your spelling
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link to="/blog">
                  <Button variant="outline">Browse Articles</Button>
                </Link>
                <Link to="/shop">
                  <Button variant="outline">Browse Shop</Button>
                </Link>
              </div>
            </div>
          ) : (
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
              <TabsList className="mb-8">
                <TabsTrigger value="all" className="gap-2">
                  All ({totalResults})
                </TabsTrigger>
                <TabsTrigger value="articles" className="gap-2">
                  <FileText className="w-4 h-4" />
                  Articles ({filteredPosts.length})
                </TabsTrigger>
                <TabsTrigger value="products" className="gap-2">
                  <Package className="w-4 h-4" />
                  Products ({filteredProducts.length})
                </TabsTrigger>
              </TabsList>

              {/* All Results */}
              <TabsContent value="all" className="space-y-12">
                {/* Articles Section */}
                {filteredPosts.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                        <FileText className="w-5 h-5 text-accent" />
                        Articles
                      </h2>
                      {filteredPosts.length > 3 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTab("articles")}
                          className="gap-1"
                        >
                          View all
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredPosts.slice(0, 3).map((post, index) => (
                        <PostCard key={post.id} post={post} index={index} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Products Section */}
                {filteredProducts.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="font-display text-xl font-semibold text-foreground flex items-center gap-2">
                        <Package className="w-5 h-5 text-accent" />
                        Products
                      </h2>
                      {filteredProducts.length > 4 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setActiveTab("products")}
                          className="gap-1"
                        >
                          View all
                          <ArrowRight className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {filteredProducts.slice(0, 4).map((product) => (
                        <Link
                          key={product.id}
                          to={`/shop/${product.id}`}
                          className="group bg-card rounded-xl overflow-hidden border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-lg"
                        >
                          <div className="aspect-square bg-muted overflow-hidden">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-8 h-8 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                              {product.name}
                            </h3>
                            <p className="text-accent font-semibold mt-1">
                              ৳{product.price.toLocaleString()}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>

              {/* Articles Only */}
              <TabsContent value="articles">
                {filteredPosts.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPosts.map((post, index) => (
                      <PostCard key={post.id} post={post} index={index} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FileText className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No articles found</p>
                  </div>
                )}
              </TabsContent>

              {/* Products Only */}
              <TabsContent value="products">
                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {filteredProducts.map((product) => (
                      <Link
                        key={product.id}
                        to={`/shop/${product.id}`}
                        className="group bg-card rounded-xl overflow-hidden border border-border/50 hover:border-accent/30 transition-all duration-300 hover:shadow-lg"
                      >
                        <div className="aspect-square bg-muted overflow-hidden">
                          {product.image_url ? (
                            <img
                              src={product.image_url}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Package className="w-8 h-8 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                            {product.name}
                          </h3>
                          {product.description && (
                            <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                              {product.description}
                            </p>
                          )}
                          <p className="text-accent font-semibold mt-2">
                            ৳{product.price.toLocaleString()}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Package className="w-12 h-12 mx-auto text-muted-foreground/30 mb-4" />
                    <p className="text-muted-foreground">No products found</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </section>
    </Layout>
  );
}
