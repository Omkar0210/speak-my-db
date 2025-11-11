import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X, MapPin } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState("");
  const [bio, setBio] = useState("");
  const [conditions, setConditions] = useState<string[]>([]);
  const [newCondition, setNewCondition] = useState("");

  const addCondition = () => {
    if (newCondition.trim() && !conditions.includes(newCondition.trim())) {
      setConditions([...conditions, newCondition.trim()]);
      setNewCondition("");
    }
  };

  const removeCondition = (condition: string) => {
    setConditions(conditions.filter(c => c !== condition));
  };

  const handleComplete = async () => {
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          location,
          bio,
        })
        .eq("user_id", user.id);

      if (profileError) throw profileError;

      // Add conditions
      if (conditions.length > 0) {
        const conditionRecords = conditions.map(condition => ({
          user_id: user.id,
          condition_name: condition,
        }));

        const { error: conditionsError } = await supabase
          .from("conditions")
          .insert(conditionRecords);

        if (conditionsError) throw conditionsError;
      }

      toast({
        title: "Profile Complete!",
        description: "Welcome to colLABiora",
      });

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error completing onboarding:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Progress Steps */}
        <div className="flex justify-center items-center gap-4 mb-8">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-semibold text-sm">
            ✓
          </div>
          <div className="w-12 h-1 bg-primary/30"></div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20 text-primary font-semibold text-sm">
            ✓
          </div>
          <div className="w-12 h-1 bg-primary/30"></div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-semibold text-sm">
            3
          </div>
          <div className="w-12 h-1 bg-muted"></div>
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted text-muted-foreground font-semibold text-sm">
            4
          </div>
        </div>

        <Card className="p-8 shadow-[var(--shadow-hover)] border border-border/50">
          <div className="text-center mb-8">
            <p className="text-xs text-muted-foreground mb-2">Step 3 of 4: Profile Setup</p>
            <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
            <p className="text-muted-foreground">
              Help us personalize your experience
            </p>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="location" className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Location
              </Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City, Country"
                className="h-11"
              />
              <p className="text-xs text-muted-foreground">
                We'll show you nearby clinical trials and experts
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">About You</Label>
              <Textarea
                id="bio"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us a bit about yourself..."
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label>Medical Conditions of Interest</Label>
              <div className="flex gap-2">
                <Input
                  value={newCondition}
                  onChange={(e) => setNewCondition(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      addCondition();
                    }
                  }}
                  placeholder="e.g., Brain Cancer, Diabetes, Alzheimer's"
                  className="h-11"
                />
                <Button 
                  onClick={addCondition} 
                  type="button"
                  className="bg-primary hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {conditions.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3 p-4 bg-secondary/30 rounded-lg">
                  {conditions.map((condition) => (
                    <div
                      key={condition}
                      className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-full flex items-center gap-2"
                    >
                      <span className="text-sm font-medium">{condition}</span>
                      <button
                        onClick={() => removeCondition(condition)}
                        className="hover:text-destructive transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 space-y-3">
              <Button
                onClick={handleComplete}
                className="w-full h-11 bg-primary hover:bg-primary/90 shadow-[var(--shadow-soft)]"
                disabled={loading}
              >
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Complete Setup
              </Button>

              <Button
                variant="outline"
                onClick={() => navigate("/dashboard")}
                className="w-full h-11"
              >
                Skip for Now
              </Button>
            </div>
          </div>
        </Card>

        <p className="text-center text-xs text-muted-foreground mt-4">
          You can always update your profile later in settings
        </p>
      </div>
    </div>
  );
};

export default Onboarding;
