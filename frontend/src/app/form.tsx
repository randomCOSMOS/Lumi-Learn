"use client";

import { FormEvent, useState, useRef, useEffect } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  ArrowRight, 
  Mic, 
  Image, 
  FileText
} from "lucide-react";

export default function EnhancedInputForm({ onDataReceived }) {
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [activeMode, setActiveMode] = useState("text"); // Default mode: text, tts, image, plan
  const [highlightStyle, setHighlightStyle] = useState({});
  const buttonsRef = useRef<HTMLDivElement>(null);

  const handleQuestion = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api", {
        question: question,
        mode: activeMode // Send the active mode with the request
      });
      
      // Pass the response back to the parent component
      onDataReceived(res.data.response);
      
    } catch (error) {
      console.error("Error submitting question:", error);
      onDataReceived("Sorry, we couldn't process your question right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const modes = [
    { id: "text", icon: <Search className="h-5 w-5" />, label: "Text" },
    { id: "tts", icon: <Mic className="h-5 w-5" />, label: "TTS" },
    { id: "image", icon: <Image className="h-5 w-5" />, label: "Image" },
    { id: "plan", icon: <FileText className="h-5 w-5" />, label: "Plan" }
  ];

  // Function to update the highlight position
  const updateHighlightPosition = () => {
    if (!buttonsRef.current) return;
    
    const buttons = buttonsRef.current.querySelectorAll('button');
    const activeButton = Array.from(buttons).find(button => 
      button.getAttribute('data-mode') === activeMode
    );
    
    if (activeButton) {
      const buttonRect = activeButton.getBoundingClientRect();
      const containerRect = buttonsRef.current.getBoundingClientRect();
      
      setHighlightStyle({
        left: `${activeButton.offsetLeft}px`,
        width: `${buttonRect.width}px`,
        height: `${buttonRect.height}px`,
        opacity: 1
      });
    }
  };

  // Update highlight position on mode change
  useEffect(() => {
    updateHighlightPosition();
  }, [activeMode]);

  // Update highlight position on window resize
  useEffect(() => {
    window.addEventListener('resize', updateHighlightPosition);
    return () => {
      window.removeEventListener('resize', updateHighlightPosition);
    };
  }, []);

  return (
    <Card className="shadow-sm border border-gray-200 dark:border-gray-700 rounded-xl">
      <CardContent className="p-6">
        <form onSubmit={handleQuestion} className="flex flex-col gap-4">
          <div className="relative flex items-center">
            <div className="absolute left-4 text-gray-400">
              {activeMode === "tts" ? (
                <Mic className="h-5 w-5" />
              ) : activeMode === "image" ? (
                <Image className="h-5 w-5" />
              ) : activeMode === "plan" ? (
                <FileText className="h-5 w-5" />
              ) : (
                <Search className="h-5 w-5" />
              )}
            </div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={activeMode === "tts" ? "Enter text to convert to speech..." : "Ask your question..."}
              className="flex-grow w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-1 focus:ring-gray-200 focus:border-gray-300 placeholder-gray-400 dark:placeholder-gray-500 min-h-[120px] resize-none"
              aria-label="Enter text"
            />
          </div>
          
          <div className="flex justify-between items-center">
            <div className="relative flex space-x-2" ref={buttonsRef}>
              {/* Sliding highlight */}
              <div 
                className="absolute bg-gray-300 dark:bg-gray-600 rounded-md transition-all duration-300 ease-in-out z-0"
                style={highlightStyle}
              />
              
              {modes.map((mode) => (
                <button
                  key={mode.id}
                  data-mode={mode.id}
                  type="button"
                  onClick={() => setActiveMode(mode.id)}
                  className={`p-2 rounded-md transition-colors duration-300 z-10 relative ${
                    mode.id === activeMode 
                      ? "text-gray-800 dark:text-white" 
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
                  }`}
                  title={mode.label}
                  aria-label={`Switch to ${mode.label} mode`}
                >
                  {mode.icon}
                </button>
              ))}
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-2 px-4 rounded-lg"
              aria-label="Submit"
            >
              {loading ? (
                <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-20 border-t-white rounded-full"></div>
              ) : (
                <>
                  <span>
                    {activeMode === "tts" ? "Convert to Speech" : 
                     activeMode === "image" ? "Generate Image" : 
                     activeMode === "plan" ? "Create Plan" : "Get Answers"}
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}