import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const VoiceAgent = () => {
  const { toast } = useToast();
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    // Initialize Web Speech API
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = async (event: any) => {
        const text = event.results[0][0].transcript;
        setTranscript(text);
        await handleVoiceInput(text);
      };

      recognitionRef.current.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        toast({
          variant: "destructive",
          title: "Voice Error",
          description: "Could not process voice input. Please try again.",
        });
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    synthRef.current = window.speechSynthesis;

    return () => {
      if (synthRef.current) {
        synthRef.current.cancel();
      }
    };
  }, []);

  const handleVoiceInput = async (text: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('chat-agent', {
        body: { message: text, useVoice: true }
      });

      if (error) throw error;

      if (data?.response) {
        speakResponse(data.response);
      }
    } catch (error: any) {
      console.error('Error processing voice input:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your request. Please try again.",
      });
    }
  };

  const speakResponse = (text: string) => {
    if (synthRef.current) {
      synthRef.current.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      synthRef.current.speak(utterance);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      setTranscript("");
      recognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const stopSpeaking = () => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <Card className="p-6 shadow-[var(--shadow-soft)]">
      <div className="text-center space-y-6">
        <div className="flex items-center justify-center gap-2 mb-4">
          {isSpeaking ? (
            <Volume2 className="w-5 h-5 text-accent animate-pulse" />
          ) : (
            <VolumeX className="w-5 h-5 text-muted-foreground" />
          )}
          <h3 className="text-lg font-semibold">Voice Assistant</h3>
        </div>

        <div className="relative">
          <Button
            onClick={toggleListening}
            size="lg"
            className={`w-20 h-20 rounded-full ${
              isListening 
                ? 'bg-destructive hover:bg-destructive/90 animate-pulse' 
                : 'bg-primary hover:bg-primary/90'
            }`}
          >
            {isListening ? (
              <MicOff className="w-8 h-8" />
            ) : (
              <Mic className="w-8 h-8" />
            )}
          </Button>
        </div>

        <p className="text-sm text-muted-foreground">
          {isListening ? 'Listening...' : 'Click the microphone to start'}
        </p>

        {transcript && (
          <div className="mt-4 p-4 bg-secondary rounded-lg">
            <p className="text-sm text-secondary-foreground">
              You said: <span className="font-medium">"{transcript}"</span>
            </p>
          </div>
        )}

        {isSpeaking && (
          <Button
            onClick={stopSpeaking}
            variant="outline"
            size="sm"
          >
            Stop Speaking
          </Button>
        )}
      </div>
    </Card>
  );
};

export default VoiceAgent;
