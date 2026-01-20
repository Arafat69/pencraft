import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import BlogList from "./pages/BlogList";
import BlogPost from "./pages/BlogPost";
import CategoryPage from "./pages/CategoryPage";
import CategoriesPage from "./pages/CategoriesPage";
import TagPage from "./pages/TagPage";
import AuthorPage from "./pages/AuthorPage";
import AuthorsPage from "./pages/AuthorsPage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AuthorsManager from "./pages/admin/AuthorsManager";
import AuthorForm from "./pages/admin/AuthorForm";
import PostsManager from "./pages/admin/PostsManager";
import PostForm from "./pages/admin/PostForm";
import CategoriesManager from "./pages/admin/CategoriesManager";
import TagsManager from "./pages/admin/TagsManager";
import FeaturedManager from "./pages/admin/FeaturedManager";
import TrendingManager from "./pages/admin/TrendingManager";
import NoticesManager from "./pages/admin/NoticesManager";
import AboutManager from "./pages/admin/AboutManager";
import SettingsManager from "./pages/admin/SettingsManager";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Terms from "./pages/Terms";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import ProductsManager from "./pages/admin/ProductsManager";
import OrdersManager from "./pages/admin/OrdersManager";
import MessagesManager from "./pages/admin/MessagesManager";
import ProductDetail from "./pages/ProductDetail";
import { useEffect } from "react";

const queryClient = new QueryClient();

// Force dark theme
function DarkThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.add("dark");
  }, []);
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <DarkThemeProvider>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/blog" element={<BlogList />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/categories" element={<CategoriesPage />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/tag/:slug" element={<TagPage />} />
              <Route path="/authors" element={<AuthorsPage />} />
              <Route path="/author/:id" element={<AuthorPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/privacy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/shop/:id" element={<ProductDetail />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/login" element={<Auth />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/search" element={<BlogList />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />}>
                <Route path="authors" element={<AuthorsManager />} />
                <Route path="authors/new" element={<AuthorForm />} />
                <Route path="authors/:id" element={<AuthorForm />} />
                <Route path="posts" element={<PostsManager />} />
                <Route path="posts/new" element={<PostForm />} />
                <Route path="posts/:id" element={<PostForm />} />
                <Route path="categories" element={<CategoriesManager />} />
                <Route path="tags" element={<TagsManager />} />
                <Route path="featured" element={<FeaturedManager />} />
                <Route path="trending" element={<TrendingManager />} />
                <Route path="notices" element={<NoticesManager />} />
                <Route path="products" element={<ProductsManager />} />
                <Route path="orders" element={<OrdersManager />} />
                <Route path="messages" element={<MessagesManager />} />
                <Route path="about" element={<AboutManager />} />
                <Route path="settings" element={<SettingsManager />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </DarkThemeProvider>
  </QueryClientProvider>
);

export default App;
