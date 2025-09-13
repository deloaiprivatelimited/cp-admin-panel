import React from 'react';
// import MarkdownRenderer from '../../../utils/MarkDownRender';
import "katex/dist/katex.min.css";
import MarkdownRenderer from '../../../../../../../utils/MarkDownRender';
const QuestionPreview = ({ formData }) => {
  const getTagsArray = () =>
    (formData.tags || '').split(',').map(tag => tag.trim()).filter(Boolean);

  // normalize option object shape
  const normalizedOptions = (formData.options || []).map((opt, idx) =>
    typeof opt === 'string'
      ? { option_id: null, value: opt, images: [] } // no id when string
      : { option_id: opt.option_id || null, value: opt.value || '', images: opt.images || [] }
  );

  // determine if correctAnswers are ids (strings) or indexes (numbers)
  const correctAnswers = formData.correctAnswers || [];
  const correctAreIds = correctAnswers.length > 0 && typeof correctAnswers[0] === 'string';

  const isOptionCorrect = (opt, idx) => {
    if (correctAreIds) {
      // if option has id, use it; otherwise can't match
      return opt.option_id && correctAnswers.includes(opt.option_id);
    } else {
      return correctAnswers.includes(idx);
    }
  };

  const renderImageGrid = (images = [], purpose = 'image') => {
    if (!images?.length) return null;
    return (
      <div className="flex flex-wrap gap-3 mt-3">
        {images.map((img, i) => (
          <div key={img.image_id || `${purpose}-${i}`} className="w-36 border rounded p-2 flex flex-col items-start">
            <img src={img.url} alt={img.alt_text || img.label || `image-${i}`} className="w-32 h-20 object-cover rounded" />
            <div className="w-full mt-2">
              <div className="text-xs font-medium text-gray-700 truncate">{img.label || <span className="text-gray-400">No label</span>}</div>
            </div>
            <div className="w-full flex items-center justify-between mt-1 text-xs text-gray-500">
              <div>{(img.metadata && img.metadata.size) ? `${Math.round((img.metadata.size/1024))} KB` : null}</div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // time display: prefer provided unit, else show raw
  const renderTime = () => {
    if (!formData.timeLimit) return null;
    if (formData.timeUnit) {
      return `${formData.timeLimit} ${formData.timeUnit}`;
    }
    return `${formData.timeLimit} sec`;
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold text-gray-800 text-center">Live Preview</h1>

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex-1 pr-4">
            <MarkdownRenderer text={formData.title || "Question Title"} className="text-2xl font-bold text-gray-900" />
          </div>

          {formData.difficulty && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              formData.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
              formData.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {formData.difficulty}
            </span>
          )}
        </div>

        {/* Question Text */}
        <div className="mb-3">
          {formData.questionText ? (
            <MarkdownRenderer text={formData.questionText} />
          ) : (
            <p className="text-gray-500">Your question text will appear here...</p>
          )}

          {/* question-level images */}
          {renderImageGrid(formData.questionImages)}
        </div>

        {/* Tags */}
        {getTagsArray().length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {getTagsArray().map((tag, index) => (
              <span key={index} className="px-3 py-1 bg-[#4CA466]/10 text-[#4CA466] rounded-full text-sm font-medium">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Compact Metadata */}
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          <span className={`px-2 py-1 rounded ${Number(formData.marks) > 0 ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
            ✅ {formData.marks || 0} Marks
            {formData.negativeMarks ? <span className="text-red-600 ml-1">(-{formData.negativeMarks})</span> : null}
          </span>

          {formData.timeLimit ? (
            <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">
              ⏱ {renderTime()}
            </span>
          ) : null}

          <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">
            {formData.isMultipleCorrect ? 'Multiple correct' : 'Single correct'}
          </span>
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-800">Answer Options:</h4>
          <span className="text-sm text-gray-500">
            {formData.isMultipleCorrect ? 'Multiple allowed' : 'Single only'}
          </span>
        </div>

        {normalizedOptions.map((opt, idx) => {
          const correct = isOptionCorrect(opt, idx);
          return (
            <div
              key={opt.option_id || idx}
              className={`flex flex-col p-3 rounded-lg ${correct ? 'bg-[#4CA466]/10' : 'bg-gray-50'}`}
            >
              <div className="flex items-center space-x-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
                  {String.fromCharCode(65 + idx)}
                </span>

                <div className="text-gray-800 flex-1">
                  <MarkdownRenderer text={opt.value || `Option ${idx + 1}`} />
                </div>

                {correct && (
                  <span className="text-[#4CA466] text-sm font-medium">✓</span>
                )}
              </div>

              {/* option images (thumbnails + label under each) */}
              {renderImageGrid(opt.images, `option-${idx}`)}
            </div>
          );
        })}
      </div>

      {/* Explanation */}
      {(formData.explanation || (formData.explanationImages && formData.explanationImages.length > 0)) && (
        <div className="p-4 bg-blue-50 rounded-lg">
          {formData.explanation ? <h4 className="font-medium text-blue-800 mb-2">Explanation:</h4> : null}
          {formData.explanation ? <MarkdownRenderer text={formData.explanation} className="prose max-w-none" /> : null}
          {/* explanation images */}
          {renderImageGrid(formData.explanationImages, 'explanation')}
        </div>
      )}
    </div>
  );
};

export default QuestionPreview;
