import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signupSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters").max(50, "Username too long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      if (isLogin) {
        const result = loginSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const { error } = await signIn(formData.email, formData.password);
        if (error) {
          if (error.message.includes("Invalid login credentials")) {
            toast.error("Invalid email or password");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Welcome back!");
          navigate("/");
        }
      } else {
        const result = signupSchema.safeParse(formData);
        if (!result.success) {
          const fieldErrors: Record<string, string> = {};
          result.error.errors.forEach((err) => {
            if (err.path[0]) {
              fieldErrors[err.path[0] as string] = err.message;
            }
          });
          setErrors(fieldErrors);
          setIsLoading(false);
          return;
        }

        const { error } = await signUp(formData.email, formData.password, formData.username);
        if (error) {
          if (error.message.includes("already registered")) {
            toast.error("This email is already registered. Please sign in.");
          } else {
            toast.error(error.message);
          }
        } else {
          toast.success("Account created successfully!");
          navigate("/");
        }
      }
    } catch (err) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <Link to="/" className="flex items-center justify-center gap-2 mb-8">
          <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-display font-bold text-2xl">
              P
            </span>
          </div>
          <span className="font-display text-2xl font-semibold text-foreground">
            Pencraft
          </span>
        </Link>

        {/* Form Card */}
        <div className="bg-card rounded-2xl p-8 shadow-elevated">
          <div className="text-center mb-8">
            <h1 className="font-display text-2xl font-bold text-foreground mb-2">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-muted-foreground">
              {isLogin
                ? "Sign in to continue to Pencraft"
                : "Join our community of writers and readers"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="username"
                    name="username"
                    type="text"
                    placeholder="johndoe"
                    value={formData.username}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
                {errors.username && (
                  <p className="text-sm text-destructive">{errors.username}</p>
                )}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="pl-10"
                />
              </div>
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="pl-10 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password}</p>
              )}
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="pl-10"
                  />
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setFormData({
                    username: "",
                    email: "",
                    password: "",
                    confirmPassword: "",
                  });
                }}
                className="text-accent hover:underline font-medium"
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          By continuing, you agree to our{" "}
          <Link to="/terms" className="text-accent hover:underline">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link to="/privacy" className="text-accent hover:underline">
            Privacy Policy
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
