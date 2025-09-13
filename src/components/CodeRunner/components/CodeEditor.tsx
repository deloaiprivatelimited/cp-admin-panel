import React, { useRef } from 'react';
import Editor from '@monaco-editor/react';
import { Copy, Play, Send, Settings } from 'lucide-react';
import type { Question, TestResult } from '../types';

interface CodeEditorProps {
  question: Question;
  selectedLanguage: string;
  onLanguageChange: (language: string) => void;
  code: string;
  onCodeChange: (code: string) => void;
  customInput: string;
  onCustomInputChange: (input: string) => void;
  output: string;
  isRunning: boolean;
  onRunCode: () => void;
  onSubmitCode: () => void;
}

const languageMap: Record<string, string> = {
  python: 'python',
  cpp: 'cpp',
  java: 'java',
  javascript: 'javascript',
  c: 'c'
};

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
};

export default function CodeEditor({
  question,
  selectedLanguage,
  onLanguageChange,
  code,
  onCodeChange,
  customInput,
  onCustomInputChange,
  output,
  isRunning,
  onRunCode,
  onSubmitCode
}: CodeEditorProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-700 bg-gray-900">
        <div className="flex items-center gap-3">
          <h2 className="text-lg font-semibold text-gray-100">{question.title}</h2>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${difficultyColors[question.difficulty]}`}>
            {question.difficulty}
          </span>
          <span className="text-sm text-gray-400">{question.points} points</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">
            Time: {question.time_limit_ms}ms | Memory: {question.memory_limit_kb}KB
          </span>
        </div>
      </div>

      {/* Language Selector and Actions */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-300">Language:</label>
          <select
            value={selectedLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            className="px-3 py-1 border border-gray-600 rounded-md text-sm bg-gray-700 text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#4CA466] focus:border-transparent"
          >
            {question.allowed_languages.map((lang) => (
              <option key={lang} value={lang}>
                {lang.charAt(0).toUpperCase() + lang.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center gap-2">
          {question.run_code_enabled && (
            <button
              onClick={onRunCode}
              disabled={isRunning}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-[#4CA466] border border-[#4CA466] rounded-md hover:bg-[#4CA466] hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running...' : 'Run'}
            </button>
          )}
          {question.submission_enabled && (
            <button
              onClick={onSubmitCode}
              className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-white bg-[#4CA466] rounded-md hover:bg-[#3d8f56] transition-colors"
            >
              <Send className="w-4 h-4" />
              Submit
            </button>
          )}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 min-h-0">
        <Editor
          height="100%"
          language={languageMap[selectedLanguage] || selectedLanguage}
          value={code}
          onChange={(value) => onCodeChange(value || '')}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: 'on',
            wordWrap: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
          }}
        />
      </div>

      {/* Input/Output Panel */}
      <div className="border-t border-gray-700 bg-gray-900">
        <div className="grid grid-cols-2 gap-4 p-4">
          {/* Custom Input */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Custom Input</label>
              <button
                onClick={() => copyToClipboard(customInput)}
                className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                title="Copy input"
              >
                <Copy className="w-4 h-4" />
              </button>
            </div>
            <textarea
              value={customInput}
              onChange={(e) => onCustomInputChange(e.target.value)}
              placeholder="Enter your test input..."
              className="w-full h-24 px-3 py-2 text-sm border border-gray-600 rounded-md resize-none bg-gray-800 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CA466] focus:border-transparent"
            />
          </div>

          {/* Output */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">Output</label>
              {output && (
                <button
                  onClick={() => copyToClipboard(output)}
                  className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                  title="Copy output"
                >
                  <Copy className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="w-full h-24 px-3 py-2 text-sm bg-gray-800 border border-gray-600 rounded-md overflow-auto">
              <pre className="whitespace-pre-wrap font-mono text-xs text-gray-300">
                {output || 'Run your code to see output here...'}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}