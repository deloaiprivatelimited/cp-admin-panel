import React, { useState, useMemo } from 'react';
import { X, BookOpen } from 'lucide-react';
// import { addMinimalCodingQuestion } from './services/codingQuestions'; // adjust path
import { addMinimalCodingQuestion } from './coding';
// AddQuestionPanel.jsx
// A non-modal, self-contained component that contains all functions
// to add a minimal coding question. Drop it anywhere in your UI.
// Props:
// - onSuccess: (addedQuestion) => void  // optional callback after successful add
// - topics: optional custom topics array

export default function AddQuestionPanel({ id,onSuccess, topics: externalTopics }) {
  const defaultTopics = [
    { name: 'Data Structures', subtopics: ['Arrays', 'Linked Lists', 'Trees', 'Graphs', 'Hash Tables'] },
    { name: 'Algorithms', subtopics: ['Sorting', 'Searching', 'Dynamic Programming', 'Greedy', 'Recursion'] },
    { name: 'Mathematics', subtopics: ['Number Theory', 'Combinatorics', 'Probability', 'Geometry'] },
    { name: 'Strings', subtopics: ['Pattern Matching', 'Parsing', 'Regular Expressions'] }
  ];

  const topics = externalTopics || defaultTopics;
  const topicNames = useMemo(() => topics.map(t => t.name), [topics]);

  // Form state
  const [form, setForm] = useState({ title: '', shortDescription: '', topic: '', subtopic: '' });
  const [isAdding, setIsAdding] = useState(false);
  const [error, setError] = useState(null);

  // Internal helpers (all functions live inside this component)
  const validate = () => {
    if (!form.title.trim() || !form.shortDescription.trim() || !form.topic || !form.subtopic) {
      setError('Please fill all required fields.');
      return false;
    }
    setError(null);
    return true;
  };

  const subtopicsForSelectedTopic = useMemo(() => {
    const t = topics.find(x => x.name === form.topic);
    return t ? t.subtopics : [];
  }, [topics, form.topic]);

  const buildPayload = () => ({
    title: form.title.trim(),
    short_description: form.shortDescription.trim(),
    topic: form.topic.trim(),
    subtopic: form.subtopic.trim()
  });

  // Direct API call encapsulated here
  const createQuestion = async (payload) => {
    // wrapper so you can change to fetch / axios / other logic in one place
    return await addMinimalCodingQuestion(payload,id);
  };

  const resetForm = () => setForm({ title: '', shortDescription: '', topic: '', subtopic: '' });

  const handleAdd = async () => {
    if (!validate()) return;

    const payload = buildPayload();
    setIsAdding(true);
    setError(null);

    try {
      const res = await createQuestion(payload);

      // Build a UI-friendly representation of the added question
      const added = {
        id: res?.id || Date.now(),
        title: payload.title,
        shortDescription: payload.short_description,
        topic: payload.topic,
        subtopic: payload.subtopic,
        tags: res?.tags || [],
        difficulty: res?.difficulty || 'Easy'
      };

      // optional callback for parent to update lists
      onSuccess()

      // reset form
      resetForm();
    } catch (err) {
      console.error('Add question failed', err);
      setError(err?.message || 'Failed to add question');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Add New Question</h3>
          <p className="text-sm text-gray-500">Create a minimal coding question quickly</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors"
            placeholder="Enter question title..."
          />
        </div>

        {/* Topic */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Topic *</label>
          <select
            value={form.topic}
            onChange={(e) => setForm(prev => ({ ...prev, topic: e.target.value, subtopic: '' }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors"
          >
            <option value="">Select Topic</option>
            {topicNames.map(topic => (
              <option key={topic} value={topic}>{topic}</option>
            ))}
          </select>
        </div>

        {/* Subtopic (dependent) */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Subtopic *</label>
          <select
            value={form.subtopic}
            onChange={(e) => setForm(prev => ({ ...prev, subtopic: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors"
            disabled={!form.topic}
          >
            <option value="">Select Subtopic</option>
            {subtopicsForSelectedTopic.map(st => (
              <option key={st} value={st}>{st}</option>
            ))}
          </select>
        </div>

        {/* Short Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
          <textarea
            value={form.shortDescription}
            onChange={(e) => setForm(prev => ({ ...prev, shortDescription: e.target.value }))}
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors resize-none"
            placeholder="Brief description of the problem..."
          />
        </div>

        {error && <div className="text-sm text-red-600">{error}</div>}

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={resetForm}
            disabled={isAdding}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Reset
          </button>

          <button
            onClick={handleAdd}
            disabled={isAdding}
            className="px-4 py-2 bg-[#4CA466] text-white font-medium rounded-lg hover:bg-[#3d8a54] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isAdding ? 'Adding...' : 'Add Question'}
          </button>
        </div>
      </div>
    </div>
  );
}

// --- Small TagSelector component included below in case you want to use it inside this panel later ---
export function TagSelector({ availableTags = [], selectedTags = [], onAddTag, onRemoveTag, placeholder = 'Search and select tags...' }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => (
    (availableTags || []).filter(t => t.toLowerCase().includes(search.toLowerCase()) && !selectedTags.includes(t))
  ), [availableTags, search, selectedTags]);

  return (
    <div className="relative">
      <div className="flex items-center gap-2">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setShowDropdown(true); }}
          onFocus={() => setShowDropdown(true)}
          placeholder={placeholder}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] outline-none transition-colors w-48"
        />
        <div className="flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <span key={tag} className="inline-flex items-center gap-1 px-3 py-1 bg-[#4CA466] text-white text-sm rounded-full">
              {tag}
              <button onClick={() => onRemoveTag && onRemoveTag(tag)} className="ml-1 text-white">×</button>
            </span>
          ))}
        </div>
      </div>

      {showDropdown && filtered.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg z-10 max-h-48 overflow-y-auto">
          {filtered.map(tag => (
            <button
              key={tag}
              onClick={() => { onAddTag && onAddTag(tag); setSearch(''); setShowDropdown(false); }}
              className="w-full px-3 py-2 text-left hover:bg-gray-50 text-sm border-b border-gray-100 last:border-b-0"
            >
              {tag}
            </button>
          ))}
        </div>
      )}

      {showDropdown && <div className="fixed inset-0" onClick={() => setShowDropdown(false)} />}
    </div>
  );
}
