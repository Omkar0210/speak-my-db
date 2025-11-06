import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, X, Phone, PhoneOff } from "lucide-react";
import Vapi from "@vapi-ai/web";

const VAPI_API_KEY = "8c91c3b0-bdef-4ceb-aec7-77f6653e8185";
const ASSISTANT_ID = "350e5c66-88a2-493d-9958-a2b955ad94de";

const VapiAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [vapi, setVapi] = useState<Vapi | null>(null);

  useEffect(() => {
    const vapiInstance = new Vapi(VAPI_API_KEY);
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      setIsCallActive(true);
    });

    vapiInstance.on("call-end", () => {
      setIsCallActive(false);
    });

    return () => {
      vapiInstance.stop();
    };
  }, []);

  const startCall = async () => {
    if (vapi && !isCallActive) {
      try {
        await vapi.start(ASSISTANT_ID);
      } catch (error) {
        console.error("Error starting call:", error);
      }
    }
  };

  const endCall = () => {
    if (vapi && isCallActive) {
      vapi.stop();
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 rounded-full shadow-[var(--shadow-elegant)] bg-primary hover:bg-primary/90 z-50 animate-pulse"
        >
          <Mic className="w-6 h-6" />
        </Button>
      )}

      {/* Popup Card */}
      {isOpen && (
        <Card className="fixed bottom-6 right-6 w-80 p-6 shadow-[var(--shadow-elegant)] z-50 border-primary/20">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold">Talk with AI Assistant</h3>
              <p className="text-sm text-muted-foreground">Omkar</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsOpen(false)}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex flex-col items-center gap-4">
            {!isCallActive ? (
              <>
                <Button
                  onClick={startCall}
                  size="lg"
                  className="w-20 h-20 rounded-full bg-primary hover:bg-primary/90"
                >
                  <Phone className="w-8 h-8" />
                </Button>
                <p className="text-sm text-center text-muted-foreground">
                  Click to start talking with Omkar
                </p>
              </>
            ) : (
              <>
                <div className="relative">
                  <Button
                    onClick={endCall}
                    size="lg"
                    className="w-20 h-20 rounded-full bg-destructive hover:bg-destructive/90 animate-pulse"
                  >
                    <PhoneOff className="w-8 h-8" />
                  </Button>
                  <div className="absolute -inset-2 bg-destructive/20 rounded-full animate-ping" />
                </div>
                <p className="text-sm text-center font-medium text-primary">
                  Call in progress...
                </p>
                <p className="text-xs text-center text-muted-foreground">
                  Click to end call
                </p>
              </>
            )}
          </div>
        </Card>
      )}
    </>
  );
};

export default VapiAssistant;
