import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface CupidTutorialProps {
  steps: string[];
  onComplete?: () => void;
  onClose?: () => void;
}

export const CupidTutorial = ({ steps, onComplete, onClose }: CupidTutorialProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (currentStep >= steps.length) {
      onComplete?.();
      return;
    }

    const text = steps[currentStep];
    let index = 0;
    setDisplayedText("");
    setIsTyping(true);

    const typingInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayedText((prev) => prev + text[index]);
        index++;
      } else {
        setIsTyping(false);
        clearInterval(typingInterval);
      }
    }, 30);

    return () => clearInterval(typingInterval);
  }, [currentStep, steps, onComplete]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-2xl w-full p-6 relative border-2 border-primary/30 shadow-2xl">
        {onClose && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="absolute top-3 right-3"
          >
            <X className="w-4 h-4" />
          </Button>
        )}

        <div className="flex items-start gap-4">
          {/* Cupid Character */}
          <div className="flex-shrink-0">
            <img
              src="/cupid-tlc-transparent.png"
              alt="Cupid"
              className="w-20 h-20 object-contain animate-bounce-slow"
            />
          </div>

          {/* Chat Bubble */}
          <div className="flex-1">
            <div className="bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-950 dark:to-purple-950 rounded-2xl rounded-tl-none p-5 relative">
              <div className="absolute -left-2 top-0 w-4 h-4 bg-gradient-to-br from-pink-100 dark:from-pink-950" 
                   style={{ clipPath: "polygon(0 0, 100% 0, 0 100%)" }} />
              
              <p className="text-foreground leading-relaxed">
                {displayedText}
                {isTyping && <span className="inline-block w-1 h-4 bg-foreground ml-1 animate-pulse" />}
              </p>
            </div>

            {/* Progress & Actions */}
            <div className="flex items-center justify-between mt-4">
              <div className="flex gap-1">
                {steps.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index <= currentStep ? "bg-primary" : "bg-muted"
                    }`}
                  />
                ))}
              </div>

              {!isTyping && (
                <Button onClick={handleNext} size="sm">
                  {currentStep < steps.length - 1 ? "Next" : "Got it!"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};