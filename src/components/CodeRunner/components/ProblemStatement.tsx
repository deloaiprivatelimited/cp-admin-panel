import React from 'react';
import { Copy, Clock, Database, Award } from 'lucide-react';
import type { Question } from '../types';

interface ProblemStatementProps {
  question: Question;
}

const difficultyColors = {
  easy: 'bg-green-100 text-green-800',
  medium: 'bg-yellow-100 text-yellow-800',
  hard: 'bg-red-100 text-red-800'
};

export default function ProblemStatement({ question }: ProblemStatementProps) {
  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  return (
    <div className="p-6 text-gray-100">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-100 mb-3">{question.title}</h1>
        
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${difficultyColors[question.difficulty]}`}>
            {question.difficulty}
          </span>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Award className="w-4 h-4" />
            <span>{question.points} points</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{question.time_limit_ms}ms</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-gray-400">
            <Database className="w-4 h-4" />
            <span>{question.memory_limit_kb}KB</span>
          </div>
        </div>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {question.tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 text-xs font-medium text-gray-300 bg-gray-700 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Topic and Subtopic */}
        <div className="text-sm text-gray-400 mb-4">
          <span className="font-medium">{question.topic}</span>
          {question.subtopic && <span className="ml-2">• {question.subtopic}</span>}
        </div>
      </div>

      {/* Short Description */}
      {question.short_description && (
        <div className="mb-6 p-4 bg-blue-900/30 border-l-4 border-blue-400 rounded-md">
          <p className="text-gray-200 font-medium">{question.short_description}</p>
        </div>
      )}

      {/* Long Description */}
      <div className="prose prose-sm max-w-none">
        <div
          className="text-gray-300 leading-relaxed"
          dangerouslySetInnerHTML={{
            __html: question.long_description_markdown
              .replace(/### /g, '<h3 class="text-lg font-semibold text-gray-100 mt-6 mb-3">')
              .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold">$1</strong>')
              .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 text-sm bg-gray-700 text-gray-200 rounded">$1</code>')
              .replace(/\n/g, '<br>')
          }}
        />
      </div>

      {/* Sample I/O Section */}
      {question.sample_io && question.sample_io.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-gray-100 mb-4">Sample Test Cases</h3>
          <div className="space-y-6">
            {question.sample_io.map((sample, index) => (
              <div key={index} className="border border-gray-600 rounded-lg p-4 bg-gray-700">
                <h4 className="text-md font-medium text-gray-200 mb-3">
                  Example {index + 1}
                </h4>
                
                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  {/* Input */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-300">Input</label>
                      <button
                        onClick={() => copyToClipboard(sample.input_text)}
                        className="p-1 text-gray-500 hover:text-[#4CA466] transition-colors"
                        title="Copy input"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="p-3 bg-gray-800 border border-gray-600 rounded text-sm font-mono overflow-x-auto text-gray-200">
                      {sample.input_text}
                    </pre>
                  </div>

                  {/* Output */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-sm font-medium text-gray-300">Output</label>
                      <button
                        onClick={() => copyToClipboard(sample.output)}
                        className="p-1 text-gray-500 hover:text-[#4CA466] transition-colors"
                        title="Copy output"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                    <pre className="p-3 bg-gray-800 border border-gray-600 rounded text-sm font-mono overflow-x-auto text-gray-200">
                      {sample.output}
                    </pre>
                  </div>
                </div>

                {/* Explanation */}
                {sample.explanation && (
                  <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">Explanation</label>
                    <p className="text-sm text-gray-300 bg-gray-800 p-3 border border-gray-600 rounded">
                      {sample.explanation}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}