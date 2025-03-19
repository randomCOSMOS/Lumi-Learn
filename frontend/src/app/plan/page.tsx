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
  CheckCircle
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import "../globals.css";

export default function PlanGenerationPage() {
  const [loading, setLoading] = useState(false);
  const [goal, setGoal] = useState("");
  const [planData, setPlanData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  const handlePlanGeneration = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!goal.trim()) return;

    setLoading(true);
    setError(null);
    setPlanData(null);
    
    try {
      const res = await axios.post("http://localhost:5000/plan", {
        goal: goal,
      });
      
      setPlanData(res.data);
    } catch (error) {
      console.error("Error generating plan:", error);
      setError("Sorry, we couldn't generate your plan right now. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const renderPlanData = () => {
    if (!planData) return null;

    try {
      let dataToRender;

      if (typeof planData === 'string') {
        try {
          dataToRender = JSON.parse(planData);
        } catch {
          return (
            <div className="text-gray-800 dark:text-gray-100 space-y-4">
              {planData.split("|").map((line, i) => (
                <p key={i} className="mb-2">{line}</p>
              ))}
            </div>
          );
        }
      } else {
        dataToRender = planData;
      }

      if (typeof dataToRender === 'object' && dataToRender !== null) {
        if (dataToRender.steps && Array.isArray(dataToRender.steps)) {
          return (
            <div className="space-y-6">
              {dataToRender.title && (
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                  {dataToRender.title}
                </h3>
              )}
              
              {dataToRender.description && (
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {dataToRender.description}
                </p>
              )}
              
              <div className="border-l-2 border-gray-300 dark:border-gray-700 pl-4 space-y-6">
                {dataToRender.steps.map((step: any, index: number) => (
                  <div key={index} className="relative">
                    <div className="absolute -left-6 mt-1 flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700">
                      <span className="text-gray-700 dark:text-gray-300 font-semibold">{index + 1}</span>
                    </div>
                    <div className="ml-6">
                      <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                        {step.title || `Step ${index + 1}`}
                      </h4>
                      <p className="text-gray-700 dark:text-gray-300">
                        {step.description}
                      </p>
                      {step.tasks && Array.isArray(step.tasks) && step.tasks.length > 0 && (
                        <div className="mt-3 pl-4">
                          <ul className="list-none space-y-2">
                            {step.tasks.map((task: string, taskIndex: number) => (
                              <li key={taskIndex} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-gray-500 dark:text-gray-400 mr-2 flex-shrink-0 mt-0.5" />
                                <span className="text-gray-700 dark:text-gray-300">{task}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {dataToRender.conclusion && (
                <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700">
                  <h4 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                    Conclusion
                  </h4>
                  <p className="text-gray-700 dark:text-gray-300">
                    {dataToRender.conclusion}
                  </p>
                </div>
              )}
            </div>
          );
        }
        
        return (
          <div className="space-y-4">
            {Object.entries(dataToRender).map(([key, value], index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2 capitalize">
                  {key.replace(/_/g, ' ')}
                </h3>
                <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">
                  {typeof value === 'object'
                    ? JSON.stringify(value, null, 2)
                    : String(value)}
                </div>
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
          I couldn't process the plan data. Please try a different goal statement.
        </div>
      );
    }
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
            <h2 className="text-2xl font-semibold mb-2">Plan Generation</h2>
            <p className="text-gray-600 dark:text-gray-300">Create a personalized step-by-step plan for any goal.</p>
          </div>

          <div className="mb-8">
            <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
              <CardContent className="p-4">
                <form onSubmit={handlePlanGeneration} className="flex flex-col gap-4">
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FileText className="h-5 w-5 text-gray-400" />
                    </div>
                    <textarea
                      value={goal}
                      onChange={(e) => setGoal(e.target.value)}
                      placeholder="What goal do you want to achieve? Be specific and clear..."
                      className="block w-full pl-10 pr-4 py-3 min-h-32 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md focus:ring-gray-500 focus:border-gray-500 placeholder-gray-400 dark:placeholder-gray-500"
                      aria-label="Goal description"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex items-center justify-center gap-2 w-full md:w-auto md:ml-auto bg-gray-800 hover:bg-gray-700 focus:ring-gray-500 text-white py-2 px-4 rounded-md"
                    aria-label="Generate plan"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin h-4 w-4 border-2 border-white border-opacity-20 border-t-white rounded-full"></div>
                        <span>Creating Plan...</span>
                      </>
                    ) : (
                      <>
                        <span>Generate Plan</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {(planData || error) && (
            <div className="animate-fadeIn">
              <h2 className="text-xl font-semibold mb-4">Your Plan</h2>
              <Card className="shadow-sm border border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <div className="prose prose-sm max-w-none dark:prose-invert">
                    {error ? (
                      <div className="text-red-500 dark:text-red-400">
                        {error}
                      </div>
                    ) : (
                      renderPlanData()
                    )}
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