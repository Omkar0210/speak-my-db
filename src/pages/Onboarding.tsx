import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Plus, X } from "lucide-react";

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
        description: "Welcome to CuraLink",
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
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 shadow-[var(--shadow-soft)]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">
            Help us personalize your experience
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="City, Country"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="bio">About You</Label>
            <Textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us a bit about yourself..."
              rows={4}
            />
          </div>

          <div className="space-y-2">
            <Label>Medical Conditions of Interest</Label>
            <div className="flex gap-2">
              <Input
                value={newCondition}
                onChange={(e) => setNewCondition(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addCondition()}
                placeholder="e.g., Brain Cancer, Diabetes"
              />
              <Button onClick={addCondition} type="button">
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            
            {conditions.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {conditions.map((condition) => (
                  <div
                    key={condition}
                    className="bg-secondary px-3 py-1 rounded-full flex items-center gap-2"
                  >
                    <span className="text-sm">{condition}</span>
                    <button
                      onClick={() => removeCondition(condition)}
                      className="hover:text-destructive"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button
            onClick={handleComplete}
            className="w-full"
            disabled={loading}
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Complete Setup
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/dashboard")}
            className="w-full"
          >
            Skip for Now
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;
