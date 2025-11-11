import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LogOut, Heart, FileText, Users, Search, MessageSquare, MapPin, Star, Send, BookMarked, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTrial, setSelectedTrial] = useState<any>(null);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [forumPost, setForumPost] = useState("");
  const [selectedForum, setSelectedForum] = useState<any>(null);

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

  const handleConnect = (expertName: string) => {
    toast({
      title: "Connection Request Sent!",
      description: `Your request to connect with ${expertName} has been sent.`,
    });
  };

  const handleApplyTrial = (trialTitle: string) => {
    toast({
      title: "Application Submitted!",
      description: `Your application for "${trialTitle}" has been submitted.`,
    });
  };

  const handleForumPost = () => {
    if (!forumPost.trim()) return;
    toast({
      title: "Post Created!",
      description: "Your question has been posted to the forum.",
    });
    setForumPost("");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              colLABiora
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:inline-grid">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="search">Search</TabsTrigger>
            <TabsTrigger value="trials">Trials</TabsTrigger>
            <TabsTrigger value="experts">Experts</TabsTrigger>
            <TabsTrigger value="forum">Forum</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-3 gap-6">
              <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Saved Items</p>
                    <p className="text-2xl font-bold">8</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                    <FileText className="w-6 h-6 text-accent" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Active Trials</p>
                    <p className="text-2xl font-bold">3</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-secondary/50 rounded-xl flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Connections</p>
                    <p className="text-2xl font-bold">12</p>
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 shadow-[var(--shadow-soft)]">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 hover:bg-primary/5 hover:border-primary"
                  onClick={() => setActiveTab("trials")}
                >
                  <FileText className="w-5 h-5 mr-3 text-primary" />
                  <div className="text-left">
                    <p className="font-medium">Find Clinical Trials</p>
                    <p className="text-xs text-muted-foreground">Discover trials matching your conditions</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4 hover:bg-accent/5 hover:border-accent"
                  onClick={() => setActiveTab("experts")}
                >
                  <Users className="w-5 h-5 mr-3 text-accent" />
                  <div className="text-left">
                    <p className="font-medium">Connect with Experts</p>
                    <p className="text-xs text-muted-foreground">Find healthcare professionals</p>
                  </div>
                </Button>
              </div>
            </Card>

            <Card className="p-6 shadow-[var(--shadow-soft)]">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Top Researchers</h2>
                <Badge className="bg-primary/10 text-primary">Trending</Badge>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Dr. Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground">Oncology - Johns Hopkins</p>
                    </div>
                  </div>
                  <Badge variant="outline">95% Match</Badge>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                      <Users className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium">Dr. Michael Chen</p>
                      <p className="text-xs text-muted-foreground">Cardiology - Cleveland Clinic</p>
                    </div>
                  </div>
                  <Badge variant="outline">92% Match</Badge>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Search Tab */}
          <TabsContent value="search" className="space-y-6">
            <Card className="p-6 shadow-[var(--shadow-soft)]">
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input 
                    placeholder="Search for researchers, trials, publications, or conditions..." 
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>

              {searchQuery && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-primary" />
                      Matching Researchers
                    </h3>
                    <div className="space-y-3">
                      <Card className="p-4 hover:shadow-[var(--shadow-hover)] transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                              <Users className="w-6 h-6 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold">Dr. Sarah Johnson</p>
                              <p className="text-sm text-muted-foreground">Oncology Specialist - Johns Hopkins</p>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">Cancer Research</Badge>
                                <Badge variant="secondary" className="text-xs">Immunotherapy</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-primary/10 text-primary mb-2">95% Match</Badge>
                            <p className="text-xs text-muted-foreground">15+ Publications</p>
                          </div>
                        </div>
                      </Card>

                      <Card className="p-4 hover:shadow-[var(--shadow-hover)] transition-all cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                              <Users className="w-6 h-6 text-accent" />
                            </div>
                            <div>
                              <p className="font-semibold">Dr. Emily Rodriguez</p>
                              <p className="text-sm text-muted-foreground">Neurology Expert - Stanford</p>
                              <div className="flex gap-2 mt-1">
                                <Badge variant="secondary" className="text-xs">Alzheimer's</Badge>
                                <Badge variant="secondary" className="text-xs">Brain Research</Badge>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className="bg-accent/10 text-accent mb-2">88% Match</Badge>
                            <p className="text-xs text-muted-foreground">20+ Publications</p>
                          </div>
                        </div>
                      </Card>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Trials Tab */}
          <TabsContent value="trials" className="space-y-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Clinical Trials Near You</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>Location-based results</span>
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Trial 1 */}
              <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">Phase III Cancer Immunotherapy Trial</h3>
                      <Badge className="bg-primary/10 text-primary">90% Match</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Testing new immunotherapy approach for advanced melanoma patients
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">Oncology</Badge>
                      <Badge variant="outline" className="text-xs">Phase III</Badge>
                      <Badge className="bg-green-500/10 text-green-600 text-xs">Recruiting</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>Johns Hopkins Hospital, Baltimore, MD</span>
                      </div>
                      <span className="text-muted-foreground">• 24 months</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setSelectedTrial({
                      title: "Phase III Cancer Immunotherapy Trial",
                      description: "Testing new immunotherapy approach for advanced melanoma patients",
                      fullDescription: "This groundbreaking Phase III clinical trial is investigating a novel immunotherapy treatment for patients with advanced melanoma. The study aims to evaluate the efficacy and safety of combining two immunotherapy agents to enhance the body's immune response against cancer cells. Participants will receive the experimental treatment over 24 months with regular monitoring and follow-up assessments.",
                      eligibility: "Adults 18-75 years with stage III or IV melanoma, ECOG performance status 0-1, adequate organ function",
                      contact: "Dr. Sarah Johnson - sjohnson@jhmi.edu - (410) 955-5000",
                      location: "Johns Hopkins Hospital, Baltimore, MD",
                      duration: "24 months",
                      matchScore: "90%"
                    })}
                  >
                    Learn More
                  </Button>
                </div>
              </Card>

              {/* Trial 2 */}
              <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">Alzheimer's Prevention Trial</h3>
                      <Badge className="bg-accent/10 text-accent">85% Match</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Early intervention study for individuals at risk of cognitive decline
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">Neurology</Badge>
                      <Badge variant="outline" className="text-xs">Phase III</Badge>
                      <Badge className="bg-green-500/10 text-green-600 text-xs">Recruiting</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>Stanford Medical Center, Stanford, CA</span>
                      </div>
                      <span className="text-muted-foreground">• 36 months</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setSelectedTrial({
                      title: "Alzheimer's Prevention Trial",
                      description: "Early intervention study for individuals at risk of cognitive decline",
                      fullDescription: "This Phase III prevention trial investigates whether early intervention with a novel therapeutic approach can delay or prevent the onset of Alzheimer's disease in individuals at high risk. The study includes comprehensive cognitive assessments, biomarker monitoring, and lifestyle interventions over a 36-month period.",
                      eligibility: "Adults 60-75 years with family history of Alzheimer's or genetic risk factors, normal cognition or mild cognitive impairment",
                      contact: "Dr. Emily Rodriguez - erodriguez@stanford.edu - (650) 723-2300",
                      location: "Stanford Medical Center, Stanford, CA",
                      duration: "36 months",
                      matchScore: "85%"
                    })}
                  >
                    Learn More
                  </Button>
                </div>
              </Card>

              {/* Trial 3 */}
              <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-lg">Type 2 Diabetes Management Study</h3>
                      <Badge className="bg-primary/10 text-primary">92% Match</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Novel oral medication for blood sugar control in diabetic patients
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">Endocrinology</Badge>
                      <Badge variant="outline" className="text-xs">Phase II</Badge>
                      <Badge className="bg-green-500/10 text-green-600 text-xs">Recruiting</Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>Mayo Clinic, Rochester, MN</span>
                      </div>
                      <span className="text-muted-foreground">• 18 months</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setSelectedTrial({
                      title: "Type 2 Diabetes Management Study",
                      description: "Novel oral medication for blood sugar control in diabetic patients",
                      fullDescription: "This Phase II study evaluates a new once-daily oral medication designed to improve blood sugar control in adults with Type 2 diabetes. The medication works through a unique mechanism targeting both insulin sensitivity and glucose production.",
                      eligibility: "Adults 21+ years with Type 2 diabetes for at least 1 year, HbA1c 7.5-11%, BMI 25-40",
                      contact: "Dr. James Wilson - jwilson@mayo.edu - (507) 284-2511",
                      location: "Mayo Clinic, Rochester, MN",
                      duration: "18 months",
                      matchScore: "92%"
                    })}
                  >
                    Learn More
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Experts Tab */}
          <TabsContent value="experts" className="space-y-6">
            <h2 className="text-2xl font-bold">Medical Experts & Researchers</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Expert 1 */}
              <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Dr. Sarah Johnson</h3>
                      <p className="text-sm text-muted-foreground">Oncology Specialist</p>
                      <Badge className="bg-primary/10 text-primary mt-2">95% Match</Badge>
                    </div>
                  </div>
                  <p className="text-sm">15+ years in cancer research and treatment. Specializes in immunotherapy trials.</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">Johns Hopkins</Badge>
                    <Badge variant="secondary" className="text-xs">15 Publications</Badge>
                  </div>
                  <Button 
                    variant="outline" 
                    className="w-full hover:bg-primary/5 hover:border-primary"
                    onClick={() => {
                      setSelectedExpert({
                        name: "Dr. Sarah Johnson",
                        specialty: "Oncology Specialist",
                        bio: "Dr. Johnson has over 15 years of experience in cancer research and treatment, with a particular focus on immunotherapy trials. She has led multiple groundbreaking studies in melanoma and lung cancer treatment.",
                        education: "MD from Johns Hopkins School of Medicine, Oncology Fellowship at Memorial Sloan Kettering",
                        publications: "15+ peer-reviewed publications in top oncology journals",
                        institution: "Johns Hopkins Hospital",
                        contact: "sjohnson@jhmi.edu"
                      });
                    }}
                  >
                    Connect
                  </Button>
                </div>
              </Card>

              {/* Expert 2 */}
              <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-8 h-8 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Dr. Michael Chen</h3>
                      <p className="text-sm text-muted-foreground">Cardiology Research</p>
                      <Badge className="bg-accent/10 text-accent mt-2">92% Match</Badge>
                    </div>
                  </div>
                  <p className="text-sm">Leading cardiovascular clinical trials. Expert in heart disease prevention.</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">Cleveland Clinic</Badge>
                    <Badge variant="secondary" className="text-xs">20 Publications</Badge>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full hover:bg-accent/5 hover:border-accent"
                    onClick={() => {
                      setSelectedExpert({
                        name: "Dr. Michael Chen",
                        specialty: "Cardiology Research",
                        bio: "Dr. Chen is a leading researcher in cardiovascular disease prevention and treatment. He currently leads several major clinical trials investigating novel approaches to heart failure.",
                        education: "MD/PhD from Harvard Medical School, Cardiology Fellowship at Cleveland Clinic",
                        publications: "20+ publications in cardiovascular journals",
                        institution: "Cleveland Clinic",
                        contact: "mchen@ccf.org"
                      });
                    }}
                  >
                    Connect
                  </Button>
                </div>
              </Card>

              {/* Expert 3 */}
              <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Dr. Emily Rodriguez</h3>
                      <p className="text-sm text-muted-foreground">Neurology Expert</p>
                      <Badge className="bg-primary/10 text-primary mt-2">88% Match</Badge>
                    </div>
                  </div>
                  <p className="text-sm">Alzheimer's and dementia research. 20+ years clinical trial experience.</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">Stanford</Badge>
                    <Badge variant="secondary" className="text-xs">25 Publications</Badge>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full hover:bg-primary/5 hover:border-primary"
                    onClick={() => {
                      setSelectedExpert({
                        name: "Dr. Emily Rodriguez",
                        specialty: "Neurology Expert",
                        bio: "With over 20 years of experience in neurological research, Dr. Rodriguez specializes in Alzheimer's disease and other forms of dementia.",
                        education: "MD from Stanford School of Medicine, Neurology Fellowship at UCSF",
                        publications: "25+ publications in neurology journals",
                        institution: "Stanford Medical Center",
                        contact: "erodriguez@stanford.edu"
                      });
                    }}
                  >
                    Connect
                  </Button>
                </div>
              </Card>

              {/* More experts */}
              <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-8 h-8 text-accent" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Dr. James Wilson</h3>
                      <p className="text-sm text-muted-foreground">Diabetes Specialist</p>
                      <Badge className="bg-accent/10 text-accent mt-2">90% Match</Badge>
                    </div>
                  </div>
                  <p className="text-sm">Type 1 & 2 diabetes management. Focus on innovative insulin therapies.</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">Mayo Clinic</Badge>
                    <Badge variant="secondary" className="text-xs">18 Publications</Badge>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full hover:bg-accent/5 hover:border-accent"
                    onClick={() => handleConnect("Dr. James Wilson")}
                  >
                    Connect
                  </Button>
                </div>
              </Card>

              <Card className="p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Users className="w-8 h-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">Dr. Lisa Park</h3>
                      <p className="text-sm text-muted-foreground">Respiratory Medicine</p>
                      <Badge className="bg-primary/10 text-primary mt-2">87% Match</Badge>
                    </div>
                  </div>
                  <p className="text-sm">COPD and asthma clinical trials. Expert in pulmonary rehabilitation.</p>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">Mass General</Badge>
                    <Badge variant="secondary" className="text-xs">22 Publications</Badge>
                  </div>
                  <Button 
                    variant="outline"
                    className="w-full hover:bg-primary/5 hover:border-primary"
                    onClick={() => handleConnect("Dr. Lisa Park")}
                  >
                    Connect
                  </Button>
                </div>
              </Card>
            </div>
          </TabsContent>

          {/* Forum Tab */}
          <TabsContent value="forum" className="space-y-6">
            <Card className="p-6 shadow-[var(--shadow-soft)]">
              <h2 className="text-2xl font-bold mb-4">Community Forum</h2>
              <p className="text-muted-foreground mb-6">
                Ask questions, share experiences, and connect with others in the community
              </p>
              
              <div className="space-y-4 mb-6">
                <Textarea 
                  placeholder="Ask a question or share your thoughts..."
                  value={forumPost}
                  onChange={(e) => setForumPost(e.target.value)}
                  rows={4}
                />
                <Button onClick={handleForumPost} className="w-full bg-primary hover:bg-primary/90">
                  <Send className="w-4 h-4 mr-2" />
                  Post to Forum
                </Button>
              </div>

              <div className="space-y-4">
                <div className="border-t pt-4">
                  <h3 className="font-semibold mb-4">Recent Discussions</h3>
                  
                  {/* Forum Post 1 */}
                  <Card 
                    className="p-4 mb-3 hover:shadow-[var(--shadow-hover)] transition-all cursor-pointer"
                    onClick={() => setSelectedForum({
                      title: "Question about Glioblastoma treatment options",
                      author: "John D.",
                      category: "Brain Cancer",
                      date: "2 hours ago",
                      content: "I've been recently diagnosed with glioblastoma and I'm exploring treatment options. Has anyone here participated in immunotherapy trials for this condition? I'd love to hear about your experiences.",
                      replies: 12
                    })}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold">Question about Glioblastoma treatment options</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Posted by John D. • 2 hours ago
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">Brain Cancer</Badge>
                          <Badge variant="outline" className="text-xs">12 replies</Badge>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Forum Post 2 */}
                  <Card 
                    className="p-4 mb-3 hover:shadow-[var(--shadow-hover)] transition-all cursor-pointer"
                    onClick={() => setSelectedForum({
                      title: "Experience with Alzheimer's prevention studies",
                      author: "Sarah M.",
                      category: "Neurology",
                      date: "5 hours ago",
                      content: "I'm considering enrolling in an Alzheimer's prevention trial. For those who have participated, what should I expect in terms of time commitment and testing?",
                      replies: 8
                    })}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-5 h-5 text-accent" />
                          <h4 className="font-semibold">Experience with Alzheimer's prevention studies</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Posted by Sarah M. • 5 hours ago
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">Neurology</Badge>
                          <Badge variant="outline" className="text-xs">8 replies</Badge>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* Forum Post 3 */}
                  <Card 
                    className="p-4 hover:shadow-[var(--shadow-hover)] transition-all cursor-pointer"
                    onClick={() => setSelectedForum({
                      title: "Diet recommendations for Type 2 Diabetes",
                      author: "Mike R.",
                      category: "Diabetes",
                      date: "1 day ago",
                      content: "I was recently diagnosed with Type 2 diabetes. Looking for practical diet recommendations that have worked for others. Also interested in clinical trials for new diabetes treatments.",
                      replies: 15
                    })}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="w-5 h-5 text-primary" />
                          <h4 className="font-semibold">Diet recommendations for Type 2 Diabetes</h4>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          Posted by Mike R. • 1 day ago
                        </p>
                        <div className="flex gap-2">
                          <Badge variant="secondary" className="text-xs">Diabetes</Badge>
                          <Badge variant="outline" className="text-xs">15 replies</Badge>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Trial Details Dialog */}
      <Dialog open={!!selectedTrial} onOpenChange={() => setSelectedTrial(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedTrial?.title}</DialogTitle>
            <DialogDescription>{selectedTrial?.description}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {selectedTrial?.matchScore && (
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 text-primary" />
                <Badge className="bg-primary/10 text-primary">{selectedTrial.matchScore} Match</Badge>
              </div>
            )}
            
            <div>
              <h3 className="font-semibold mb-2">About This Trial</h3>
              <p className="text-sm text-muted-foreground">{selectedTrial?.fullDescription}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Eligibility Criteria</h3>
              <p className="text-sm text-muted-foreground">{selectedTrial?.eligibility}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Location & Duration</h3>
              <div className="flex items-center gap-2 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span>{selectedTrial?.location}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Duration: {selectedTrial?.duration}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Contact Information</h3>
              <p className="text-sm text-muted-foreground">{selectedTrial?.contact}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedTrial(null)}>
              Close
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                handleApplyTrial(selectedTrial?.title);
                setSelectedTrial(null);
              }}
            >
              Apply to Trial
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Expert Details Dialog */}
      <Dialog open={!!selectedExpert} onOpenChange={() => setSelectedExpert(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedExpert?.name}</DialogTitle>
            <DialogDescription>{selectedExpert?.specialty}</DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">About</h3>
              <p className="text-sm text-muted-foreground">{selectedExpert?.bio}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Education & Training</h3>
              <p className="text-sm text-muted-foreground">{selectedExpert?.education}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Publications</h3>
              <p className="text-sm text-muted-foreground">{selectedExpert?.publications}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Institution</h3>
              <p className="text-sm text-muted-foreground">{selectedExpert?.institution}</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Contact</h3>
              <p className="text-sm text-muted-foreground">{selectedExpert?.contact}</p>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedExpert(null)}>
              Close
            </Button>
            <Button 
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                handleConnect(selectedExpert?.name);
                setSelectedExpert(null);
              }}
            >
              Send Connection Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Forum Post Dialog */}
      <Dialog open={!!selectedForum} onOpenChange={() => setSelectedForum(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedForum?.title}</DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">{selectedForum?.category}</Badge>
              <span className="text-sm text-muted-foreground">
                Posted by {selectedForum?.author} • {selectedForum?.date}
              </span>
            </div>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm">{selectedForum?.content}</p>
            
            <div className="border-t pt-4">
              <h3 className="font-semibold mb-3">{selectedForum?.replies} Replies</h3>
              <div className="space-y-3">
                <Card className="p-4 bg-secondary/30">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium">Dr. Sarah Johnson</p>
                      <p className="text-xs text-muted-foreground mb-2">Oncology Specialist</p>
                      <p className="text-sm">I'd be happy to discuss this with you. Feel free to reach out through the platform's messaging system.</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
            
            <div>
              <Textarea placeholder="Write your reply..." rows={3} />
              <Button className="mt-2 w-full bg-primary hover:bg-primary/90">
                <Send className="w-4 h-4 mr-2" />
                Post Reply
              </Button>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedForum(null)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
