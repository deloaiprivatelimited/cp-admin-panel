import React, { useState } from 'react';

function MyComponent() {
  const [formData, setFormData] = useState({
    title: '',
    topic: '',
    subtopic: '',
    tags: '',
    timeLimit: '',
    memoryLimit: '',
    shortDescription: '',
    fullDescription: '',
    sampleIO: [{ input: '', output: '', explanation: '' }]
  });

  const topics = [
    { name: 'Data Structures', subtopics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Hash Tables'] },
    { name: 'Algorithms', subtopics: ['Sorting', 'Searching', 'Dynamic Programming', 'Greedy', 'Recursion'] },
    { name: 'Mathematics', subtopics: ['Number Theory', 'Combinatorics', 'Probability', 'Geometry'] },
    { name: 'Strings', subtopics: ['Pattern Matching', 'Parsing', 'Regular Expressions'] }
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSampleIOChange = (index, field, value) => {
    const newSampleIO = [...formData.sampleIO];
    newSampleIO[index][field] = value;
    setFormData(prev => ({
      ...prev,
      sampleIO: newSampleIO
    }));
  };

  const addSampleIO = () => {
    setFormData(prev => ({
      ...prev,
      sampleIO: [...prev.sampleIO, { input: '', output: '', explanation: '' }]
    }));
  };

  const removeSampleIO = (index) => {
    const newSampleIO = formData.sampleIO.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      sampleIO: newSampleIO
    }));
  };

  const selectedTopic = topics.find(topic => topic.name === formData.topic);
  const tagsList = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

  return (
    <div className="h-screen bg-gray-50 flex">
      <div className="w-full">
        <h1 className="text-3xl font-bold text-gray-900 mb-6 text-center p-6">Question Builder</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
          {/* Form Section - Left Side */}
          <div className="bg-white rounded-xl shadow-lg p-6 overflow-y-auto max-h-[calc(100vh-120px)] mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create Question</h2>
            
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Question Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors"
                  placeholder="Enter question title..."
                />
              </div>

              {/* Topic and Subtopic */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Topic
                  </label>
                  <select
                    value={formData.topic}
                    onChange={(e) => {
                      handleInputChange('topic', e.target.value);
                      handleInputChange('subtopic', '');
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors"
                  >
                    <option value="">Select Topic</option>
                    {topics.map(topic => (
                      <option key={topic.name} value={topic.name}>{topic.name}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subtopic
                  </label>
                  <select
                    value={formData.subtopic}
                    onChange={(e) => handleInputChange('subtopic', e.target.value)}
                    disabled={!selectedTopic}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">Select Subtopic</option>
                    {selectedTopic?.subtopics.map(subtopic => (
                      <option key={subtopic} value={subtopic}>{subtopic}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags (comma-separated)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors"
                  placeholder="array, sorting, medium"
                />
              </div>

              {/* Time and Memory Limits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Limit (seconds)
                  </label>
                  <input
                    type="number"
                    value={formData.timeLimit}
                    onChange={(e) => handleInputChange('timeLimit', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors"
                    placeholder="2"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Memory Limit (MB)
                  </label>
                  <input
                    type="number"
                    value={formData.memoryLimit}
                    onChange={(e) => handleInputChange('memoryLimit', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors"
                    placeholder="256"
                  />
                </div>
              </div>

              {/* Short Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description
                </label>
                <textarea
                  value={formData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  rows="2"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors resize-none"
                  placeholder="Brief summary of the problem..."
                />
              </div>

              {/* Full Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Description
                </label>
                <textarea
                  value={formData.fullDescription}
                  onChange={(e) => handleInputChange('fullDescription', e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors resize-none"
                  placeholder="Detailed problem description..."
                />
              </div>

              {/* Sample I/O Section */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <label className="block text-sm font-medium text-gray-700">
                    Sample Input/Output
                  </label>
                  <button
                    onClick={addSampleIO}
                    className="px-4 py-2 bg-[#4CA466] text-white text-sm font-medium rounded-lg hover:bg-[#3d8a54] transition-colors"
                  >
                    Add Sample
                  </button>
                </div>

                <div className="space-y-4">
                  {formData.sampleIO.map((sample, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-medium text-gray-900">Sample {index + 1}</h4>
                        {formData.sampleIO.length > 1 && (
                        <button
                          onClick={() => removeSampleIO(index)}
                          className="text-red-600 hover:text-red-800 text-sm font-medium"
                        >
                          Remove
                        </button>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Input</label>
                          <textarea
                            value={sample.input}
                            onChange={(e) => handleSampleIOChange(index, 'input', e.target.value)}
                            rows="2"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors resize-none"
                            placeholder="Sample input..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Output</label>
                          <textarea
                            value={sample.output}
                            onChange={(e) => handleSampleIOChange(index, 'output', e.target.value)}
                            rows="2"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors resize-none"
                            placeholder="Expected output..."
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs font-medium text-gray-600 mb-1">Explanation</label>
                          <textarea
                            value={sample.explanation}
                            onChange={(e) => handleSampleIOChange(index, 'explanation', e.target.value)}
                            rows="2"
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors resize-none"
                            placeholder="Explanation of the solution..."
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Preview Section - Right Side */}
          <div className="bg-white rounded-xl shadow-lg p-6 overflow-y-auto max-h-[calc(100vh-120px)] mx-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Preview</h2>
            
            <div className="space-y-6">
              {/* Title Preview */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {formData.title || 'Question Title'}
                </h3>
              </div>

              {/* Meta Information */}
              <div className="flex flex-wrap gap-2">
                {formData.topic && (
                  <span className="px-3 py-1 bg-[#4CA466] text-white text-sm rounded-full">
                    {formData.topic}
                  </span>
                )}
                {formData.subtopic && (
                  <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm rounded-full">
                    {formData.subtopic}
                  </span>
                )}
                {tagsList.map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>

              {/* Constraints */}
              {(formData.timeLimit || formData.memoryLimit) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Constraints</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    {formData.timeLimit && <p>Time Limit: {formData.timeLimit} seconds</p>}
                    {formData.memoryLimit && <p>Memory Limit: {formData.memoryLimit} MB</p>}
                  </div>
                </div>
              )}

              {/* Descriptions */}
              {formData.shortDescription && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">{formData.shortDescription}</p>
                </div>
              )}

              {formData.fullDescription && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Problem Description</h4>
                  <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{formData.fullDescription}</p>
                </div>
              )}

              {/* Sample I/O Preview */}
              {formData.sampleIO.some(sample => sample.input || sample.output || sample.explanation) && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-3">Examples</h4>
                  <div className="space-y-4">
                    {formData.sampleIO.map((sample, index) => (
                      (sample.input || sample.output || sample.explanation) && (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <h5 className="text-xs font-medium text-gray-600 mb-3">Example {index + 1}</h5>
                          
                          {sample.input && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-gray-600 mb-1">Input:</p>
                              <pre className="text-sm text-gray-800 bg-white p-2 rounded border font-mono overflow-x-auto">
                                {sample.input}
                              </pre>
                            </div>
                          )}
                          
                          {sample.output && (
                            <div className="mb-3">
                              <p className="text-xs font-medium text-gray-600 mb-1">Output:</p>
                              <pre className="text-sm text-gray-800 bg-white p-2 rounded border font-mono overflow-x-auto">
                                {sample.output}
                              </pre>
                            </div>
                          )}
                          
                          {sample.explanation && (
                            <div>
                              <p className="text-xs font-medium text-gray-600 mb-1">Explanation:</p>
                              <p className="text-sm text-gray-700 leading-relaxed">{sample.explanation}</p>
                            </div>
                          )}
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}

              {/* Empty State */}
              {!formData.title && !formData.shortDescription && !formData.fullDescription && (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-lg mb-2">📝</div>
                  <p className="text-gray-500 text-sm">Start filling out the form to see your question preview</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MyComponent;