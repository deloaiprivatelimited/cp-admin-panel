import React, { useState } from 'react';
import { Plus, X, ChevronDown ,Loader2} from 'lucide-react';
import "katex/dist/katex.min.css";
import { showSuccess,showError } from '../../../utils/toast';
import { privateAxios } from '../../../utils/axios';
const AddQuestionForm = ({ formData, setFormData, setSaveRef }) => {
  const [dropdownStates, setDropdownStates] = useState({
    topic: false,
    subtopic: false,
    difficulty: false
  });
  const [Loading, setLoading] = useState(false);

  const topics = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Computer Science'];
  const subtopics = {
    Mathematics: ['Algebra', 'Geometry', 'Calculus'],
    Physics: ['Mechanics', 'Thermodynamics', 'Optics'],
    Chemistry: ['Organic', 'Inorganic', 'Physical'],
    Biology: ['Genetics', 'Cell Biology'],
    'Computer Science': ['Programming', 'Data Structures']
  };
  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleInputChange = (field, value) => setFormData(prev => ({ ...prev, [field]: value }));
  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData(prev => ({ ...prev, options: newOptions }));
  };
  const addOption = () => setFormData(prev => ({ ...prev, options: [...prev.options, ''] }));
  const removeOption = (index) => {
    if (formData.options.length > 2) {
      const newOptions = formData.options.filter((_, i) => i !== index);
      const newCorrectAnswers = formData.correctAnswers
        .filter(i => i !== index)
        .map(i => (i > index ? i - 1 : i));
      setFormData(prev => ({ ...prev, options: newOptions, correctAnswers: newCorrectAnswers }));
    }
  };
  const handleCorrectAnswerToggle = (index) => {
    if (formData.isMultipleCorrect) {
      const newCorrectAnswers = formData.correctAnswers.includes(index)
        ? formData.correctAnswers.filter(i => i !== index)
        : [...formData.correctAnswers, index];
      setFormData(prev => ({ ...prev, correctAnswers: newCorrectAnswers }));
    } else {
      setFormData(prev => ({ ...prev, correctAnswers: [index] }));
    }
  };
  const handleMultipleCorrectToggle = () =>
    setFormData(prev => ({ ...prev, isMultipleCorrect: !prev.isMultipleCorrect, correctAnswers: [] }));

  const toggleDropdown = (dropdown) => setDropdownStates(prev => ({ ...prev, [dropdown]: !prev[dropdown] }));
  const selectDropdownValue = (dropdown, value) => {
    setFormData(prev => ({ ...prev, [dropdown]: value, ...(dropdown === 'topic' ? { subtopic: '' } : {}) }));
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
          <span className={value ? 'text-gray-800' : 'text-gray-500'}>
            {value || placeholder}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${dropdownStates[dropdownKey] ? 'rotate-180' : ''}`} />
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
   // 🔹 Form Validation
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
  if (!formData.questionText?.trim()) {
    showError("Question text is required");
    return false;
  }
  if (formData.options.length < 2) {
    showError("At least 2 options are required");
    return false;
  }
  if (formData.options.some(opt => !opt.trim())) {
    showError("Options cannot be empty");
    return false;
  }
  if (formData.correctAnswers.length === 0) {
    showError("Select at least one correct answer");
    return false;
  }
  if (!formData.marks || formData.marks < 0) {
    showError("Marks must be greater than or equal to 0");
    return false;
  }
  if (formData.negativeMarks < 0) {
    showError("Negative marks cannot be negative");
    return false;
  }
  if (!formData.timeLimit || formData.timeLimit <= 0) {
    showError("Time limit must be greater than 0");
    return false;
  }

  return true; // ✅ form is valid
};
// Convert timeLimit + timeUnit into seconds
const timeInSeconds =
  formData.timeUnit === "minutes"
    ? Number(formData.timeLimit) * 60
    : formData.timeUnit === "hours"
    ? Number(formData.timeLimit) * 3600
    : Number(formData.timeLimit); // default seconds


  const handleSave =  async () => {
      if (!validateForm()) {
      return;
    }
     const payload = {
      title: formData.title,
      question_text: formData.questionText,
      options: formData.options.map(opt => ({ value: opt })), // backend expects [{id,value}], id auto from Mongo
      correct_options: formData.correctAnswers.map(i => formData.options[i]), // indexes → values
      is_multiple: formData.isMultipleCorrect,
      marks: Number(formData.marks),
      negative_marks: Number(formData.negativeMarks),
      difficulty_level: formData.difficulty,
      explanation: formData.explanation,
      tags: formData.tags.split(",").map(tag => tag.trim()).filter(Boolean),
      time_limit: timeInSeconds,   // ✅ always in seconds
      topic: formData.topic,
      subtopic: formData.subtopic
    };
    try {
    setLoading(true);

    const res = await privateAxios.post("/mcqs/", payload);

    setLoading(false);

    if (res.data.success) {
      showSuccess(res.data.message || "MCQ saved successfully!");
      console.log("MCQ saved:", res.data.data);
    } else {
      showError(res.data.message || "MCQ saved successfully!");
    }
  } catch (err) {
    setLoading(false);
    console.error("Error saving MCQ:", err);
    showError("Something Went Wrong")
  }
  };
    React.useEffect(() => {
    if (setSaveRef) setSaveRef(handleSave);
  }, [formData]);

  const getTagsArray = () => formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0);

  return (
  <div className="relative">

    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Create New MCQ</h1>

      <div className="space-y-6">
        {/* Topic & Subtopic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchableDropdown
            label="Topic"
            value={formData.topic}
            options={topics}
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
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter question title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors"
          />
        </div>

        {/* Question Text */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Question Text</label>
          <textarea
            value={formData.questionText}
            onChange={(e) => handleInputChange('questionText', e.target.value)}
            placeholder="Enter your question here..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors resize-none"
          />
        </div>

        {/* Options */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <label className="block text-sm font-medium text-gray-700">Answer Options</label>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="multipleCorrect"
                  checked={formData.isMultipleCorrect}
                  onChange={handleMultipleCorrectToggle}
                  className="w-4 h-4 text-[#4CA466] border-gray-300 rounded focus:ring-[#4CA466]"
                />
                <label htmlFor="multipleCorrect" className="text-sm text-gray-700">Multiple correct</label>
              </div>
              <button
                type="button"
                onClick={addOption}
                className="flex items-center space-x-1 px-3 py-1 bg-[#4CA466] text-white rounded-md hover:bg-[#3d8a54] transition-colors text-sm"
              >
                <Plus className="w-4 h-4" />
                <span>Add Option</span>
              </button>
            </div>
          </div>

          <div className="space-y-3">
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-3 group">
                <input
                  type={formData.isMultipleCorrect ? "checkbox" : "radio"}
                  name="correctAnswer"
                  checked={formData.correctAnswers.includes(index)}
                  onChange={() => handleCorrectAnswerToggle(index)}
                  className="w-4 h-4 text-[#4CA466] border-gray-300 focus:ring-[#4CA466] flex-shrink-0"
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors"
                />
                {formData.options.length > 2 && (
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Scoring & Difficulty */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Marks</label>
            <input
              type="number"
              value={formData.marks }
              onChange={(e) => handleInputChange('marks', e.target.value)}
              placeholder="Points"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Negative Marks</label>
            <input
              type="number"
              value={formData.negativeMarks }
              onChange={(e) => handleInputChange('negativeMarks', e.target.value)}
              placeholder="Penalty"
              min="0"
              step="0.1"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors"
            />
          </div>
          <SearchableDropdown
            label="Difficulty Level"
            value={formData.difficulty }
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
              value={formData.timeLimit }
              onChange={(e) => handleInputChange('timeLimit', e.target.value)}
              placeholder="Duration"
              min="1"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors"
            />
            <select
              value={formData.timeUnit}
              onChange={(e) => handleInputChange('timeUnit', e.target.value)}
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
                        onChange={(e) => handleInputChange('explanation', e.target.value)}
                        placeholder="Provide detailed explanation for the correct answer..."
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
                        onChange={(e) => handleInputChange('tags', e.target.value)}
                        placeholder="Enter tags separated by commas (e.g., algebra, equations, math)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#4CA466] focus:border-[#4CA466] transition-colors"
                      />
                      {getTagsArray().length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {getTagsArray().map((tag, index) => (
                            <span
                              key={index}
                              className="px-3 py-1 bg-[#4CA466]/10 text-[#4CA466] rounded-full text-sm font-medium border border-[#4CA466]/20"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
      
             
      </div>
    </div>
     {Loading && (
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

export default AddQuestionForm;

