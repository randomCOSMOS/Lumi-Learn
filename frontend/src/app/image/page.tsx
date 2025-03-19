"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  Lightbulb, 
  ArrowRight, 
  Mic, 
  Image as ImageIcon, 
  FileText,
  Menu,
  X,
  Download
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import "../globals.css";

export default function ImageGenerationPage() {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleImageGeneration = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setImageUrl(null);
    
    try {
      const res = await axios.post("http://localhost:5000/image", {
        prompt: prompt,
      });
      
      // Assuming the response contains an image URL or base64 data
      if (res.data && res.data.imageUrl) {
        setImageUrl(res.data.imageUrl);
      } else if (res.data && res.data.base64Image) {
        // If the response includes base64 data
        setImageUrl(`data:image/png;base64,${res.data.base64Image}`);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error generating image:", error);
      setError("Sorry, we couldn't generate your image right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!imageUrl) return;
    
    // Create a temporary anchor element
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = `generated-image-${Date.now()}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const sidebarLinks = [
    { path: "/", label: "Ask Questions", icon: <Search className="h-5 w-5" /> },
    { path: "/tts", label: "Text to Speech", icon: <Mic className="h-5 w-5" /> },
    { path: "/image", label: "Image Generation", icon: <ImageIcon className="h-5 w-5" /> },
    { path: "/plan", label: "Plan Generation", icon: <FileText className="h-5 w-5" /> },
  ];

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100">
      {/* Mobile sidebar toggle */}
      <button 
        onClick={toggleSidebar} 
        className="md:hidden fixed z-20 top-4 left-4 p-2 rounded-md bg-gray-100 dark:bg-gray-800"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-10 bg-black bg-opacity-30"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed md:static z-10 w-64 transition-transform duration-300 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        } h-full bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700`}
      >
        <div className="p-3 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <Lightbulb className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          <h1 className="ml-2 text-xl font-semibold">LumiLearn</h1>
        </div>
        <nav className="p-4">
          <ul className="space-y-2">
            {sidebarLinks.map((link) => (
              <li key={link.path}>
                <Link 
                  href={link.path}
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    pathname === link.path 
                      ? "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-100" 
                      : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="mr-3">{link.icon}</span>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <header className="border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex items-center justify-end">
            <div className="flex items-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">Accessible and Inclusive Learning</span>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8 w-full">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-semibold mb-2">Image Generation</h2>
            <p className="text-gray-600 dark:text-gray-300">Create images from text descriptions.</p>
          </div>

          <div className="mb-8">
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <form onSubmit={handleImageGeneration} className="flex flex-col gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <ImageIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Describe the image you want to generate..."
                      className="block w-full pl-10 pr-4 py-3 min-h-32 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500"
                      aria-label="Image description"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full md:w-auto md:ml-auto bg-gray-800 hover:bg-gray-700 focus:ring-gray-500 text-white py-2 px-4 rounded-md"
                    aria-label="Generate image"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-20 border-t-white rounded-full"></div>
                        <span>Generating...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate Image</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {(imageUrl || error) && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  {error ? (
                    <div className="text-red-500 dark:text-red-400">
                      {error}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <div className="relative w-full max-w-md h-64 md:h-96 my-4 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
                        {imageUrl && (
                          <img 
                            src={imageUrl}
                            alt="Generated image"
                            className="object-contain w-full h-full"
                          />
                        )}
                      </div>
                      <Button
                        onClick={handleDownload}
                        className="flex items-center gap-2 mt-4 bg-gray-800 hover:bg-gray-700 focus:ring-gray-500 text-white"
                      >
                        <Download className="h-4 w-4" />
                        <span>Download Image</span>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </main>

        <footer className="border-t border-gray-200 dark:border-gray-700 mt-auto py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              LumiLearn — Personalized learning.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}