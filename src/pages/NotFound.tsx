import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, ArrowLeft } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Layout>
      <section className="py-24 lg:py-32">
        <div className="container-blog text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-display text-8xl lg:text-9xl font-bold text-accent mb-4">404</h1>
            <h2 className="font-display text-2xl lg:text-3xl font-semibold text-foreground mb-4">Page Not Found</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">The page you're looking for doesn't exist or has been moved.</p>
            <div className="flex items-center justify-center gap-4">
              <Link to="/"><Button className="gap-2"><Home className="w-4 h-4" />Go Home</Button></Link>
              <Button variant="outline" onClick={() => window.history.back()} className="gap-2"><ArrowLeft className="w-4 h-4" />Go Back</Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
