import React, { useState } from 'react';

interface ReasoningSectionProps {
  reasoningBullets?: string[];
  lmStudioResponse?: string;
  findings?: any[]; // Include findings to reference line numbers
  narrativeReasoning?: {
    summary: string;
    reasoning: string[];
  };
}

const ReasoningSection: React.FC<ReasoningSectionProps> = ({
  reasoningBullets = [],
  lmStudioResponse = '',
  findings = [],
  narrativeReasoning
}) => {
  const [showReasoning, setShowReasoning] = useState(false);
  // Function to extract line numbers from bullet points
  const extractLineNumbers = (bullet: string) => {
    // Try to find line numbers using common patterns
    const lineNumberPattern = /line[s]?\s+(\d+(?:\s*-\s*\d+|\s*,\s*\d+)*)/i;
    const matches = bullet.match(lineNumberPattern);
    
    if (matches && matches[1]) {
      return matches[1];
    }
    return null;
  };
  
  // Function to find relevant findings based on patterns in text
  const findRelatedFindings = (text: string) => {
    if (!findings || findings.length === 0) return [];
    
    // Extract keywords from the text to match against findings
    const lowercaseText = text.toLowerCase();
    const keywords = [
      'sql', 'injection', 'xss', 'cross-site', 'path', 'traversal', 
      'ddos', 'brute force', 'credentials', 'reconnaissance', 'bot'
    ];
    
    // Filter findings related to any keyword in the text
    return findings.filter(finding => {
      const vulnId = finding.vulnerability_id?.toLowerCase() || '';
      const desc = finding.description?.toLowerCase() || '';
      
      return keywords.some(keyword => 
        (lowercaseText.includes(keyword) && (vulnId.includes(keyword) || desc.includes(keyword)))
      );
    });
  };
  
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
        
        {/* Narrative reasoning format */}
        {narrativeReasoning && (
          <div className="mb-6">
            {/* Summary section */}
            <div className="text-gray-200 whitespace-pre-wrap mb-4 text-lg leading-relaxed">
              {narrativeReasoning.summary}
            </div>
            
            {/* Toggle reasoning button */}
            <button 
              onClick={() => setShowReasoning(!showReasoning)}
              className="text-blue-300 hover:text-blue-200 mb-4 flex items-center"
            >
              <span className="mr-2">{showReasoning ? 'Hide' : 'Show'} reasoning</span>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className={`h-4 w-4 transform ${showReasoning ? 'rotate-180' : ''} transition-transform`} 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            {/* Reasoning points */}
            {showReasoning && (
              <div className="space-y-3 border-t border-blue-900 pt-4">
                <div className="text-blue-300 mb-2 font-bold">#reasoning on</div>
                {narrativeReasoning.reasoning.map((point, index) => {
                  // Extract line numbers if present
                  const lineNumbers = extractLineNumbers(point);
                  
                  // Find related findings for this reasoning point
                  const relatedFindings = findRelatedFindings(point);
                  
                  return (
                    <div key={index} className="flex text-gray-200">
                      <div className="font-medium text-blue-300 mr-2">{index + 1}.</div>
                      <div className="flex-1">
                        <div>{point}</div>
                        
                        {/* Show related findings if available */}
                        {relatedFindings.length > 0 && (
                          <div className="mt-2 pl-4 border-l-2 border-blue-800">
                            <div className="text-sm text-blue-200 mb-1">Related findings:</div>
                            <ul className="space-y-1 text-sm">
                              {relatedFindings.slice(0, 3).map((finding, i) => (
                                <li key={i} className="text-gray-300">
                                  <span className="text-blue-300">Line {finding.line_number}:</span> {finding.description}
                                  <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
                                    finding.severity === 'high' ? 'bg-red-900 text-red-200' :
                                    finding.severity === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                                    'bg-green-900 text-green-200'
                                  }`}>
                                    {finding.severity || 'low'}
                                  </span>
                                </li>
                              ))}
                              {relatedFindings.length > 3 && (
                                <li className="text-gray-400 text-xs">
                                  + {relatedFindings.length - 3} more related findings
                                </li>
                              )}
                            </ul>
                          </div>
                        )}
                        
                        {/* If we extracted line numbers, highlight them */}
                        {lineNumbers && !relatedFindings.length && (
                          <div className="mt-1 text-gray-400 text-sm">
                            <span className="text-blue-300">Referenced lines:</span> {lineNumbers}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
        
        {(!narrativeReasoning && reasoningBullets && reasoningBullets.length > 0) ? (
          <div className="space-y-4">
            {reasoningBullets.map((bullet, index) => {
              // Extract line numbers if present in the bullet text
              const lineNumbers = extractLineNumbers(bullet);
              
              // Find related findings for this bullet point
              const relatedFindings = findRelatedFindings(bullet);
              
              return (
                <div key={index}>
                  <div className="flex">
                    <span className="text-blue-300 mr-2">🔹</span>
                    <span className="text-gray-200 font-medium">
                      {/* Process markdown-like formatting */}
                      {bullet.includes('**') 
                        ? bullet.split('**').map((part, i) => 
                            i % 2 === 1 ? <strong key={i} className="text-blue-200">{part}</strong> : part
                          )
                        : bullet}
                    </span>
                  </div>
                  
                  {/* Show related findings if available */}
                  {relatedFindings.length > 0 && (
                    <div className="ml-6 mt-2 pl-4 border-l-2 border-blue-800">
                      <div className="text-sm text-blue-200 mb-1">Related findings:</div>
                      <ul className="space-y-1 text-sm">
                        {relatedFindings.slice(0, 3).map((finding, i) => (
                          <li key={i} className="text-gray-300">
                            <span className="text-blue-300">Line {finding.line_number}:</span> {finding.description}
                            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
                              finding.severity === 'high' ? 'bg-red-900 text-red-200' :
                              finding.severity === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                              'bg-green-900 text-green-200'
                            }`}>
                              {finding.severity || 'low'}
                            </span>
                          </li>
                        ))}
                        {relatedFindings.length > 3 && (
                          <li className="text-gray-400 text-xs">
                            + {relatedFindings.length - 3} more related findings
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {/* If we extracted line numbers, highlight them */}
                  {lineNumbers && !relatedFindings.length && (
                    <div className="ml-6 mt-1 text-gray-400 text-sm">
                      <span className="text-blue-300">Referenced lines:</span> {lineNumbers}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (!narrativeReasoning && lmStudioResponse) ? (
          <div className="text-gray-200 whitespace-pre-wrap space-y-4">
            {lmStudioResponse.split('\n').map((line, index) => {
              // Check if this is a numbered line (1., 2., etc.)
              const isNumberedLine = /^\s*\d+\./.test(line.trim());
              
              // Extract line numbers if present
              const lineNumbers = extractLineNumbers(line);
              
              // Find related findings for this line if it's a numbered point
              const relatedFindings = isNumberedLine ? findRelatedFindings(line) : [];
              
              return (
                <div key={index}>
                  <div className={`${isNumberedLine ? 'mb-2' : 'mb-1'}`}>
                    {isNumberedLine ? (
                      <div className="flex">
                        <span className="text-blue-300 mr-2">🔹</span>
                        <span className="font-medium">{line}</span>
                      </div>
                    ) : line.trim() === '' ? (
                      <div className="h-2"></div> // Extra space for empty lines
                    ) : (
                      <div>{line}</div>
                    )}
                  </div>
                  
                  {/* Show related findings if available */}
                  {relatedFindings.length > 0 && (
                    <div className="ml-6 mt-2 pl-4 border-l-2 border-blue-800">
                      <div className="text-sm text-blue-200 mb-1">Related findings:</div>
                      <ul className="space-y-1 text-sm">
                        {relatedFindings.slice(0, 3).map((finding, i) => (
                          <li key={i} className="text-gray-300">
                            <span className="text-blue-300">Line {finding.line_number}:</span> {finding.description}
                            <span className={`ml-2 px-1.5 py-0.5 text-xs rounded ${
                              finding.severity === 'high' ? 'bg-red-900 text-red-200' :
                              finding.severity === 'medium' ? 'bg-yellow-900 text-yellow-200' :
                              'bg-green-900 text-green-200'
                            }`}>
                              {finding.severity || 'low'}
                            </span>
                          </li>
                        ))}
                        {relatedFindings.length > 3 && (
                          <li className="text-gray-400 text-xs">
                            + {relatedFindings.length - 3} more related findings
                          </li>
                        )}
                      </ul>
                    </div>
                  )}
                  
                  {/* If we extracted line numbers, highlight them */}
                  {lineNumbers && !relatedFindings.length && isNumberedLine && (
                    <div className="ml-6 mt-1 text-gray-400 text-sm">
                      <span className="text-blue-300">Referenced lines:</span> {lineNumbers}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (!narrativeReasoning) ? (
          <div className="text-center py-6 text-gray-400">
            <p>No reasoning data available</p>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ReasoningSection;