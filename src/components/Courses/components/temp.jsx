import React, { useEffect, useMemo, useState } from "react";
import { Search, Plus, Edit, Trash2, Settings, X } from "lucide-react";
// ⬇️ Update the import path to wherever you export the axios instances shown in your message
import { privateAxios } from "../services/api"; // <-- adjust path

const AddCourseModal = ({ open, onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName("");
      setTagline("");
      setDescription("");
      setError("");
      setSubmitting(false);
    }
  }, [open]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    try {
      setSubmitting(true);
      const payload = { name: name.trim(), tagline: tagline.trim() || undefined, description: description.trim() || undefined };
      // Flask blueprint uses @course_bp.route("/", methods=["POST"]) so POST /course/
      const { data } = await privateAxios.post("/course/", payload);
      if (data?.success) {
        onCreated?.(data.data); // assuming response(True, ..., new_course.to_json())
        onClose?.();
      } else {
        setError(data?.message || "Failed to create course");
      }
    } catch (err) {
      const apiMsg = err?.response?.data?.message || err?.message || "Something went wrong";
      setError(apiMsg);
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-2xl bg-white shadow-xl border border-gray-200 p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Add New Course</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name <span className="text-red-500">*</span></label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CA466]"
              placeholder="e.g., Advanced React Development"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CA466]"
              placeholder="A short one-liner"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CA466] min-h-[120px]"
              placeholder="What will learners get from this course?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
          )}

          <div className="flex items-center justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50">Cancel</button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center px-5 py-2.5 rounded-lg bg-[#4CA466] text-white hover:bg-[#3d8a56] focus:outline-none focus:ring-2 focus:ring-[#4CA466] disabled:opacity-60"
            >
              {submitting ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ListCourses = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");

  // Fetch courses (GET /course/)
  useEffect(() => {
    let mounted = true;
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        setError("");
        const { data } = await privateAxios.get("/course/");
        if (!mounted) return;
        if (data?.success) {
          setCourses(Array.isArray(data.data) ? data.data : []);
        } else {
          setError(data?.message || "Failed to fetch courses");
        }
      } catch (err) {
        const apiMsg = err?.response?.data?.message || err?.message || "Something went wrong";
        if (mounted) setError(apiMsg);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    fetchCourses();
    return () => {
      mounted = false;
    };
  }, []);

  // Client-side filter
  const filteredCourses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) =>
      [c.name, c.tagline, c.description]
        .filter(Boolean)
        .some((v) => v.toLowerCase().includes(q))
    );
  }, [courses, searchQuery]);

  const handleEdit = (courseId) => console.log("Edit course:", courseId);
  const handleDelete = (courseId) => console.log("Delete course:", courseId);
  const handleCourseBuilder = (courseId) => console.log("Course builder for:", courseId);

  const handleAddCourse = () => setIsModalOpen(true);

  const handleCreated = (created) => {
    // optimistic prepend
    setCourses((prev) => [created, ...prev]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Search and Add Button */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#4CA466] focus:border-transparent transition-all duration-200"
            />
          </div>
          <button
            onClick={handleAddCourse}
            className="inline-flex items-center px-6 py-3 bg-[#4CA466] text-white font-medium rounded-lg hover:bg-[#3d8a56] focus:outline-none focus:ring-2 focus:ring-[#4CA466] transition-all duration-200"
          >
            <Plus className="w-5 h-5 mr-2" />
            Add New Course
          </button>
        </div>
        {error && (
          <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-200"></div>
                <div className="p-4">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-3"></div>
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Course Grid */}
        {!isLoading && filteredCourses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <div key={course.id} className="bg-white rounded-lg shadow-sm hover:shadow-md border border-gray-200 transition-all duration-200 overflow-hidden group">
                {/* Thumbnail */}
                <div className="relative">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.name} className="w-full h-48 object-cover" />
                  ) : (
                    <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">No image</div>
                  )}

                  {/* Action Icons */}
                  <div className="absolute top-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleEdit(course.id)}
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-[#4CA466] hover:bg-white transition-all duration-200 shadow-sm"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCourseBuilder(course.id)}
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-[#4CA466] hover:bg-white transition-all duration-200 shadow-sm"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-600 hover:text-red-500 hover:bg-white transition-all duration-200 shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Course Content */}
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-1">{course.name}</h3>
                  {course.tagline && (
                    <p className="text-[#4CA466] font-medium text-sm mb-3 line-clamp-1">{course.tagline}</p>
                  )}
                  {course.description && (
                    <p className="text-gray-600 text-sm line-clamp-3">{course.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && filteredCourses.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search className="w-16 h-16 mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {searchQuery ? "No courses found" : "No courses available"}
            </h3>
            <p className="text-gray-600">
              {searchQuery ? `No courses match "${searchQuery}"` : "Start by adding your first course"}
            </p>
          </div>
        )}
      </div>

      {/* Add Course Modal */}
      <AddCourseModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onCreated={handleCreated}
      />
    </div>
  );
};

export default ListCourses;