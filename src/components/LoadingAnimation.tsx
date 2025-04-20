'use client';

import { useEffect, useState } from 'react';

// Cooking-themed loading messages
const cookingPhrases = [
    "Adding oil...",
    "Hold tight, we're cooking your logs!",
    "Stirring the data...",
    "Sautéing the security patterns...",
    "Simmering the analysis...",
    "Spicing up the detection...",
    "Dicing the vulnerabilities...",
    "Whisking the patterns together...",
    "Bringing the analysis to a boil...",
    "Almost there, just need to garnish...",
    "Plating your results beautifully...",
    "Final tasting in progress...",
    "Marinating the log entries...",
    "Seasoning with machine learning...",
    "Glazing the anomalies...",
    "Cranking up the firewall heat...",
    "Roasting the suspicious behavior...",
    "Serving up fresh insights...",
    "Reducing the noise...",
    "Peeling back the layers...",
    "Sprinkling threat intelligence...",
    "Tossing out false positives...",
    "Preheating the engine...",
    "Letting the logs rest...",
    "Sampling the spice of risk...",
    "Garnishing with clarity...",
    "Steeping the metadata...",
    "Toasting the critical alerts...",
    "Simmering down the panic...",
    "Cooking up secure conclusions...",
  
    // New additions
    "Fermenting raw data into meaningful insights...",
    "Skimming off the top logs for extra flavor...",
    "Baking the analytics until golden and actionable...",
    "Folding in encryption carefully...",
    "Filtering the bits from the bytes...",
    "Mixing in compliance with a smooth consistency...",
    "Infusing context into every event...",
    "Caramelizing event spikes with precision...",
    "Curing the logs overnight for full effect...",
    "Dry-rubbing the alerts with extra scrutiny...",
    "Sweating the small logs just a little...",
    "Crisping the timelines for better visibility...",
    "Dehydrating unnecessary noise...",
    "Foaming up the insights for extra flair...",
    "Blanching the unusual patterns briefly...",
    "Plumping up those alert details...",
    "Braising deep logs for long-term flavor...",
    "Candied anomalies coming right up...",
    "Rolling the metrics into one tight dashboard...",
    "Basting your logs in context-rich summaries..."
  ];
  
export default function LoadingAnimation() {
  const [currentPhrase, setCurrentPhrase] = useState(cookingPhrases[0]);
  const [phaseIndex, setPhaseIndex] = useState(0);
  
  useEffect(() => {
    // Change the phrase every 500ms
    const interval = setInterval(() => {
      setPhaseIndex((prevIndex) => {
        const newIndex = (prevIndex + 1) % cookingPhrases.length;
        setCurrentPhrase(cookingPhrases[newIndex]);
        return newIndex;
      });
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);
  
  return (
    <div className="p-6 bg-gray-800 rounded-lg shadow-lg border border-blue-900 animate-pulse">
      <div className="flex flex-col md:flex-row items-center">
        {/* Loading icon with cooking utensils - enlarged */}
        <div className="relative w-32 h-32 mr-6 mb-4 md:mb-0">
          {/* Animated pot */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-20 bg-gray-600 rounded-b-full border-t-0 overflow-hidden animate-pulse">
            <div className="absolute bottom-0 w-full h-10 bg-blue-500 animate-wave"></div>
          </div>
          
          {/* Pot handles */}
          <div className="absolute top-1/3 left-0 w-5 h-6 bg-gray-500 rounded-full"></div>
          <div className="absolute top-1/3 right-0 w-5 h-6 bg-gray-500 rounded-full"></div>
          
          {/* Pot lid */}
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 w-20 h-3 bg-gray-400 rounded-full"></div>
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-4 bg-gray-500 rounded-full"></div>
          
          {/* Steam animation - enhanced */}
          <div className="absolute bottom-1/2 left-1/3 w-4 h-4 bg-blue-200 rounded-full opacity-60 animate-float"></div>
          <div className="absolute bottom-1/2 left-1/2 w-3 h-3 bg-blue-200 rounded-full opacity-60 animate-float" style={{ animationDelay: '0.3s' }}></div>
          <div className="absolute bottom-1/2 right-1/3 w-5 h-5 bg-blue-200 rounded-full opacity-60 animate-float" style={{ animationDelay: '0.6s' }}></div>
          <div className="absolute bottom-1/2 left-1/4 w-3 h-3 bg-blue-200 rounded-full opacity-60 animate-float" style={{ animationDelay: '0.9s' }}></div>
          <div className="absolute bottom-1/2 right-1/4 w-4 h-4 bg-blue-200 rounded-full opacity-60 animate-float" style={{ animationDelay: '1.2s' }}></div>
          
          {/* Moving whisk animation - enhanced */}
          <div className="absolute top-0 left-14 animate-stir">
            <div className="w-2 h-16 bg-gray-400"></div>
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-6 border-2 border-gray-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="flex-grow text-center md:text-left">
          {/* Changing text - enhanced */}
          <h2 className="text-xl font-bold text-blue-300 min-h-[2rem] mb-3 transition-all duration-300">
            {currentPhrase}
          </h2>
          
          {/* Safety tip */}
          <p className="text-sm text-gray-400 mb-3 italic">
            Analyzing logs for security vulnerabilities...
          </p>
          
          {/* Progress bar - enhanced */}
          <div className="w-full bg-gray-700 rounded-full h-3 mt-3">
            <div className="bg-blue-500 h-3 rounded-full animate-progress shadow-inner shadow-blue-600"></div>
          </div>
          
          {/* Estimate time */}
          <p className="text-xs text-gray-500 mt-2 text-right">
            Please wait while we analyze your data...
          </p>
        </div>
      </div>
    </div>
  );
}