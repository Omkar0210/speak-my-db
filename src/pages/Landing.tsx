import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Microscope, Heart } from "lucide-react";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Steps */}
        <div className="flex justify-center items-center gap-4 mb-12">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary text-primary-foreground font-bold shadow-[var(--shadow-soft)]">
            1
          </div>
          <div className="w-16 h-1 bg-muted"></div>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground font-bold">
            2
          </div>
          <div className="w-16 h-1 bg-muted"></div>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground font-bold">
            3
          </div>
          <div className="w-16 h-1 bg-muted"></div>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-muted text-muted-foreground font-bold">
            4
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-card rounded-3xl p-8 md:p-12 shadow-[var(--shadow-hover)] border border-border/50">
          <div className="text-center mb-8">
            <p className="text-sm text-muted-foreground mb-2">Pin 5 is in your main screen</p>
            <p className="text-xs text-muted-foreground mb-6">Step 1 of 4: Account Type</p>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Welcome to{" "}
              <span className="bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                colLABiora!
              </span>
            </h1>
            
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Let's get started. First, tell us about yourself.
            </p>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-center mb-6">I am a...</h2>
            
            <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
              {/* Researcher Card */}
              <button
                onClick={() => navigate("/auth?type=researcher")}
                className="group relative bg-card border-2 border-primary/20 hover:border-primary rounded-2xl p-8 transition-all hover:shadow-[var(--shadow-hover)] hover:scale-105 focus:outline-none focus:ring-4 focus:ring-primary/30"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Microscope className="w-12 h-12 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Researcher</h3>
                    <p className="text-sm text-muted-foreground">
                      Medical researcher, scientist, or healthcare professional looking to collaborate and share research
                    </p>
                  </div>
                </div>
              </button>

              {/* Patient/Caregiver Card */}
              <button
                onClick={() => navigate("/auth?type=patient")}
                className="group relative bg-card border-2 border-accent/20 hover:border-accent rounded-2xl p-8 transition-all hover:shadow-[var(--shadow-hover)] hover:scale-105 focus:outline-none focus:ring-4 focus:ring-accent/30"
              >
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 bg-accent/10 rounded-2xl flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <Heart className="w-12 h-12 text-accent" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Patient/Caregiver</h3>
                    <p className="text-sm text-muted-foreground">
                      Individual seeking medical information, clinical trials, and connections with researchers
                    </p>
                  </div>
                </div>
              </button>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              size="lg"
              className="px-12 py-6 text-lg bg-primary hover:bg-primary/90 shadow-[var(--shadow-soft)]"
              onClick={() => navigate("/auth?type=patient")}
            >
              Continue
            </Button>
          </div>
        </div>

        {/* Footer Text */}
        <p className="text-center text-sm text-muted-foreground mt-8">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default Landing;
