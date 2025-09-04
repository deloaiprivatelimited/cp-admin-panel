import React, { useEffect, useMemo, useState } from "react";
// import { privateAxios } from "../../utils/axios";
import { privateAxios } from "../../../utils/axios";
import { showError, showSuccess } from "../../../utils/toast";
import { useNavigate } from "react-router-dom";
const MCQ_BASE = "/mcqs"; // adjust if your blueprint is mounted elsewhere (e.g. "/api/mcq")

function ListMCQ() {
  // UI state
  const [mcqs, setMcqs] = useState([]);
  const [loading, setLoading] = useState(false);
const navigate = useNavigate();
  // Filters + pagination
  const [search, setSearch] = useState("");
  const [topic, setTopic] = useState("");
  const [subtopic, setSubtopic] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [page, setPage] = useState(1);
const [perPage, setPerPage] = useState(10);

  // Server meta
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [counts, setCounts] = useState({ Easy: 0, Medium: 0, Hard: 0, total: 0 });


const SUBTOPICS = {
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
    "Data Interpretation"
  ],
  "Logical Reasoning": [
    "Puzzles",
    "Seating Arrangement",
    "Blood Relations",
    "Coding-Decoding",
    "Syllogisms",
    "Direction Sense",
    "Series (Number/Alphabet)",
    "Clocks & Calendars"
  ],
  "Verbal Ability": [
    "Reading Comprehension",
    "Sentence Correction",
    "Fill in the Blanks",
    "Synonyms & Antonyms",
    "Paragraph Jumbles",
    "Critical Reasoning"
  ],
  "Operating Systems": [
    "Process Management",
    "CPU Scheduling",
    "Memory Management",
    "Deadlocks",
    "File Systems",
    "Concurrency & Synchronization"
  ],
  DBMS: [
    "ER Model",
    "Normalization",
    "SQL Queries",
    "Transactions",
    "Indexing",
    "Joins & Keys"
  ],
  "Computer Networks": [
    "OSI & TCP/IP Models",
    "IP Addressing",
    "Routing",
    "Switching",
    "Congestion Control",
    "Application Layer Protocols (HTTP, DNS, FTP)"
  ],
  Programming: [
    "C/C++ Basics",
    "Java Basics",
    "Python Basics",
    "OOP Concepts",
    "Exception Handling",
    "Standard Libraries"
  ],
  "Data Structures": [
    "Arrays",
    "Strings",
    "Linked List",
    "Stacks & Queues",
    "Trees",
    "Graphs",
    "Hashing",
    "Heaps"
  ],
  Algorithms: [
    "Sorting",
    "Searching",
    "Recursion & Backtracking",
    "Greedy Algorithms",
    "Dynamic Programming",
    "Graph Algorithms",
    "Divide & Conquer"
  ],
  "Software Engineering": [
    "SDLC Models",
    "Agile & Scrum",
    "Testing & Debugging",
    "Version Control (Git)"
  ],
  "System Design": [
    "Scalability Basics",
    "Load Balancing",
    "Caching",
    "Databases in Design",
    "High-Level Design Questions"
  ],
  "HR & Behavioral": [
    "Tell me about yourself",
    "Strengths & Weaknesses",
    "Teamwork",
    "Leadership",
    "Conflict Resolution",
    "Why should we hire you?"
  ]
};

