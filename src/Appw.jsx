

// src/App.jsx
import React, { useState } from "react";
// import MarkdownRenderer from "./components/MarkdownRenderer";
import MarkdownRenderer from "./utils/MDR";
export default function App() {
  const [markdown, setMarkdown] = useState(`# Hello Markdown!

Type **Markdown** on the left, see preview on the right.

- Supports lists
- **Bold** and *italic*
- \`inline code\`

\`\`\`js
console.log("Code block!");
\`\`\`
`);

  return (
    <div className="flex h-screen">
      {/* Left: Editor */}
      <div className="w-1/2 p-4 border-r border-gray-300">
        <textarea
          value={markdown}
          onChange={(e) => setMarkdown(e.target.value)}
          className="w-full h-full p-3 border rounded font-mono text-sm focus:outline-none"
          placeholder="Type your markdown here..."
        />
      </div>

      {/* Right: Preview */}
      <div className="w-1/2 p-4 overflow-auto bg-gray-50">
        <MarkdownRenderer text={markdown} />
      </div>
    </div>
  );
}
