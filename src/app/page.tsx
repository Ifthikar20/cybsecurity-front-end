'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import LoadingAnimation from '../components/LoadingAnimation';

export default function Home() {
  const [fileContent, setFileContent] = useState<string>('');
  const [textInput, setTextInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [inputMethod, setInputMethod] = useState<'file' | 'text'>('file');
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setFileContent(event.target?.result as string);
      setInputMethod('file');
    };
    reader.readAsText(file);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTextInput(e.target.value);
    setInputMethod('text');
  };

  const processContent = async () => {
    const content = inputMethod === 'file' ? fileContent : textInput;
    
    if (!content) {
      setError('Please upload a file or enter log text first');
      return;
    }

    // Get start time to ensure minimum loading animation duration
    const startTime = Date.now();
    
    // Show loading animation immediately
    setIsLoading(true);
    setError('');
    
    try {
      // Structure the log data before sending to backend
      const structuredData = {
        log_content: content,
        timestamp: new Date().toISOString(),
        format: 'raw_log'
      };

      // Minimum loading time (7 seconds)
      const MIN_LOADING_TIME = 7000;
      
      // Start API request and animation simultaneously
      const [responseData] = await Promise.all([
        // Request promise
        (async () => {
          console.log("Sending request to backend...");
          const response = await fetch('http://127.0.0.1:5000/analyze', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(structuredData),
          });
    
          if (!response.ok) {
            throw new Error(`Server responded with ${response.status}`);
          }
    
          const data = await response.json();
          
          // Log the response data
          console.log("Analysis response received:", data);
          
          // Check if raw_response exists in the data
          if (data.deepseek_analysis && data.deepseek_analysis.raw_response) {
            console.log("Raw response found with length:", data.deepseek_analysis.raw_response.length);
          } else {
            console.warn("Raw response is missing from the API response!");
          }
          
          return data;
        })(),
        
        // Animation timing promise - ensures loading shows for minimum time
        new Promise(resolve => {
          const elapsedTime = Date.now() - startTime;
          const remainingTime = Math.max(0, MIN_LOADING_TIME - elapsedTime);
          console.log(`Ensuring loading animation shows for at least ${MIN_LOADING_TIME}ms (${remainingTime}ms remaining)`);
          setTimeout(resolve, remainingTime);
        })
      ]);
      
      // Store results in localStorage for the dashboard to access
      localStorage.setItem('analysisResults', JSON.stringify(responseData));
      
      try {
        // Navigate to dashboard (note: folder is named 'dashbaord' with a typo)
        console.log("Navigating to dashboard page...");
        router.push('/dashbaord');
      } catch (error: any) {
        console.error("Navigation error:", error);
        setError(`Navigation error: ${error?.message || 'Unknown error'}. Please go to /dashbaord manually.`);
      }
    } catch (err: any) {
      // Calculate remaining time for displaying error message
      const elapsedTime = Date.now() - startTime;
      const MIN_ERROR_DISPLAY = 2000; // 2 seconds minimum for error display
      const remainingTime = Math.max(0, MIN_ERROR_DISPLAY - elapsedTime);
      
      // Wait for minimum error display time
      setTimeout(() => {
        setError(`Error: ${err.message}`);
        setIsLoading(false);
      }, remainingTime);
    } finally {
      // Don't set isLoading to false here
      // It will be handled either by the navigation or the error timeout
      if (!(document.visibilityState === 'hidden')) {
        const elapsedTime = Date.now() - startTime;
        const remainingTime = Math.max(0, 
           - elapsedTime);
        
        // Only turn off loading state after minimum display time
        setTimeout(() => {
          setIsLoading(false);
        }, remainingTime);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-gray-100">
      {/* Header */}
      <header className="bg-gray-800 shadow-md">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-xl font-bold">Log File Vulnerability Analyzer</h1>
        </div>
      </header>

      {/* Loading animation overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-50 bg-gray-900 bg-opacity-80 flex items-center justify-center flex-col">
          <div className="animate-pulse text-2xl text-blue-400 mb-4">Analyzing your logs...</div>
          <div className="w-full max-w-md">
            <LoadingAnimation />
          </div>
        </div>
      )}
      
      {/* Main content */}
      <main className="flex-grow p-4 flex flex-col max-w-5xl mx-auto w-full">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-center text-blue-400 mb-6">
            Analyze Log Files for Security Vulnerabilities
          </h2>
          
          {/* File Upload Section */}
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-lg font-semibold mb-4 text-blue-300">Upload Log File</h3>
            <label className="w-full flex flex-col items-center px-4 py-6 bg-gray-700 text-blue-400 rounded-lg border-2 border-dashed border-blue-500 cursor-pointer hover:bg-gray-600 transition-all">
              <svg className="w-8 h-8" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
              </svg>
              <span className="mt-2 text-base">Select a log file</span>
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileChange}
              />
            </label>
            
            {fileContent && (
              <div className="mt-4 p-3 border border-gray-600 rounded-lg bg-gray-700">
                <h4 className="font-medium mb-2 text-gray-300">File Preview:</h4>
                <pre className="bg-gray-800 p-3 rounded-md text-sm overflow-x-auto max-h-40 text-gray-300">
                  {fileContent.length > 500 
                    ? `${fileContent.substring(0, 500)}...` 
                    : fileContent}
                </pre>
              </div>
            )}
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="bg-red-900 border border-red-700 text-red-100 px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}
          
          {/* Instructions */}
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 shadow-lg mb-4">
            <h3 className="text-lg font-semibold mb-3 text-blue-300">How it works</h3>
            <ol className="list-decimal list-inside space-y-2 text-gray-300">
              <li>Upload a log file <span className="text-gray-400">OR</span> enter log text in the chat window below</li>
              <li>Click "Analyze" to process the log data</li>
              <li>Our backend will check for known vulnerability patterns</li>
              <li>The DeepSeek reasoning model will analyze complex security issues</li>
              <li>View detailed results and recommendations on the dashboard</li>
            </ol>
          </div>
        </div>
        
        {/* Chat-like text input area */}
        <div className="mt-auto">
          <div className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700">
            <div className="p-4">
              <textarea
                className="w-full p-3 bg-gray-700 text-gray-100 border border-gray-600 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px] placeholder-gray-500"
                placeholder="Paste your log data here for analysis..."
                value={textInput}
                onChange={handleTextChange}
              ></textarea>
              
              <div className="flex justify-end mt-3">
                <button 
                  onClick={processContent}
                  disabled={isLoading || (!fileContent && !textInput)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 disabled:bg-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed transition-all flex items-center"
                >
                  {isLoading ? 'Analyzing...' : (
                    <>
                      Analyze
                      <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd"></path>
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}