import React, { useEffect, useState } from "react";
import { Plus, X, ChevronDown, Loader2, ArrowUp, ArrowDown } from "lucide-react";
// import { privateAxios } from "../../../utils/axios";
// import { showSuccess, showError } from "../../../utils/toast";
import { privateAxios } from "../../../../../../utils/axios";
import { showSuccess,showError } from "../../../../../../utils/toast";
import "katex/dist/katex.min.css";

const AddRearrangeForm = ({ unitId, formData, setFormData, setSaveRef }) => {
  // formData shape expected/used:
  // {
  //   title: "", prompt: "", items: ["a","b"], correctOrderIndexes: [0,1],
  //   isDragAndDrop: true, marks: 1, negativeMarks: 0, difficulty: 'Easy',
  //   explanation: "", tags: "", timeLimit: 60, timeUnit: "seconds",
  //   topic: "", subtopic: ""
  // }

  const [dropdownStates, setDropdownStates] = useState({
    topic: false,
    subtopic: false,
    difficulty: false,
  });
  const [loading, setLoading] = useState(false);

  const topics = [
    "Aptitude",
    "Logical Reasoning",
    "Verbal Ability",
    "Operating Systems",
    "DBMS",
    "Computer Networks",
    "Programming",
    "Data Structures",
    "Algorithms",
    "Software Engineering",
    "System Design",
    "HR & Behavioral",
  ];

  const subtopics = {
    Aptitude: [
      "Quantitative Aptitude",
      "Number System",
      "Percentages",
      "Ratios & Proportions",
      "Time & Work",
      "Speed, Time & Distance",
      "Probability",
      "Permutations & Combinations",
      "Mensuration",
      "Data Interpretation",
    ],
    "Logical Reasoning": [
      "Puzzles",
      "Seating Arrangement",
      "Blood Relations",
      "Coding-Decoding",
      "Syllogisms",
      "Direction Sense",
      "Series (Number/Alphabet)",
      "Clocks & Calendars",
    ],
    "Verbal Ability": [
      "Reading Comprehension",
      "Sentence Correction",
      "Fill in the Blanks",
      "Synonyms & Antonyms",
      "Paragraph Jumbles",
      "Critical Reasoning",
    ],
    "Operating Systems": [
      "Process Management",
      "CPU Scheduling",
      "Memory Management",
      "Deadlocks",
      "File Systems",
      "Concurrency & Synchronization",
    ],
    DBMS: ["ER Model", "Normalization", "SQL Queries", "Transactions", "Indexing", "Joins & Keys"],
    "Computer Networks": [
      "OSI & TCP/IP Models",
      "IP Addressing",
      "Routing",
      "Switching",
      "Congestion Control",
      "Application Layer Protocols (HTTP, DNS, FTP)",
    ],
    Programming: ["C/C++ Basics", "Java Basics", "Python Basics", "OOP Concepts", "Exception Handling", "Standard Libraries"],
    "Data Structures": ["Arrays", "Strings", "Linked List", "Stacks & Queues", "Trees", "Graphs", "Hashing", "Heaps"],
    Algorithms: [
      "Sorting",
      "Searching",
      "Recursion & Backtracking",
      "Greedy Algorithms",
      "Dynamic Programming",
      "Graph Algorithms",
      "Divide & Conquer",
    ],
    "Software Engineering": ["SDLC Models", "Agile & Scrum", "Testing & Debugging", "Version Control (Git)"],
    "System Design": ["Scalability Basics", "Load Balancing", "Caching", "Databases in Design", "High-Level Design Questions"],
    "HR & Behavioral": ["Tell me about yourself", "Strengths & Weaknesses", "Teamwork", "Leadership", "Conflict Resolution", "Why should we hire you?"],
  };

  const difficulties = ["Easy", "Medium", "Hard"];
  const TOPICS = Object.keys(subtopics);

  // helpers to update formData (lifted pattern)
  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const addItem = () => setFormData(prev => ({ ...prev, items: [...(prev.items || []), ""] }));
  const removeItem = (index) => {
    const items = [...(formData.items || [])];
    if (items.length <= 1) {
      showError("At least one item is required");
      return;
    }
    items.splice(index, 1);

    // update correct order indexes to reflect removal
    let correct = [...(formData.correctOrderIndexes || [])];
    correct = correct.filter(ci => ci !== index).map(ci => (ci > index ? ci - 1 : ci));

    setFormData(prev => ({ ...prev, items, correctOrderIndexes: correct }));
  };

  const moveItem = (index, dir) => {
    // dir = -1 (up) or +1 (down)
    const items = [...(formData.items || [])];
    const n = items.length;
    const j = index + dir;
    if (j < 0 || j >= n) return;
    // swap
    [items[index], items[j]] = [items[j], items[index]];

    // if a correct order is captured as indexes, we must update it to follow visual items order
    // easiest approach: when reordering items visually, we also update correctOrderIndexes mapping
    const correct = [...(formData.correctOrderIndexes || [])];
    // remap each correct index: if x == index -> x = j; else if x == j -> x = index
    const updatedCorrect = correct.map(ci => {
      if (ci === index) return j;
      if (ci === j) return index;
      return ci;
    });

    setFormData(prev => ({ ...prev, items, correctOrderIndexes: updatedCorrect }));
  };

  const toggleDropdown = (dropdown) => setDropdownStates(prev => ({ ...prev, [dropdown]: !prev[dropdown] }));
  const selectDropdownValue = (dropdown, value) => {
    setFormData(prev => ({ ...prev, [dropdown === "difficulty" ? "difficulty" : dropdown]: value, ...(dropdown === "topic" ? { subtopic: "" } : {}) }));
    setDropdownStates(prev => ({ ...prev, [dropdown]: false }));
  };

  const SearchableDropdown = ({ label, value, options, placeholder, dropdownKey }) => (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="relative">
        <button
          type="button"
          onClick={() => toggleDropdown(dropdownKey)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors bg-white text-left flex items-center justify-between"
        >
          <span className={value ? "text-gray-800" : "text-gray-500"}>{value || placeholder}</span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownStates[dropdownKey] ? "rotate-180" : ""}`} />
        </button>

        {dropdownStates[dropdownKey] && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
            {options.map((option, index) => (
              <button
                key={index}
                type="button"
                onClick={() => selectDropdownValue(dropdownKey, option)}
                className="w-full px-4 py-2 text-left hover:bg-[#4CA466]/10 transition-colors text-gray-800"
              >
                {option}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  // Capture the current items order as the canonical correct order.
  // correctOrderIndexes stores indexes into items in the order considered correct.
  const captureCorrectOrder = () => {
    const items = formData.items || [];
    if (!items || items.length === 0) {
      showError("Add at least one item before capturing correct order");
      return;
    }
    const idxs = items.map((_, i) => i);
    setFormData(prev => ({ ...prev, correctOrderIndexes: idxs }));
    showSuccess("Correct order captured from current items order");
  };

  // If you prefer to let user define a different correct order manually, provide a simple UI:
  // toggle `isEditingCorrectOrder` and allow clicking items to build the order.
  const [isEditingCorrectOrder, setIsEditingCorrectOrder] = useState(false);
  const toggleEditCorrectOrder = () => {
    setIsEditingCorrectOrder(e => !e);
    if (!isEditingCorrectOrder) {
      // start fresh selection if turning on
      setFormData(prev => ({ ...prev, correctOrderIndexes: [] }));
    }
  };
  const handlePickCorrectIndex = (idx) => {
    let cur = [...(formData.correctOrderIndexes || [])];
    if (cur.includes(idx)) {
      // ignore duplicates
      return;
    }
    cur.push(idx);
    setFormData(prev => ({ ...prev, correctOrderIndexes: cur }));
  };
  const clearCorrectOrder = () => {
    setFormData(prev => ({ ...prev, correctOrderIndexes: [] }));
  };

  // Validation (similar to MCQ but adapted)
  const validateForm = () => {
    if (!formData.topic) {
      showError("Topic is required");
      return false;
    }
    if (!formData.subtopic) {
      showError("Subtopic is required");
      return false;
    }
    if (!formData.title?.trim()) {
      showError("Title is required");
      return false;
    }
    if (!formData.prompt?.trim()) {
      showError("Prompt is required");
      return false;
    }
    if (!formData.items || formData.items.length < 1) {
      showError("At least 1 item is required");
      return false;
    }
    if (formData.items.some(it => !String(it).trim())) {
      showError("Items cannot be empty");
      return false;
    }
    const correct = formData.correctOrderIndexes || [];
    if (!correct || correct.length !== formData.items.length) {
      showError("Correct order must be set and include every item");
      return false;
    }
    if (!formData.marks && formData.marks !== 0) {
      showError("Marks is required");
      return false;
    }
    if (Number(formData.marks) < 0) {
      showError("Marks must be >= 0");
      return false;
    }
    if (Number(formData.negativeMarks) < 0) {
      showError("Negative marks cannot be negative");
      return false;
    }
    if (!formData.timeLimit || Number(formData.timeLimit) <= 0) {
      showError("Time limit must be greater than 0");
      return false;
    }
    return true;
  };

  // Convert time units to seconds (same logic you used)
  const timeInSeconds =
    formData.timeUnit === "minutes"
      ? Number(formData.timeLimit) * 60
      : formData.timeUnit === "hours"
      ? Number(formData.timeLimit) * 3600
      : Number(formData.timeLimit);

  const handleSave = async () => {
    if (!validateForm()) return;

    // Build payload matching backend route expectations:
    // items: [{ value }]
    // correct_item_indexes: [ ... ] (0-based indexes corresponding to items order)
    const payload = {
      title: formData.title,
      prompt: formData.prompt,
      items: (formData.items || []).map(v => ({ value: v })),
      correct_item_indexes: formData.correctOrderIndexes || [],
      is_drag_and_drop: !!formData.isDragAndDrop,
      marks: Number(formData.marks),
      negative_marks: Number(formData.negativeMarks || 0),
      difficulty_level: formData.difficulty,
      explanation: formData.explanation,
      tags: (formData.tags || "").split(",").map(t => t.trim()).filter(Boolean),
      time_limit: timeInSeconds,
      topic: formData.topic,
      subtopic: formData.subtopic,
    };

    try {
      setLoading(true);
      const res = await privateAxios.post(`/course-rearranges/units/${unitId}/rearrange`, payload);
      setLoading(false);
      if (res.data?.success) {
        showSuccess(res.data.message || "Rearrange saved");
        // you might want to do additional logic here e.g. navigate or reset
        console.log("Rearrange saved:", res.data.data);
      } else {
        showError(res.data?.message || "Save failed");
      }
    } catch (err) {
      setLoading(false);
      console.error("Error saving rearrange:", err);
      showError(err?.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    if (setSaveRef) setSaveRef(handleSave);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData]);

  const getTagsArray = () => (formData.tags || "").split(",").map(tag => tag.trim()).filter(tag => tag.length > 0);

  return (
    <div className="relative">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create New Rearrange Question</h1>

        <div className="space-y-6">
          {/* Topic & Subtopic */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SearchableDropdown
              label="Topic"
              value={formData.topic}
              options={TOPICS}
              placeholder="Select topic"
              dropdownKey="topic"
            />
            <SearchableDropdown
              label="Subtopic"
              value={formData.subtopic}
              options={formData.topic ? (subtopics[formData.topic] || []) : []}
              placeholder="Select subtopic"
              dropdownKey="subtopic"
            />
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter question title"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors"
            />
          </div>

          {/* Prompt */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Prompt</label>
            <textarea
              value={formData.prompt}
              onChange={(e) => handleInputChange("prompt", e.target.value)}
              placeholder="Enter the prompt/instructions for reordering..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors resize-none"
            />
          </div>

          {/* Items list with reorder controls */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">Items (drag/reorder)</label>
              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={addItem}
                  className="flex items-center space-x-1 px-3 py-1 bg-[#4CA466] text-white rounded-md hover:bg-[#3d8a54] transition-colors text-sm"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Item</span>
                </button>

                <button
                  type="button"
                  onClick={captureCorrectOrder}
                  className="px-3 py-1 border rounded-md text-sm bg-white hover:bg-gray-50"
                >
                  Capture Correct Order
                </button>

                <button
                  type="button"
                  onClick={() => { setFormData(prev => ({ ...prev, isDragAndDrop: !prev.isDragAndDrop })); }}
                  className={`px-3 py-1 border rounded-md text-sm ${formData.isDragAndDrop ? "bg-[#4CA466] text-white" : "bg-white"}`}
                >
                  {formData.isDragAndDrop ? "Drag & Drop" : "List Mode"}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {(formData.items || []).map((item, idx) => (
                <div key={idx} className="flex items-center space-x-3 group">
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => moveItem(idx, -1)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Move up"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveItem(idx, +1)}
                      className="p-2 hover:bg-gray-100 rounded"
                      title="Move down"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </button>
                  </div>

                  <input
                    type="text"
                    value={item}
                    onChange={(e) => {
                      const items = [...(formData.items || [])];
                      items[idx] = e.target.value;
                      setFormData(prev => ({ ...prev, items }));
                    }}
                    placeholder={`Item ${idx + 1}`}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors"
                  />

                  <button
                    type="button"
                    onClick={() => removeItem(idx)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Correct order editor */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">Correct Order</div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={toggleEditCorrectOrder}
                    className={`px-3 py-1 border rounded-md text-sm ${isEditingCorrectOrder ? "bg-[#4CA466] text-white" : "bg-white"}`}
                  >
                    {isEditingCorrectOrder ? "Finish" : "Edit"}
                  </button>
                  <button
                    type="button"
                    onClick={clearCorrectOrder}
                    className="px-3 py-1 border rounded-md text-sm bg-white hover:bg-gray-50"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {(formData.correctOrderIndexes || []).length === 0 && (
                  <div className="text-sm text-gray-500">No correct order set. Capture or edit to set one.</div>
                )}

                {(formData.items || []).map((it, idx) => {
                  // find position in correctOrderIndexes if present
                  const pos = (formData.correctOrderIndexes || []).indexOf(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => { if (isEditingCorrectOrder) handlePickCorrectIndex(idx); }}
                      className={`inline-flex items-center px-3 py-1 rounded-full border text-sm ${
                        pos === -1 ? "bg-white text-gray-700" : "bg-[#4CA466] text-white"
                      }`}
                    >
                      <span className="mr-2 font-semibold">{pos === -1 ? idx + 1 : pos + 1}.</span>
                      <span className="max-w-xs truncate">{it}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Scoring & Difficulty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
              <input
                type="number"
                value={formData.marks}
                onChange={(e) => handleInputChange("marks", e.target.value)}
                placeholder="Points"
                min="0"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Negative Marks</label>
              <input
                type="number"
                value={formData.negativeMarks}
                onChange={(e) => handleInputChange("negativeMarks", e.target.value)}
                placeholder="Penalty"
                min="0"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors"
              />
            </div>

            <SearchableDropdown
              label="Difficulty Level"
              value={formData.difficulty}
              options={difficulties}
              placeholder="Select difficulty"
              dropdownKey="difficulty"
            />
          </div>

          {/* Time Limit */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Time Limit</label>
            <div className="flex space-x-3">
              <input
                type="number"
                value={formData.timeLimit}
                onChange={(e) => handleInputChange("timeLimit", e.target.value)}
                placeholder="Duration"
                min="1"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors"
              />
              <select
                value={formData.timeUnit}
                onChange={(e) => handleInputChange("timeUnit", e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors"
              >
                <option value="seconds">Seconds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>
            </div>
          </div>

          {/* Explanation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Explanation</label>
            <textarea
              value={formData.explanation}
              onChange={(e) => handleInputChange("explanation", e.target.value)}
              placeholder="Provide explanation for the correct sequence..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors resize-none"
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
            <input
              type="text"
              value={formData.tags}
              onChange={(e) => handleInputChange("tags", e.target.value)}
              placeholder="Enter tags separated by commas (e.g., steps, sorting)"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors"
            />
            {getTagsArray().length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {getTagsArray().map((tag, index) => (
                  <span key={index} className="px-3 py-1 bg-[#4CA466]/10 text-[#4CA466] rounded-full text-sm font-medium border border-[#4CA466]/20">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="w-10 h-10 text-white animate-spin" />
            <span className="text-white text-lg font-medium">Saving...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddRearrangeForm;
