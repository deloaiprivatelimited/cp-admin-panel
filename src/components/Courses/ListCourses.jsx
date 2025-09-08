import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Edit, Trash2, Settings, Loader2 } from "lucide-react";
import AddCourseModal from "./components/AddCourse";
import { privateAxios } from "../../utils/axios";
import useDebounce from "../../utils/useDebounce";
import EditCourseModal from "./components/EditCourse";
import { useNavigate } from "react-router-dom";
import MarkdownRenderer from "../../utils/MarkDownRender";
const ListCourses = () => {
    const navigate = useNavigate()
  const [courses, setCourses] = useState([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, per_page: 12, pages: 1, has_next: false, has_prev: false });
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedQ = useDebounce(searchQuery, 350);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(false); // lightweight spinner for pagination/search fetches
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
const [editOpen, setEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleEdit = (courseId) => {
    setEditingId(courseId);
    setEditOpen(true);
  };

  const handleUpdated = (updated) => {
    // Optimistically update the list without a full refetch
    setCourses((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
  };

  // Fetch courses from API
  const fetchCourses = async ({ page = 1, per_page = meta.per_page, q = debouncedQ } = {}) => {
    try {
      setError("");
      // first load -> skeletons; subsequent -> light spinner
      setFetching(true);
      const { data } = await privateAxios.get("/courses/", {
        params: { page, per_page, q: q?.trim() || "" },
      });

      if (data?.success) {
        const payload = data.data || {};
        const items = Array.isArray(payload.items) ? payload.items : [];
        setCourses(items);
        if (payload.meta) setMeta(payload.meta);
      } else {
        setError(data?.message || "Failed to fetch courses");
      }
    } catch (err) {
      const apiMsg = err?.response?.data?.message || err?.message || "Something went wrong";
      setError(apiMsg);
    } finally {
      setIsLoading(false);
      setFetching(false);
    }
  };

  // Initial load
  useEffect(() => {
    setIsLoading(true);
    fetchCourses({ page: 1, per_page: meta.per_page, q: "" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // React to debounced search
  useEffect(() => {
    // reset to page 1 when searching
    fetchCourses({ page: 1, per_page: meta.per_page, q: debouncedQ });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQ]);

  // Pagination
  const gotoPage = (page) => {
    if (page < 1 || page > meta.pages) return;
    fetchCourses({ page, per_page: meta.per_page, q: debouncedQ });
  };


  const handleCourseBuilder = (courseId) => {
    navigate(`/courses/chapter-builder/${courseId}/edit`)
    // navigate to builder page (stub)
    console.log("Course builder for:", courseId);
  };

  const handleDelete = async (courseId) => {
    if (!confirm("Delete this course? This action cannot be undone.")) return;
    // optimistic UI
    const prev = courses;
    setCourses((p) => p.filter((c) => c.id !== courseId));
    try {
      await privateAxios.delete(`/courses/${courseId}`);
      // refetch meta to keep counts in sync
      await fetchCourses({ page: meta.page, per_page: meta.per_page, q: debouncedQ });
    } catch (err) {
      setCourses(prev);
      const apiMsg = err?.response?.data?.message || err?.message || "Delete failed";
      setError(apiMsg);
    }
  };

  const handleAddCourse = () => setIsModalOpen(true);

  const handleCreated = (created) => {
    // Optimistic prepend — also optionally refetch to sync meta
    setCourses((prev) => [created, ...prev]);
    setMeta((m) => ({ ...m, total: (m.total || 0) + 1 }));
  };

  const pagesArray = useMemo(() => {
    const pages = meta.pages || 1;
    const curr = meta.page || 1;
    const windowSize = 5;
    let start = Math.max(1, curr - Math.floor(windowSize / 2));
    let end = Math.min(pages, start + windowSize - 1);
    start = Math.max(1, Math.min(start, end - windowSize + 1));
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [meta.page, meta.pages]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:space-x-4 gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, tagline, or description..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CA466] focus:border-transparent transition-all duration-200"
            />
            {fetching && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="w-5 h-5 animate-spin text-gray-400" />
              </div>
            )}
          </div>

          <button
            onClick={handleAddCourse}
            className="inline-flex items-center justify-center px-6 py-3 bg-[#4CA466] text-white font-medium rounded-lg hover:bg-[#3d8a56] focus:outline-none focus:ring-2 focus:ring-[#4CA466] transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Course
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Skeletons for first load */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(meta.per_page || 12)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200" />
                <div className="p-4 space-y-2">
                  <div className="h-6 bg-gray-200 rounded" />
                  <div className="h-4 bg-gray-200 rounded w-2/3" />
                  <div className="h-16 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Grid */}
        {!isLoading && courses.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200 overflow-hidden group"
                >
                  <div className="relative">
                    {course.thumbnail_url ? (
                      <img src={course.thumbnail_url} alt={course.name} className="w-full h-48 object-contain" />
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}

                    <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button
                        onClick={() => handleEdit(course.id)}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-[#4CA466] hover:bg-white transition-all duration-200 shadow-sm"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleCourseBuilder(course.id)}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-[#4CA466] hover:bg-white transition-all duration-200 shadow-sm"
                        title="Builder"
                      >
                        <Settings className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(course.id)}
                        className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-200 shadow-sm"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="p-4">
<h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
  <MarkdownRenderer
    text={course.name || "Untitled Course"}
    useTerminalForCode={false}
    className="!text-lg !font-bold !text-gray-900"
  />
</h3>
                    {course.tagline && <p className="text-[#4CA466] font-medium text-sm mb-2 line-clamp-1">
                      <MarkdownRenderer text={course.tagline} useTerminalForCode={false} />
                    </p>}
                    {course.description && <p className="text-gray-600 text-sm line-clamp-3">
                      <MarkdownRenderer text={course.description} useTerminalForCode={false} />
                    </p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6">
              <p className="text-sm text-gray-600">
                Showing page <span className="font-medium">{meta.page}</span> of{" "}
                <span className="font-medium">{meta.pages}</span> — total{" "}
                <span className="font-medium">{meta.total}</span> courses
              </p>

              <div className="inline-flex items-center gap-1">
                <button
                  onClick={() => gotoPage(meta.page - 1)}
                  disabled={!meta.has_prev}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white disabled:opacity-50"
                >
                  Prev
                </button>

                {pagesArray.map((p) => (
                  <button
                    key={p}
                    onClick={() => gotoPage(p)}
                    className={`px-3 py-2 text-sm rounded-lg border ${
                      p === meta.page ? "bg-[#4CA466] text-white border-[#4CA466]" : "border-gray-200 bg-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  onClick={() => gotoPage(meta.page + 1)}
                  disabled={!meta.has_next}
                  className="px-3 py-2 text-sm rounded-lg border border-gray-200 bg-white disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}

        {/* Empty State */}
        {!isLoading && courses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {debouncedQ ? "No courses found" : "No courses available"}
            </h3>
            <p className="text-gray-600">
              {debouncedQ ? `No courses match "${debouncedQ}"` : "Start by adding your first course"}
            </p>
          </div>
        )}
      </div>
<EditCourseModal
        open={editOpen}
        courseId={editingId}
        onClose={() => setEditOpen(false)}
        onUpdated={handleUpdated}
      />
      {/* Add Course Modal */}
      <AddCourseModal open={isModalOpen} onClose={() => setIsModalOpen(false)} onCreated={handleCreated} />
    </div>
  );
};

export default ListCourses;
