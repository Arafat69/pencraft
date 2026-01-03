import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(isLogin ? "Welcome back!" : "Account created successfully!");
  };

  return (
    <Layout>
      <section className="py-16 lg:py-24">
        <div className="container-blog">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="font-display text-3xl font-bold text-foreground mb-2">{isLogin ? "Welcome Back" : "Create Account"}</h1>
              <p className="text-muted-foreground">{isLogin ? "Sign in to access your account" : "Join our community of readers and writers"}</p>
            </div>
            <form onSubmit={handleSubmit} className="bg-card p-8 rounded-xl shadow-soft space-y-4">
              {!isLogin && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-secondary rounded-lg outline-none focus:ring-2 focus:ring-accent" placeholder="John Doe" />
                  </div>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-secondary rounded-lg outline-none focus:ring-2 focus:ring-accent" placeholder="you@example.com" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 bg-secondary rounded-lg outline-none focus:ring-2 focus:ring-accent" placeholder="••••••••" required />
                </div>
              </div>
              {isLogin && <Link to="/forgot-password" className="text-sm text-accent hover:underline block text-right">Forgot password?</Link>}
              <Button type="submit" className="w-full gap-2">{isLogin ? "Sign In" : "Create Account"}<ArrowRight className="w-4 h-4" /></Button>
            </form>
            <p className="text-center mt-6 text-sm text-muted-foreground">
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button onClick={() => setIsLogin(!isLogin)} className="text-accent hover:underline font-medium">{isLogin ? "Sign up" : "Sign in"}</button>
            </p>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
