import React, { useState } from 'react';

function TestCaseGroups() {
  const [groups, setGroups] = useState([
    {
      id: 1,
      name: 'basic',
      weight: 30,
      visibility: 'public',
      scoring_strategy: 'binary',
      cases: [
        { id: 1, input_text: '', expected_output: '', time_limit_ms: '', memory_limit_kb: '' }
      ]
    }
  ]);

  const visibilityOptions = [
    { value: 'public', label: 'Public' },
    { value: 'hidden', label: 'Hidden' }
  ];

  const scoringOptions = [
    { value: 'binary', label: 'Binary (Pass/Fail)' },
    { value: 'partial', label: 'Partial Credit' }
  ];

  const addGroup = () => {
    const newGroup = {
      id: Date.now(),
      name: '',
      weight: 0,
      visibility: 'hidden',
      scoring_strategy: 'binary',
      cases: [
        { id: Date.now(), input_text: '', expected_output: '', time_limit_ms: '', memory_limit_kb: '' }
      ]
    };
    setGroups([...groups, newGroup]);
  };

  const removeGroup = (groupId) => {
    setGroups(groups.filter(group => group.id !== groupId));
  };

  const updateGroup = (groupId, field, value) => {
    setGroups(groups.map(group => 
      group.id === groupId ? { ...group, [field]: value } : group
    ));
  };

  const addTestCase = (groupId) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? {
            ...group,
            cases: [...group.cases, {
              id: Date.now(),
              input_text: '',
              expected_output: '',
              time_limit_ms: '',
              memory_limit_kb: ''
            }]
          }
        : group
    ));
  };

  const removeTestCase = (groupId, caseId) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? { ...group, cases: group.cases.filter(testCase => testCase.id !== caseId) }
        : group
    ));
  };

  const updateTestCase = (groupId, caseId, field, value) => {
    setGroups(groups.map(group => 
      group.id === groupId 
        ? {
            ...group,
            cases: group.cases.map(testCase => 
              testCase.id === caseId ? { ...testCase, [field]: value } : testCase
            )
          }
        : group
    ));
  };

  const getTotalWeight = () => {
    return groups.reduce((total, group) => total + (parseInt(group.weight) || 0), 0);
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col">
      <div className="p-6 bg-white shadow-sm border-b">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Test Case Groups</h1>
            <p className="text-gray-600 mt-1">Manage test case groups for your question</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-600">
              Total Weight: <span className="font-semibold text-[#4CA466]">{getTotalWeight()}</span>
            </div>
            <button
              onClick={addGroup}
              className="px-4 py-2 bg-[#4CA466] text-white font-medium rounded-lg hover:bg-[#3d8a54] transition-colors"
            >
              Add Group
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {groups.map((group, groupIndex) => (
            <div key={group.id} className="bg-white rounded-xl shadow-lg border border-gray-200">
              {/* Group Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Group {groupIndex + 1}
                  </h3>
                  {groups.length > 1 && (
                    <button
                      onClick={() => removeGroup(group.id)}
                      className="text-red-600 hover:text-red-800 text-sm font-medium"
                    >
                      Remove Group
                    </button>
                  )}
                </div>

                {/* Group Configuration */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Group Name
                    </label>
                    <input
                      type="text"
                      value={group.name}
                      onChange={(e) => updateGroup(group.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors"
                      placeholder="e.g., basic, edge, performance"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Weight
                    </label>
                    <input
                      type="number"
                      value={group.weight}
                      onChange={(e) => updateGroup(group.id, 'weight', parseInt(e.target.value) || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Visibility
                    </label>
                    <select
                      value={group.visibility}
                      onChange={(e) => updateGroup(group.id, 'visibility', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors"
                    >
                      {visibilityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Scoring Strategy
                    </label>
                    <select
                      value={group.scoring_strategy}
                      onChange={(e) => updateGroup(group.id, 'scoring_strategy', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors"
                    >
                      {scoringOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Test Cases */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-md font-medium text-gray-900">
                    Test Cases ({group.cases.length})
                  </h4>
                  <button
                    onClick={() => addTestCase(group.id)}
                    className="px-3 py-1.5 bg-[#4CA466] text-white text-sm font-medium rounded-md hover:bg-[#3d8a54] transition-colors"
                  >
                    Add Test Case
                  </button>
                </div>

                <div className="space-y-4">
                  {group.cases.map((testCase, caseIndex) => (
                    <div key={testCase.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="text-sm font-medium text-gray-900">
                          Test Case {caseIndex + 1}
                        </h5>
                        {group.cases.length > 1 && (
                          <button
                            onClick={() => removeTestCase(group.id, testCase.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Remove
                          </button>
                        )}
                      </div>

                      <div className="space-y-3">
                        {/* Input and Expected Output */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Input
                            </label>
                            <textarea
                              value={testCase.input_text}
                              onChange={(e) => updateTestCase(group.id, testCase.id, 'input_text', e.target.value)}
                              rows="3"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors resize-none font-mono"
                              placeholder="Test case input..."
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Expected Output
                            </label>
                            <textarea
                              value={testCase.expected_output}
                              onChange={(e) => updateTestCase(group.id, testCase.id, 'expected_output', e.target.value)}
                              rows="3"
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors resize-none font-mono"
                              placeholder="Expected output..."
                            />
                          </div>
                        </div>

                        {/* Optional Limits */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Time Limit Override (ms)
                            </label>
                            <input
                              type="number"
                              value={testCase.time_limit_ms}
                              onChange={(e) => updateTestCase(group.id, testCase.id, 'time_limit_ms', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors"
                              placeholder="Optional override"
                              min="0"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Memory Limit Override (KB)
                            </label>
                            <input
                              type="number"
                              value={testCase.memory_limit_kb}
                              onChange={(e) => updateTestCase(group.id, testCase.id, 'memory_limit_kb', e.target.value)}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors"
                              placeholder="Optional override"
                              min="0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}

          {groups.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <div className="text-gray-400 text-lg mb-2">📝</div>
              <p className="text-gray-500 text-sm mb-4">No test case groups created yet</p>
              <button
                onClick={addGroup}
                className="px-4 py-2 bg-[#4CA466] text-white font-medium rounded-lg hover:bg-[#3d8a54] transition-colors"
              >
                Create First Group
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TestCaseGroups;