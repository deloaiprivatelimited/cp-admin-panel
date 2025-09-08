import React, { useEffect, useState } from "react";
// import { getUnitContent, updateUnitContent } from "@/services/unitContent"; // adjust path
import { getUnitContent,updateUnitContent } from "./unitServices";
import { showError,showSuccess } from "../../../../../utils/toast";
// import MarkdownRenderer from "../../../../../utils/MarkDownRender";
import MarkdownRenderer from "../../../../../utils/MDR";
function TextBuilder({ unitID }) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Fetch unit content on mount
  useEffect(() => {
    async function fetchContent() {
      try {
        setLoading(true);
        const res = await getUnitContent(unitID);
        if (res.success) {
          setText(res.data.content ?? "");
        } else {
          showError(res.message || "Failed to load content");
        }
      } catch (err) {
        showError("Error fetching content");
      } finally {
        setLoading(false);
      }
    }

    if (unitID) {
      fetchContent();
    }
  }, [unitID]);

  // Save handler
  const handleSave = async () => {
    try {
      setSaving(true);
      const res = await updateUnitContent(unitID, text);
      if (!res.success) {
        showError(res.message || "Failed to save content");
      }
      showSuccess(res.message || "Content saved");
    } catch (err) {
      showError("Error saving content");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">Loading content...</div>;
  }

  return (
    <div className="bg-gray-50 p-6">
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 h-[calc(100vh-200px)]">
        {/* Left Side - Editor */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 flex flex-col">
          <div className="bg-[#4CA466] text-white px-6 py-3 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Editor</h2>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-white text-[#4CA466] px-3 py-1 rounded shadow hover:bg-gray-100 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
          <div className="p-6 flex-1">
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-full resize-none border-0 outline-none text-gray-700 font-mono text-sm leading-relaxed"
              placeholder="Start typing your content here..."
            />
          </div>
        </div>

        {/* Right Side - Preview */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-[#4CA466] text-white px-6 py-3 border-b">
            <h2 className="text-lg font-semibold">Live Preview</h2>
          </div>
          <div className="p-6 h-full overflow-y-auto">
            <div className="prose prose-gray max-w-none">
              <pre className="whitespace-pre-wrap text-gray-700 text-sm leading-relaxed font-sans">
                <MarkdownRenderer text={text || "Nothing to preview"}/>
              </pre>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 text-red-500 text-sm font-medium">{error}</div>
      )}
    </div>
  );
}

export default TextBuilder;
