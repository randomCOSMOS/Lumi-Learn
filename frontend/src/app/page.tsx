"use client";

import { FormEvent, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Search, 
  BookOpen, 
  Lightbulb, 
  ArrowRight, 
  Mic, 
  Image, 
  FileText,
  Menu,
  X
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import "./globals.css";
import EnhancedInputForm from "./form";

export default function Home() {
  const [incoming_data, setIncoming_data] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [question, setQuestion] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handleQuestion = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api", {
        question: question,
      });
      setIncoming_data(res.data.response);
    } catch (error) {
      console.error("Error submitting question:", error);
      setIncoming_data("Sorry, we couldn't process your question right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderIncomingData = () => {
    if (!incoming_data) return null;

    try {
      let dataToRender;

      if (typeof incoming_data === 'string') {
        try {
          dataToRender = JSON.parse(incoming_data);
        } catch {
          return (
            <div className="text-gray-800 dark:text-gray-100">
              {incoming_data.split("|").map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          );
        }
      } else {
        dataToRender = incoming_data;
      }

      if (Array.isArray(dataToRender)) {
        return (
          <div className="space-y-4">
            {dataToRender.map((item, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-100 overflow-x-auto">
                  {JSON.stringify(item, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        );
      }

      if (typeof dataToRender === 'object' && dataToRender !== null) {
        return (
          <div className="space-y-4">
            {Object.entries(dataToRender).map(([key, value], index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">{key}</h3>
                <pre className="whitespace-pre-wrap text-sm text-gray-800 dark:text-gray-100 overflow-x-auto">
                  {typeof value === 'object'
                    ? JSON.stringify(value, null, 2)
                    : String(value)}
                </pre>
              </div>
            ))}
          </div>
        );
      }

      return (
        <div className="text-gray-800 dark:text-gray-100">
          {String(dataToRender)}
        </div>
      );
    } catch (error) {
      return (
        <div className="text-red-500 dark:text-red-400">
          I'm sorry, I couldn't process that response. Please try a different question.
        </div>
      );
    }
  };

  const sidebarLinks = [
    { path: "/", label: "Ask Questions", icon: <Search className="h-5 w-5" /> },
    { path: "/tts", label: "Text to Speech", icon: <Mic className="h-5 w-5" /> },
    { path: "/image", label: "Image Generation", icon: <Image className="h-5 w-5" /> },
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
        <nav className="p-4 h-lvh">
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
            <h2 className="text-2xl font-semibold mb-2">Study with LumiLearn</h2>
            <p className="text-gray-600 dark:text-gray-300">Ask any question to get started.</p>
          </div>

          <div className="mb-8">
            <EnhancedInputForm onDataReceived={(data: any) => setIncoming_data(data)} />
          </div>

          {incoming_data && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4">Results</h2>
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="prose prose-sm dark:prose-invert max-w-none overflow-auto" style={{ maxHeight: '60vh' }}>
                    {renderIncomingData()}
                  </div>
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