import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Activity, Users, FileText, Microscope } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--gradient-hero)] opacity-10" />
        <div className="container mx-auto px-4 py-20 relative">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="inline-block">
              <div className="flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full">
                <Activity className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">AI-Powered Healthcare Platform</span>
              </div>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                CuraLink
              </span>
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with clinical trials, medical publications, and health experts through our intelligent platform
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
              <Button
                size="lg"
                onClick={() => navigate("/auth?type=patient")}
                className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all"
              >
                <Users className="w-5 h-5 mr-2" />
                I am a Patient or Caregiver
              </Button>
              
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate("/auth?type=researcher")}
                className="text-lg px-8 py-6 border-2 hover:bg-secondary/50 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all"
              >
                <Microscope className="w-5 h-5 mr-2" />
                I am a Researcher
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-20">
            <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Clinical Trials</h3>
              <p className="text-sm text-muted-foreground">
                Discover relevant clinical trials tailored to your medical conditions
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Expert Network</h3>
              <p className="text-sm text-muted-foreground">
                Connect with healthcare professionals and researchers worldwide
              </p>
            </div>

            <div className="bg-card rounded-2xl p-6 shadow-[var(--shadow-soft)] hover:shadow-[var(--shadow-hover)] transition-all">
              <div className="w-12 h-12 bg-secondary/50 rounded-xl flex items-center justify-center mb-4">
                <Microscope className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Research Papers</h3>
              <p className="text-sm text-muted-foreground">
                Access the latest medical publications and research findings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