const TOPICS = Object.keys(SUBTOPICS);
  const subtopicOptions = topic ? (SUBTOPICS[topic] || []) : [];

  // Debounce search
  const [searchInput, setSearchInput] = useState("");
  useEffect(() => {
    const id = setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => clearTimeout(id);
  }, [searchInput]);

  const params = useMemo(
    () => ({
      page,
      per_page: perPage,
      ...(search ? { search } : {}),
      ...(topic ? { topic } : {}),
      ...(subtopic ? { subtopic } : {}),
      ...(difficulty ? { difficulty_level: difficulty } : {}),
    }),
    [page, perPage, search, topic, subtopic, difficulty]
  );

  const getDifficultyColor = (lvl) => {
    switch (lvl) {
      case "Easy":
        return "bg-green-100 text-green-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const fetchMCQs = async () => {
    setLoading(true);
    try {
      const { data } = await privateAxios.get(MCQ_BASE + "/", { params });
      if (!data?.success) throw new Error(data?.message || "Failed to fetch MCQs");

      const payload = data.data;
      setMcqs(payload.mcqs || []);
      setPage(payload.page || 1);
      setTotal(payload.total || 0);
      setTotalPages(payload.total_pages || 1);
      setCounts(payload.counts || { Easy: 0, Medium: 0, Hard: 0, total: payload.total || 0 });
    } catch (e) {
      showError(e?.response?.data?.message || e.message || "Unable to fetch MCQs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMCQs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  const onDelete = async (id) => {
    if (!confirm("Delete this MCQ permanently?")) return;
    try {
      const { data } = await privateAxios.delete(`${MCQ_BASE}/${id}`);
      if (!data?.success) throw new Error(data?.message || "Failed to delete");
      showSuccess("MCQ deleted");
      // If last item on the page was removed, step back a page (if possible)
      if (mcqs.length === 1 && page > 1) setPage((p) => p - 1);
      else fetchMCQs();
    } catch (e) {
      showError(e?.response?.data?.message || e.message || "Delete failed");
    }
  };
  const getOptionLabel = (i) => String.fromCharCode(65 + i); // 0->A, 1->B...


  const startIdx = (page - 1) * perPage + 1;
  const endIdx = Math.min(page * perPage, total);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">MCQ Management</h1>
              <p className="mt-1 text-sm text-gray-600">Manage your multiple choice questions</p>
            </div>
            <button
             onClick={() => navigate("/questions/mcq/add")}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white shadow-sm"
              style={{ backgroundColor: "#4CA466" }}
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4"></path>
              </svg>
              Add New MCQ
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search Questions</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by question text..."
                  value={searchInput}
                  onChange={(e) => {
                    setPage(1);
                    setSearchInput(e.target.value);
                  }}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2"
                />
                <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </div>
            </div>

            {/* Topic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Topic</label>
              <select
                value={topic}
              onChange={(e) => {
  const next = e.target.value;
  setTopic(next);
  setSubtopic("");   // reset subtopic when topic changes
  setPage(1);
}}

                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2"
              >
               <option value="">All Topics</option>
  {TOPICS.map((t) => (
    <option key={t} value={t}>{t}</option>
  ))}
              </select>
            </div>

            {/* Subtopic */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtopic</label>
              <select
 value={subtopic}
  onChange={(e) => { setSubtopic(e.target.value); setPage(1); }}
  disabled={!topic}  // disable until a topic is chosen
  className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 disabled:opacity-60"
                 >
               {!topic ? (
    <option value="">Select a topic first</option>
  ) : (
    <>
      <option value="">All Subtopics</option>
      {subtopicOptions.map((st) => (
        <option key={st} value={st}>{st}</option>
      ))}
    </>
  )}
              </select>
            </div>

            {/* Difficulty */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={difficulty}
                onChange={(e) => {
                  setDifficulty(e.target.value);
                  setPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2"
              >
                <option value="">All Levels</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            {/* Per Page */}
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">Per Page</label>
  <select
    value={perPage}
    onChange={(e) => {
      setPerPage(Number(e.target.value));
      setPage(1); // reset to page 1 when perPage changes
    }}
    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2"
  >
    {[5, 10, 20, 50, 100].map((size) => (
      <option key={size} value={size}>
        {size}
      </option>
    ))}
  </select>
</div>

          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ backgroundColor: "#4CA466" }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2"></path>
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total MCQs</p>
                <p className="text-2xl font-semibold text-gray-900">{counts.total}</p>
              </div>
            </div>
          </div>

          {["Easy", "Medium", "Hard"].map((lvl) => (
            <div key={lvl} className="bg-white rounded-xl shadow-sm border p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gray-100">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">{lvl}</p>
                  <p className="text-2xl font-semibold text-gray-900">{counts[lvl] || 0}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* MCQ List */}
        <div className="bg-white rounded-xl shadow-sm border">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">Questions List</h2>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {loading ? "Loading…" : `Showing ${startIdx}-${endIdx} of ${total} results`}
                </span>
              </div>
            </div>
          </div>

          <div className="divide-y divide-gray-200">
            {loading && (
              <div className="p-6 text-sm text-gray-600">Fetching MCQs…</div>
            )}
            {!loading && mcqs.length === 0 && (
              <div className="p-6 text-sm text-gray-600">No MCQs found.</div>
            )}
            {!loading &&
              mcqs.map((mcq) => (
                <div key={mcq.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{mcq.title}</h3>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getDifficultyColor(
                            mcq.difficulty_level
                          )}`}
                        >
                          {mcq.difficulty_level || "—"}
                        </span>
                        {mcq.is_multiple && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Multiple Choice
                          </span>
                        )}
                      </div>

                      <p className="text-gray-700 mb-3 font-medium">{mcq.question_text}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-4">
                      {mcq.options?.map((option, idx) => {
    const label = getOptionLabel(idx);
    return (
      <div key={option.option_id ?? idx} className="flex items-center space-x-2">
        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border border-gray-300 text-xs font-semibold text-gray-700">
          {label}
        </span>
        <span className="text-sm text-gray-700">{option.value}</span>
      </div>
    );
  })}
                      </div>

                      <div className="flex items-center space-x-6 text-sm text-gray-600">
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5l7 7"></path>
                          </svg>
                          {mcq.topic}
                        </div>
                        {mcq.subtopic && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5l7 7"></path>
                            </svg>
                            {mcq.subtopic}
                          </div>
                        )}
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6m6 8V5"></path>
                          </svg>
                          {mcq.marks} marks
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-6">
                      <button
                        onClick={() => navigate(`/questions/mcq/${mcq.id}/edit`)}
                        className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M4 17l12.732-12.732"></path>
                        </svg>
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(mcq.id)}
                        className="inline-flex items-center px-3 py-1.5 border border-red-300 shadow-sm text-xs font-medium rounded-lg text-red-700 bg-white hover:bg-red-50"
                      >
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-1 12a2 2 0 01-2 2H8a2 2 0 01-2-2L5 7m5 4v6m4-6v6M9 7V4h6v3M4 7h16"></path>
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{startIdx || 0}</span> to{" "}
                <span className="font-medium">{endIdx || 0}</span> of{" "}
                <span className="font-medium">{total || 0}</span> results
              </div>
              <div className="flex items-center space-x-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Previous
                </button>
                {[...Array(Math.min(5, totalPages))].map((_, idx) => {
                  // simple window from current page
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const num = start + idx;
                  if (num > totalPages) return null;
                  const active = num === page;
                  return (
                    <button
                      key={num}
                      onClick={() => setPage(num)}
                      className={`relative inline-flex items-center px-3 py-2 border text-sm font-medium rounded-lg ${
                        active
                          ? "text-white"
                          : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                      }`}
                      style={active ? { backgroundColor: "#4CA466", borderColor: "#4CA466" } : {}}
                    >
                      {num}
                    </button>
                  );
                })}
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListMCQ;
