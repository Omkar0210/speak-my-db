import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import VoiceAgent from "@/components/VoiceAgent";
import MessageAgent from "@/components/MessageAgent";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Heart, FileText, Users, MessageSquare, Mic } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate("/");
        return;
      }

      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === 'PGRST116') {
          navigate("/onboarding");
          return;
        }
        throw error;
      }

      setProfile(profileData);
    } catch (error: any) {
      console.error("Error checking auth:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              CuraLink
            </h1>
            <p className="text-sm text-muted-foreground">
              Welcome back, {profile?.full_name}
            </p>
          </div>
          <Button variant="outline" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trials">Trials</TabsTrigger>
            <TabsTrigger value="experts">Experts</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 shadow-[var(--shadow-soft)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Saved Items</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-[var(--shadow-soft)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Trials</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-[var(--shadow-soft)]">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/50 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Connections</p>
                    <p className="text-2xl font-bold">0</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 shadow-[var(--shadow-soft)]">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Button variant="outline" className="justify-start h-auto py-4">
                  <FileText className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Find Clinical Trials</p>
                    <p className="text-xs text-muted-foreground">Discover trials matching your conditions</p>
                  </div>
                </Button>
                <Button variant="outline" className="justify-start h-auto py-4">
                  <Users className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Connect with Experts</p>
                    <p className="text-xs text-muted-foreground">Find healthcare professionals</p>
                  </div>
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="trials">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Clinical Trials</h2>
              <div className="space-y-4">
                <Card className="p-6 shadow-[var(--shadow-soft)]">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Phase III Cancer Immunotherapy Trial</h3>
                      <p className="text-sm text-muted-foreground mb-3">Testing new immunotherapy approach for advanced melanoma patients</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Oncology</span>
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">Phase III</span>
                        <span className="text-xs bg-secondary px-2 py-1 rounded">Recruiting</span>
                      </div>
                      <p className="text-sm"><strong>Location:</strong> Johns Hopkins Hospital, Baltimore, MD</p>
                      <p className="text-sm"><strong>Duration:</strong> 24 months</p>
                    </div>
                    <Button size="sm">Learn More</Button>
                  </div>
                </Card>

                <Card className="p-6 shadow-[var(--shadow-soft)]">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Type 2 Diabetes Management Study</h3>
                      <p className="text-sm text-muted-foreground mb-3">Novel oral medication for blood sugar control in diabetic patients</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Endocrinology</span>
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">Phase II</span>
                        <span className="text-xs bg-secondary px-2 py-1 rounded">Recruiting</span>
                      </div>
                      <p className="text-sm"><strong>Location:</strong> Mayo Clinic, Rochester, MN</p>
                      <p className="text-sm"><strong>Duration:</strong> 18 months</p>
                    </div>
                    <Button size="sm">Learn More</Button>
                  </div>
                </Card>

                <Card className="p-6 shadow-[var(--shadow-soft)]">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Alzheimer's Prevention Trial</h3>
                      <p className="text-sm text-muted-foreground mb-3">Early intervention study for individuals at risk of cognitive decline</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Neurology</span>
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">Phase III</span>
                        <span className="text-xs bg-secondary px-2 py-1 rounded">Recruiting</span>
                      </div>
                      <p className="text-sm"><strong>Location:</strong> Stanford Medical Center, Stanford, CA</p>
                      <p className="text-sm"><strong>Duration:</strong> 36 months</p>
                    </div>
                    <Button size="sm">Learn More</Button>
                  </div>
                </Card>

                <Card className="p-6 shadow-[var(--shadow-soft)]">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Heart Failure Treatment Study</h3>
                      <p className="text-sm text-muted-foreground mb-3">Evaluating new treatment for chronic heart failure patients</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Cardiology</span>
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">Phase III</span>
                        <span className="text-xs bg-secondary px-2 py-1 rounded">Recruiting</span>
                      </div>
                      <p className="text-sm"><strong>Location:</strong> Cleveland Clinic, Cleveland, OH</p>
                      <p className="text-sm"><strong>Duration:</strong> 24 months</p>
                    </div>
                    <Button size="sm">Learn More</Button>
                  </div>
                </Card>

                <Card className="p-6 shadow-[var(--shadow-soft)]">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-2">Asthma Control Innovation Trial</h3>
                      <p className="text-sm text-muted-foreground mb-3">New inhaler technology for severe asthma management</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Respiratory</span>
                        <span className="text-xs bg-accent/10 text-accent px-2 py-1 rounded">Phase II</span>
                        <span className="text-xs bg-secondary px-2 py-1 rounded">Recruiting</span>
                      </div>
                      <p className="text-sm"><strong>Location:</strong> Mass General Hospital, Boston, MA</p>
                      <p className="text-sm"><strong>Duration:</strong> 12 months</p>
                    </div>
                    <Button size="sm">Learn More</Button>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="experts">
            <div className="space-y-6">
              <h2 className="text-2xl font-bold">Medical Experts</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="p-6 shadow-[var(--shadow-soft)]">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Dr. Sarah Johnson</h3>
                      <p className="text-sm text-muted-foreground">Oncology Specialist</p>
                      <p className="text-sm mt-2">15+ years in cancer research and treatment. Specializes in immunotherapy trials.</p>
                      <Button variant="outline" size="sm" className="mt-4">Connect</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-[var(--shadow-soft)]">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Dr. Michael Chen</h3>
                      <p className="text-sm text-muted-foreground">Cardiology Research</p>
                      <p className="text-sm mt-2">Leading cardiovascular clinical trials. Expert in heart disease prevention.</p>
                      <Button variant="outline" size="sm" className="mt-4">Connect</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-[var(--shadow-soft)]">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Dr. Emily Rodriguez</h3>
                      <p className="text-sm text-muted-foreground">Neurology Expert</p>
                      <p className="text-sm mt-2">Alzheimer's and dementia research. 20+ years clinical trial experience.</p>
                      <Button variant="outline" size="sm" className="mt-4">Connect</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-[var(--shadow-soft)]">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Dr. James Wilson</h3>
                      <p className="text-sm text-muted-foreground">Diabetes Specialist</p>
                      <p className="text-sm mt-2">Type 1 & 2 diabetes management. Focus on innovative insulin therapies.</p>
                      <Button variant="outline" size="sm" className="mt-4">Connect</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-[var(--shadow-soft)]">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Dr. Lisa Park</h3>
                      <p className="text-sm text-muted-foreground">Respiratory Medicine</p>
                      <p className="text-sm mt-2">COPD and asthma clinical trials. Expert in pulmonary rehabilitation.</p>
                      <Button variant="outline" size="sm" className="mt-4">Connect</Button>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 shadow-[var(--shadow-soft)]">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Dr. Robert Kumar</h3>
                      <p className="text-sm text-muted-foreground">Immunology Research</p>
                      <p className="text-sm mt-2">Autoimmune disease specialist. Leading vaccine development trials.</p>
                      <Button variant="outline" size="sm" className="mt-4">Connect</Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
