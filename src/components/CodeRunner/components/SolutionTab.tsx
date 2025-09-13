import React, { useState } from 'react';
import { Copy, Eye, EyeOff } from 'lucide-react';
import type { Question } from '../types';

interface SolutionTabProps {
  question: Question;
}

const languageMap: Record<string, string> = {
  python: 'python',
  cpp: 'cpp',
  java: 'java',
  javascript: 'javascript',
  c: 'c'
};

export default function SolutionTab({ question }: SolutionTabProps) {
  const [selectedLanguage, setSelectedLanguage] = useState(
    question.allowed_languages[0] || 'python'
  );
  const [showSolution, setShowSolution] = useState(false);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  if (!question.solution_code) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No solution available for this problem.</p>
      </div>
    );
  }

  return (
    <div className="p-6 text-gray-100">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-100 mb-3">Solution</h3>
        <p className="text-sm text-gray-400 mb-4">
          Review the solution code to understand the approach and implementation.
        </p>
        
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => setShowSolution(!showSolution)}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              showSolution
                ? 'bg-[#4CA466] text-white hover:bg-[#3d8f56]'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {showSolution ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showSolution ? 'Hide Solution' : 'Show Solution'}
          </button>
        </div>
      </div>

      {showSolution && (
        <div>
          {/* Language Selector */}
          <div className="flex items-center gap-3 mb-4">
            <label className="text-sm font-medium text-gray-300">Language:</label>
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="px-3 py-1 border border-gray-600 rounded-md text-sm bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CA466] focus:border-transparent"
            >
              {question.allowed_languages
                .filter(lang => question.solution_code?.[lang])
                .map((lang) => (
                  <option key={lang} value={lang}>
                    {lang.charAt(0).toUpperCase() + lang.slice(1)}
                  </option>
                ))}
            </select>
          </div>

          {/* Solution Code */}
          {question.solution_code[selectedLanguage] && (
            <div className="border border-gray-600 rounded-lg overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2 bg-gray-700 border-b border-gray-600">
                <span className="text-sm font-medium text-gray-300">
                  Solution Code ({selectedLanguage})
                </span>
                <button
                  onClick={() => copyToClipboard(question.solution_code![selectedLanguage])}
                  className="flex items-center gap-1 px-2 py-1 text-sm text-gray-400 hover:text-[#4CA466] transition-colors"
                  title="Copy solution code"
                >
                  <Copy className="w-4 h-4" />
                  Copy
                </button>
              </div>
              <pre className="p-4 bg-gray-800 text-gray-200 text-sm font-mono overflow-x-auto max-h-96">
                <code>{question.solution_code[selectedLanguage]}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}