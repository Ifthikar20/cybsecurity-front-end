import React, { useState, useEffect, useRef } from 'react';

interface ReasoningSectionProps {
  reasoningBullets?: string[];
  lmStudioResponse?: string;
  findings?: any[];
  narrativeReasoning?: {
    summary: string;
    reasoning: string[];
  };
}

const ReasoningSection: React.FC<ReasoningSectionProps> = ({
  reasoningBullets = [],
  lmStudioResponse = '',
  narrativeReasoning
}) => {
  const [parsedResponse, setParsedResponse] = useState<any>(null);
  const [visibleBullets, setVisibleBullets] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [thinking, setThinking] = useState(true);
  const [typingActive, setTypingActive] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  // Use Intersection Observer to detect when component is visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // When the component enters the viewport
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Stop observing once it's visible
          if (sectionRef.current) {
            observer.unobserve(sectionRef.current);
          }
        }
      },
      { threshold: 0.2 } // Trigger when 20% of the component is visible
    );
    
    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }
    
    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);
  
  // Set up the typing animation for the reasoning bullets, but only when visible
  useEffect(() => {
    // Only start animations when component is visible
    if (!isVisible) return;
    
    // Use the reasoning bullets if provided, otherwise use the narrative reasoning
    const bullets = reasoningBullets && reasoningBullets.length > 0 
      ? reasoningBullets 
      : narrativeReasoning?.reasoning || [];
    
    if (bullets.length === 0) return;
    
    // Start the typing animation after a delay to simulate "thinking"
    const thinkingTimeout = setTimeout(() => {
      setThinking(false);
      setTypingActive(true);
      
      // Start the typing animation
      timeoutRef.current = setTimeout(addNextBullet, 300);
    }, 2000);
    
    // Function to add the next bullet with a typing effect
    function addNextBullet() {
      if (currentIndex < bullets.length) {
        setVisibleBullets(prev => [...prev, bullets[currentIndex]]);
        setCurrentIndex(prev => prev + 1);
        
        // Set the next timeout with a random delay for natural typing feel
        const nextDelay = 300 + Math.random() * 1200; // between 300ms and 1500ms
        timeoutRef.current = setTimeout(addNextBullet, nextDelay);
      } else {
        setTypingActive(false);
      }
    }
    
    return () => {
      clearTimeout(thinkingTimeout);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [reasoningBullets, narrativeReasoning, currentIndex, isVisible]);
  
  useEffect(() => {
    // Try to parse the LM Studio response as JSON
    if (lmStudioResponse) {
      try {
        const jsonResponse = JSON.parse(lmStudioResponse);
        setParsedResponse(jsonResponse);
      } catch (e) {
        console.log("Not valid JSON response");
      }
    }
  }, [lmStudioResponse]);

  return (
    <div ref={sectionRef} className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
        <h2 className="text-xl font-semibold text-blue-400">AI - Spector</h2>
        {isVisible && typingActive && (
          <div className="flex items-center">
            <div className="animate-pulse text-blue-300 mr-2">Processing</div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
      </div>
      
      {!isVisible ? (
        // Placeholder content when not visible
        <div className="bg-gray-900 p-5 rounded-md border border-blue-900 flex items-center justify-center h-48">
          <div className="text-blue-300 font-medium text-lg text-center">
            Scroll down to see AI analysis
          </div>
        </div>
      ) : (
        // Actual content when visible
        <div className="bg-gray-900 p-5 rounded-md border border-blue-900">
          <div className="mb-4 text-center">
            <div className="flex justify-center text-blue-300 mb-2">
              {'🧠'.repeat(10)}
            </div>
            <div className="text-blue-300 font-bold text-lg mb-2">
              LOCAL LLM IS THINKING
              {thinking && (
                <span className="inline-flex ml-2">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '250ms' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '500ms' }}>.</span>
                </span>
              )}
            </div>
            <div className="flex justify-center text-blue-300 mb-4">
              {'🧠'.repeat(10)}
            </div>
          </div>
          
          {/* Display thinking animation */}
          {thinking && (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="relative w-16 h-16 mb-4">
                <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-3 border-4 border-blue-300 border-t-transparent rounded-full animate-spin" style={{ animationDirection: 'reverse' }}></div>
              </div>
              <div className="text-blue-300 font-medium">AI is analyzing security patterns</div>
              <div className="mt-4 w-64 h-2 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 animate-pulse"></div>
              </div>
            </div>
          )}
          
          {/* Narrative reasoning summary if available */}
          {narrativeReasoning && !thinking && (
            <div className="mb-6 border-b border-gray-700 pb-4">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Summary:</h3>
              <p className="text-gray-200 mb-4 bg-gray-800 p-4 rounded border border-gray-700">
                {narrativeReasoning.summary}
              </p>
            </div>
          )}
          
          {/* Display the reasoning bullets with typing animation */}
          {visibleBullets.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-blue-300 mb-3">Key Reasoning Points:</h3>
              <ul className="space-y-3">
                {visibleBullets.map((bullet, index) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-300 mr-2 mt-1">•</span>
                    <div className="bg-gray-800 p-3 rounded border border-gray-700 flex-grow">
                      <p className="text-gray-200">{bullet}</p>
                    </div>
                  </li>
                ))}
              </ul>
              {typingActive && (
                <div className="mt-3 flex items-center justify-center">
                  <div className="typing-indicator flex items-center p-2">
                    <span className="text-blue-300 mr-2 font-medium">Analyzing</span>
                    <div className="inline-flex items-end h-5">
                      <span className="text-blue-400 text-xl animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
                      <span className="text-blue-400 text-xl animate-bounce mx-0.5" style={{ animationDelay: '150ms' }}>.</span>
                      <span className="text-blue-400 text-xl animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Show the raw LM Studio response in a collapsible section */}
          <div className="mt-8">
            <details className="bg-gray-800 rounded">
              <summary className="text-sm font-semibold text-blue-300 p-3 cursor-pointer">
                Show Raw Response Data
              </summary>
              <pre className="p-3 text-gray-300 whitespace-pre-wrap overflow-auto border-t border-gray-700">
                {lmStudioResponse || "🔸 No raw response available"}
              </pre>
            </details>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReasoningSection;