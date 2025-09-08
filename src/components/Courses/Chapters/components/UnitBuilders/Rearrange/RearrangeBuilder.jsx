import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "katex/dist/katex.min.css";

// import your rearrange form & preview (adjust paths if needed)
// import AddRearrangeForm from "./AddRearrangeForm";
import AddRearrangeForm from "./AddRearrangeForm";
import RearrangePreview from "./RearrangePreview";

const RearrangeBuilder = ({unitId}) => {
  const navigate = useNavigate();

  const defaultFormData = {
    title: "",
    topic: "",
    subtopic: "",
    prompt: "",
    items: ["", ""],             // at least 1 item; start with 2 for convenience
    correctOrderIndexes: [],     // indexes into `items` representing correct order
    isDragAndDrop: true,
    marks: "1",
    negativeMarks: "0",
    difficulty: "Easy",
    explanation: "",
    tags: "",
    timeLimit: "60",
    timeUnit: "seconds",
  };

  const [formData, setFormData] = useState(defaultFormData);

  // Reset handler
  const handleReset = () => {
    setFormData(defaultFormData);
  };

  // same pattern as your MCQ builder — parent receives save function via setSaveRef
  let saveRef = null;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="px-6 h-16 flex items-center justify-between">
          <div className="flex items-center">
        </div>

          {/* Action Buttons in header */}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleReset}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Reset
            </button>
            <button
              onClick={() => saveRef && saveRef()}
              className="px-4 py-2 bg-[#4CA466] text-white rounded-lg hover:bg-[#3d8a54] shadow"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      {/* Two-pane layout below the header */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2">
        {/* Form Pane */}
        <div
          className="p-6 bg-gray-50 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 64px)" }}
        >
          <AddRearrangeForm
          unitId={unitId}
            formData={formData}
            setFormData={setFormData}
            setSaveRef={(fn) => (saveRef = fn)}
          />
        </div>

        {/* Preview Pane */}
        <div
          className="p-6 bg-gray-100 overflow-y-auto"
          style={{ maxHeight: "calc(100vh - 64px)" }}
        >
          <RearrangePreview formData={formData} />
        </div>
      </div>
    </div>
  );
};

export default RearrangeBuilder;
