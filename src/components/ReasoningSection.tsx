import React, { useState, useEffect } from 'react';

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
}) => {
  const [parsedResponse, setParsedResponse] = useState<any>(null);
  
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
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 mb-8">
      <div className="flex justify-between items-center mb-4 border-b border-gray-700 pb-2">
        <h2 className="text-xl font-semibold text-blue-400">LM Studio Reasoning</h2>
      </div>
      
      <div className="bg-gray-900 p-5 rounded-md border border-blue-900">
        <div className="mb-4 text-center">
          <div className="flex justify-center text-blue-300 mb-2">
            {'🧠'.repeat(20)}
          </div>
          <div className="text-blue-300 font-bold text-lg mb-2">🧠                 LM STUDIO REASONING                  🧠</div>
          <div className="flex justify-center text-blue-300 mb-4">
            {'🧠'.repeat(20)}
          </div>
        </div>
        
        {/* Show the completely raw, unprocessed response first */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-semibold text-blue-300">Raw LM Studio Response:</h3>
          </div>
          <pre className="bg-gray-800 p-3 rounded text-gray-200 whitespace-pre-wrap overflow-auto">
            {lmStudioResponse || "🔸 No response from LM Studio"}
          </pre>
        </div>

        {/* Then show the formatted bullets if available */}
        {reasoningBullets && reasoningBullets.length > 0 && (
          <div className="mt-6">
       
          </div>
        )}
      </div>
    </div>
  );
};

export default ReasoningSection;