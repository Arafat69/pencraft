import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2, Save, Key, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function SettingsManager() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [adminCode, setAdminCode] = useState("");
  const [newCode, setNewCode] = useState("");

  useEffect(() => {
    const fetchSettings = async () => {
      const { data, error } = await supabase
        .from("admin_settings")
        .select("value")
        .eq("key", "admin_signup_code")
        .single();

      if (!error && data) {
        setAdminCode(data.value);
      }
      setLoading(false);
    };

    fetchSettings();
  }, []);

  const handleUpdateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode.trim()) {
      toast({
        title: "Code cannot be empty",
        variant: "destructive",
      });
      return;
    }

    if (newCode.length < 8) {
      toast({
        title: "Code must be at least 8 characters",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);

    const { error } = await supabase
      .from("admin_settings")
      .update({ value: newCode })
      .eq("key", "admin_signup_code");

    if (error) {
      if (import.meta.env.DEV) console.error("Error updating code:", error);
      toast({
        title: "Error updating code",
        variant: "destructive",
      });
    } else {
      setAdminCode(newCode);
      setNewCode("");
      toast({ title: "Admin signup code updated" });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-display font-bold mb-6">Settings</h1>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="h-5 w-5" />
                Admin Signup Code
              </CardTitle>
              <CardDescription>
                This code is required to create new admin accounts
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Current Code</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showCode ? "text" : "password"}
                      value={adminCode}
                      readOnly
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowCode(!showCode)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    >
                      {showCode ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(adminCode);
                      toast({ title: "Code copied to clipboard" });
                    }}
                  >
                    Copy
                  </Button>
                </div>
              </div>

              <form onSubmit={handleUpdateCode} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newCode">New Code</Label>
                  <Input
                    id="newCode"
                    type="text"
                    value={newCode}
                    onChange={(e) => setNewCode(e.target.value)}
                    placeholder="Enter new admin code (min 8 characters)"
                  />
                </div>
                <Button type="submit" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Update Code
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Security Note</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Share the admin signup code only with trusted users who need admin access.
                Change it regularly for security. Anyone with the code can create an admin
                account during registration.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
