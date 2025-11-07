import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTrial, setSelectedTrial] = useState<any>(null);
  const [selectedExpert, setSelectedExpert] = useState<any>(null);

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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
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
                    <p className="text-2xl font-bold">8</p>
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
                    <p className="text-2xl font-bold">3</p>
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
                  className="justify-start h-auto py-4"
                  onClick={() => setActiveTab("trials")}
                >
                  <FileText className="w-5 h-5 mr-3" />
                  <div className="text-left">
                    <p className="font-medium">Find Clinical Trials</p>
                    <p className="text-xs text-muted-foreground">Discover trials matching your conditions</p>
                  </div>
                </Button>
                <Button 
                  variant="outline" 
                  className="justify-start h-auto py-4"
                  onClick={() => setActiveTab("experts")}
                >
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
                    <Button 
                      size="sm"
                      onClick={() => setSelectedTrial({
                        title: "Phase III Cancer Immunotherapy Trial",
                        description: "Testing new immunotherapy approach for advanced melanoma patients",
                        fullDescription: "This groundbreaking Phase III clinical trial is investigating a novel immunotherapy treatment for patients with advanced melanoma. The study aims to evaluate the efficacy and safety of combining two immunotherapy agents to enhance the body's immune response against cancer cells. Participants will receive the experimental treatment over 24 months with regular monitoring and follow-up assessments.",
                        eligibility: "Adults 18-75 years with stage III or IV melanoma, ECOG performance status 0-1, adequate organ function",
                        contact: "Dr. Sarah Johnson - sjohnson@jhmi.edu - (410) 955-5000",
                        location: "Johns Hopkins Hospital, Baltimore, MD",
                        duration: "24 months",
                        category: "Oncology",
                        phase: "Phase III"
                      })}
                    >
                      Learn More
                    </Button>
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
                    <Button 
                      size="sm"
                      onClick={() => setSelectedTrial({
                        title: "Type 2 Diabetes Management Study",
                        description: "Novel oral medication for blood sugar control in diabetic patients",
                        fullDescription: "This Phase II study evaluates a new once-daily oral medication designed to improve blood sugar control in adults with Type 2 diabetes. The medication works through a unique mechanism targeting both insulin sensitivity and glucose production. Participants will be closely monitored for efficacy and safety throughout the 18-month study period.",
                        eligibility: "Adults 21+ years with Type 2 diabetes for at least 1 year, HbA1c 7.5-11%, BMI 25-40",
                        contact: "Dr. James Wilson - jwilson@mayo.edu - (507) 284-2511",
                        location: "Mayo Clinic, Rochester, MN",
                        duration: "18 months",
                        category: "Endocrinology",
                        phase: "Phase II"
                      })}
                    >
                      Learn More
                    </Button>
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
                    <Button 
                      size="sm"
                      onClick={() => setSelectedTrial({
                        title: "Alzheimer's Prevention Trial",
                        description: "Early intervention study for individuals at risk of cognitive decline",
                        fullDescription: "This Phase III prevention trial investigates whether early intervention with a novel therapeutic approach can delay or prevent the onset of Alzheimer's disease in individuals at high risk. The study includes comprehensive cognitive assessments, biomarker monitoring, and lifestyle interventions over a 36-month period.",
                        eligibility: "Adults 60-75 years with family history of Alzheimer's or genetic risk factors, normal cognition or mild cognitive impairment, willing to undergo regular cognitive testing and brain imaging",
                        contact: "Dr. Emily Rodriguez - erodriguez@stanford.edu - (650) 723-2300",
                        location: "Stanford Medical Center, Stanford, CA",
                        duration: "36 months",
                        category: "Neurology",
                        phase: "Phase III"
                      })}
                    >
                      Learn More
                    </Button>
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
                    <Button 
                      size="sm"
                      onClick={() => setSelectedTrial({
                        title: "Heart Failure Treatment Study",
                        description: "Evaluating new treatment for chronic heart failure patients",
                        fullDescription: "This Phase III trial evaluates an innovative treatment approach for patients with chronic heart failure with reduced ejection fraction. The study compares the new therapy against standard treatment, measuring improvements in cardiac function, quality of life, and hospitalization rates over 24 months.",
                        eligibility: "Adults 40+ years with chronic heart failure (NYHA Class II-III), ejection fraction ≤40%, on stable heart failure medications for at least 3 months",
                        contact: "Dr. Michael Chen - mchen@ccf.org - (216) 444-2200",
                        location: "Cleveland Clinic, Cleveland, OH",
                        duration: "24 months",
                        category: "Cardiology",
                        phase: "Phase III"
                      })}
                    >
                      Learn More
                    </Button>
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
                    <Button 
                      size="sm"
                      onClick={() => setSelectedTrial({
                        title: "Asthma Control Innovation Trial",
                        description: "New inhaler technology for severe asthma management",
                        fullDescription: "This Phase II study investigates a novel inhaler device with smart technology that helps patients better manage severe asthma. The device provides real-time feedback on inhalation technique and medication adherence while delivering a new formulation designed to reduce severe asthma exacerbations.",
                        eligibility: "Adults 18-65 years with severe persistent asthma, history of ≥2 exacerbations in past year requiring oral corticosteroids, currently on high-dose inhaled corticosteroids",
                        contact: "Dr. Lisa Park - lpark@mgh.harvard.edu - (617) 726-2000",
                        location: "Mass General Hospital, Boston, MA",
                        duration: "12 months",
                        category: "Respiratory",
                        phase: "Phase II"
                      })}
                    >
                      Learn More
                    </Button>
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => {
                          setSelectedExpert({
                            name: "Dr. Sarah Johnson",
                            specialty: "Oncology Specialist",
                            bio: "Dr. Johnson has over 15 years of experience in cancer research and treatment, with a particular focus on immunotherapy trials. She has led multiple groundbreaking studies in melanoma and lung cancer treatment.",
                            education: "MD from Johns Hopkins School of Medicine, Oncology Fellowship at Memorial Sloan Kettering",
                            contact: "sjohnson@jhmi.edu"
                          });
                        }}
                      >
                        Connect
                      </Button>
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => {
                          setSelectedExpert({
                            name: "Dr. Michael Chen",
                            specialty: "Cardiology Research",
                            bio: "Dr. Chen is a leading researcher in cardiovascular disease prevention and treatment. He currently leads several major clinical trials investigating novel approaches to heart failure and coronary artery disease.",
                            education: "MD/PhD from Harvard Medical School, Cardiology Fellowship at Cleveland Clinic",
                            contact: "mchen@ccf.org"
                          });
                        }}
                      >
                        Connect
                      </Button>
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => {
                          setSelectedExpert({
                            name: "Dr. Emily Rodriguez",
                            specialty: "Neurology Expert",
                            bio: "With over 20 years of experience in neurological research, Dr. Rodriguez specializes in Alzheimer's disease and other forms of dementia. She has been principal investigator on numerous NIH-funded studies.",
                            education: "MD from Stanford School of Medicine, Neurology Residency and Fellowship at UCSF",
                            contact: "erodriguez@stanford.edu"
                          });
                        }}
                      >
                        Connect
                      </Button>
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => {
                          setSelectedExpert({
                            name: "Dr. James Wilson",
                            specialty: "Diabetes Specialist",
                            bio: "Dr. Wilson is an endocrinologist specializing in diabetes management and innovative insulin delivery systems. He has extensive experience with continuous glucose monitoring and insulin pump therapy trials.",
                            education: "MD from Mayo Medical School, Endocrinology Fellowship at Joslin Diabetes Center",
                            contact: "jwilson@mayo.edu"
                          });
                        }}
                      >
                        Connect
                      </Button>
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => {
                          setSelectedExpert({
                            name: "Dr. Lisa Park",
                            specialty: "Respiratory Medicine",
                            bio: "Dr. Park specializes in chronic respiratory diseases including COPD and severe asthma. She leads multiple clinical trials investigating new inhalation therapies and pulmonary rehabilitation techniques.",
                            education: "MD from University of Michigan, Pulmonary Fellowship at Mass General Hospital",
                            contact: "lpark@mgh.harvard.edu"
                          });
                        }}
                      >
                        Connect
                      </Button>
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => {
                          setSelectedExpert({
                            name: "Dr. Robert Kumar",
                            specialty: "Immunology Research",
                            bio: "Dr. Kumar is a renowned immunologist focusing on autoimmune diseases and vaccine development. He has published extensively on rheumatoid arthritis, lupus, and novel immunotherapy approaches.",
                            education: "MD/PhD from Yale School of Medicine, Immunology Fellowship at NIH",
                            contact: "rkumar@nih.gov"
                          });
                        }}
                      >
                        Connect
                      </Button>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Trial Details Dialog */}
      <Dialog open={!!selectedTrial} onOpenChange={() => setSelectedTrial(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedTrial?.title}</DialogTitle>
            <DialogDescription>{selectedTrial?.description}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-semibold mb-2">About This Trial</h4>
              <p className="text-sm text-muted-foreground">{selectedTrial?.fullDescription}</p>
            </div>
            <div className="flex gap-2">
              <span className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full">{selectedTrial?.category}</span>
              <span className="text-xs bg-accent/10 text-accent px-3 py-1 rounded-full">{selectedTrial?.phase}</span>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Eligibility Criteria</h4>
              <p className="text-sm text-muted-foreground">{selectedTrial?.eligibility}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Study Details</h4>
              <p className="text-sm"><strong>Location:</strong> {selectedTrial?.location}</p>
              <p className="text-sm"><strong>Duration:</strong> {selectedTrial?.duration}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Contact Information</h4>
              <p className="text-sm text-muted-foreground">{selectedTrial?.contact}</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  toast({
                    title: "Interest Recorded",
                    description: "We'll contact you with more information about this trial.",
                  });
                  setSelectedTrial(null);
                }}
              >
                Express Interest
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Saved to Favorites",
                    description: "This trial has been added to your saved items.",
                  });
                  setSelectedTrial(null);
                }}
              >
                Save for Later
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Expert Details Dialog */}
      <Dialog open={!!selectedExpert} onOpenChange={() => setSelectedExpert(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedExpert?.name}</DialogTitle>
            <DialogDescription>{selectedExpert?.specialty}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <h4 className="font-semibold mb-2">About</h4>
              <p className="text-sm text-muted-foreground">{selectedExpert?.bio}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Education & Training</h4>
              <p className="text-sm text-muted-foreground">{selectedExpert?.education}</p>
            </div>
            <div>
              <h4 className="font-semibold mb-2">Contact</h4>
              <p className="text-sm text-muted-foreground">{selectedExpert?.contact}</p>
            </div>
            <div className="flex gap-3">
              <Button 
                onClick={() => {
                  toast({
                    title: "Connection Request Sent",
                    description: `Your request to connect with ${selectedExpert?.name} has been sent.`,
                  });
                  setSelectedExpert(null);
                }}
              >
                Send Connection Request
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Message Sent",
                    description: "Your message has been delivered.",
                  });
                  setSelectedExpert(null);
                }}
              >
                Send Message
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
