import React from "react";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
// import MarkdownRenderer from "../../../utils/MarkDownRender";
import MarkdownRenderer from "../../../../../../utils/MarkDownRender";
const renderMarkdownSafe = (content, fallback = "") => {
  if (content == null) return fallback;
  if (typeof content === "string") return content;
  if (typeof content === "object") return content.value ?? fallback;
  return String(content);
};

const RearrangePreview = ({ formData }) => {
  const getTagsArray = () =>
    (formData.tags || "").split(",").map(t => t.trim()).filter(Boolean);

  const items = formData.items || [];
  const correctIdxs = formData.correctOrderIndexes || [];

  // Build a readable correct-order list of values (if available)
  const correctOrderValues = correctIdxs.map(i => {
    const item = items[i];
    if (item === undefined) return `Item ${i + 1}`;
    return renderMarkdownSafe(item, `Item ${i + 1}`);
  });

  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      <h1 className="text-3xl font-bold text-gray-800 text-center">Live Preview</h1>

      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold text-gray-800">
   <MarkdownRenderer
                text={renderMarkdownSafe(formData.title || "Rearrange Title")}
                className="!text-lg !font-semibold !text-gray-800"
                useTerminalForCode={false}
              />          </h3>

          {formData.difficulty && (
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                formData.difficulty === "Easy"
                  ? "bg-green-100 text-green-800"
                  : formData.difficulty === "Medium"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {formData.difficulty}
            </span>
          )}
        </div>

        {/* Prompt */}
        <div className="mb-3">
          {formData.prompt ? (
                       <MarkdownRenderer text={renderMarkdownSafe(formData.prompt)} />

          ) : (
            <p className="text-gray-500">Prompt / instructions will appear here...</p>
          )}
        </div>

        {/* Tags */}
        {getTagsArray().length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {getTagsArray().map((tag, idx) => (
              <span
                key={idx}
                className="px-3 py-1 bg-[#4CA466]/10 text-[#4CA466] rounded-full text-sm font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Compact metadata */}
        <div className="flex flex-wrap gap-3 text-sm font-medium">
          <span className={`px-2 py-1 rounded ${formData.marks > 0 ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"}`}>
            ✅ {formData.marks || 0} Marks
            {formData.negativeMarks ? <span className="text-red-600 ml-1">(-{formData.negativeMarks})</span> : null}
          </span>

          {formData.timeLimit ? (
            <span className="px-2 py-1 rounded bg-blue-100 text-blue-800">
              ⏱ {formData.timeLimit} {formData.timeUnit || "sec"}
            </span>
          ) : null}

          <span className="px-2 py-1 rounded bg-gray-100 text-gray-700">
            {formData.isDragAndDrop ? "Drag & Drop" : "List Mode"}
          </span>
        </div>
      </div>

      {/* Items (current order shown) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-800">Items (Current order shown)</h4>
          <span className="text-sm text-gray-500">{items.length} items</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
          {items.map((it, idx) => (
            <div key={idx} className="flex items-start space-x-3 p-3 rounded-lg bg-gray-50">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-semibold text-gray-700">
                {idx + 1}
              </div>

              <div className="text-gray-800 flex-1">
                              <MarkdownRenderer text={renderMarkdownSafe(it, `Item ${idx + 1}`)} />

              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Correct Order */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-gray-800">Correct Order</h4>
          <span className="text-sm text-gray-500">
            {correctIdxs.length === 0 ? "Not set" : `${correctIdxs.length} positions`}
          </span>
        </div>

        {correctIdxs.length === 0 ? (
          <div className="p-4 bg-yellow-50 text-yellow-800 rounded-lg">No correct order set. Use "Capture" or "Edit" to define it.</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {correctOrderValues.map((val, pos) => (
              <div key={pos} className="inline-flex items-center px-3 py-1 rounded-full border bg-white text-sm">
                <span className="mr-2 font-semibold">{pos + 1}.</span>
                  <MarkdownRenderer text={String(val)} useTerminalForCode={false} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Explanation */}
      {formData.explanation && (
        <div className="p-4 bg-blue-50 rounded-lg">
          <h4 className="font-medium text-blue-800 mb-2">Explanation</h4>
                   <MarkdownRenderer text={renderMarkdownSafe(formData.explanation)} />

        </div>
      )}
    </div>
  );
};

export default RearrangePreview;
