"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, LogIn, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/auth";

const AdminLogin = () => {
  const { login, isAuthenticated } = useAuth();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) router.replace("/admin");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const result = await login(email, password);
    setLoading(false);
    if (result.ok) {
      router.replace("/admin");
    } else {
      setError(result.error ?? "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-5 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-72 h-72 bg-secondary/10 rounded-full blur-3xl" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="glass-card p-8 md:p-10 w-full max-w-md relative z-10"
      >
        <Link href="/" className="block text-center mb-8">
          <span className="font-display text-2xl tracking-wider text-foreground">
            Owshie Tattoo<span className="text-primary"> x </span>Celeste Nail
          </span>
        </Link>

        <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Lock size={24} className="text-primary" />
        </div>
        <h1 className="font-display text-3xl tracking-wider text-foreground text-center">Admin Login</h1>
        <p className="text-muted-foreground text-sm text-center mt-2">Sign in to manage your studio</p>

        {error && (
          <div className="mt-6 flex items-center gap-2 bg-destructive/10 border border-destructive/30 rounded-lg px-4 py-3 text-destructive text-sm">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Email</label>
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@owshiexceleste.com"
              className="w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <div>
            <label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Password</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-muted border border-border/50 rounded-lg px-4 py-3 text-foreground text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 rounded-lg font-medium text-sm tracking-wide bg-primary text-primary-foreground gold-glow hover:opacity-90 transition-opacity disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {loading ? "Signing in..." : "Sign In"} <LogIn size={16} />
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
