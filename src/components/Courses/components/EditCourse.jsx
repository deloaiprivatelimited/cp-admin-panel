import React, { useEffect, useRef, useState } from "react";
import { X, Upload, Trash2, Loader2 } from "lucide-react";
import { privateAxios } from "../../../utils/axios"; // ✅ adjust path
import { showError, showSuccess } from "../../../utils/toast"; // ✅ adjust path
import { uploadFile, validateFile, formatFileSize } from "../../../utils/fileUpload"; // ✅ adjust path

const MAX_IMAGE_MB = 5;
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp", "image/jpg"];

/**
 * Props:
 * - open: boolean
 * - courseId: string
 * - onClose: function
 * - onUpdated: function(updatedCourse)
 */
const EditCourseModal = ({ open, courseId, onClose, onUpdated }) => {
  const [name, setName] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");

  // thumbnail state
  const [thumbFile, setThumbFile] = useState(null);
  const [thumbPreview, setThumbPreview] = useState("");
  const [thumbUploading, setThumbUploading] = useState(false);
  const [thumbProgress, setThumbProgress] = useState(0);
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fileInputRef = useRef(null);

  // Load existing course details on open
  useEffect(() => {
    let active = true;
    const fetchCourse = async () => {
      if (!open || !courseId) return;
      setError("");
      setLoading(true);
      try {
        const { data } = await privateAxios.get(`/courses/${courseId}`);
        if (data?.success && data?.data) {
          const c = data.data;
          if (!active) return;
          setName(c.name || "");
          setTagline(c.tagline || "");
          setDescription(c.description || "");

          // thumbnail from server
          const serverThumb = c.thumbnail_url || "";
          setThumbnailUrl(serverThumb);
          setThumbPreview(serverThumb); // show current thumbnail
          setThumbFile(null);
          setThumbProgress(0);
          setThumbUploading(false);
        } else {
          setError(data?.message || "Failed to load course");
        }
      } catch (err) {
        const apiMsg = err?.response?.data?.message || err?.message || "Something went wrong";
        setError(apiMsg);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
    return () => {
      active = false;
    };
  }, [open, courseId]);

  const handlePickFile = () => fileInputRef.current?.click();

  const onThumbChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      validateFile(file, { maxSize: MAX_IMAGE_MB, allowedTypes: ALLOWED_IMAGE_TYPES });
      const previewURL = URL.createObjectURL(file);
      setThumbFile(file);
      setThumbPreview(previewURL);
      setError("");

      setThumbUploading(true);
      setThumbProgress(0);

      const uploadedUrl = await uploadFile(
        file,
        (p) => setThumbProgress(p),
        "thumbnails/courses"
      );

      setThumbnailUrl(uploadedUrl.url);
      showSuccess("Thumbnail uploaded");
    } catch (err) {
      console.error(err);
      showError(err?.message || "Failed to upload thumbnail");
      setThumbFile(null);
      setThumbPreview("");
      setThumbnailUrl("");
    } finally {
      setThumbUploading(false);
    }
  };

  const removeThumbnail = () => {
    setThumbFile(null);
    setThumbPreview("");
    setThumbProgress(0);
    setThumbnailUrl(""); // sending an empty string will clear it server-side (PUT)
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Name is required");
      return;
    }

    if (thumbUploading) {
      setError("Please wait for thumbnail upload to finish");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: name.trim(),
        tagline: tagline.trim() || "",
        description: description.trim() || "",
        // Include thumbnail_url only if user uploaded a new one or removed existing
        ...(thumbnailUrl !== undefined ? { thumbnail_url: thumbnailUrl || "" } : {}),
      };

      const { data } = await privateAxios.put(`/courses/${courseId}`, payload);
      if (data?.success && data?.data) {
        showSuccess("Course updated successfully");
        onUpdated?.(data.data);
        onClose?.();
      } else {
        const msg = data?.message || "Failed to update course";
        setError(msg);
        showError(msg);
      }
    } catch (err) {
      const apiMsg = err?.response?.data?.message || err?.message || "Something went wrong";
      setError(apiMsg);
      showError(apiMsg);
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
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl border border-gray-200 p-6 animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Edit Course</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Loading state */}
        {loading ? (
          <div className="space-y-3">
            <div className="h-6 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
            <div className="h-10 bg-gray-100 rounded animate-pulse" />
            <div className="h-24 bg-gray-100 rounded animate-pulse" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* NAME */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CA466]"
                placeholder="e.g., Advanced React Development"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* TAGLINE */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CA466]"
                placeholder="A short one-liner"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
              />
            </div>

            {/* DESCRIPTION */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#4CA466] min-h-[120px]"
                placeholder="What will learners get from this course?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* THUMBNAIL UPLOAD */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail image</label>

              {!thumbPreview ? (
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={handlePickFile}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  >
                    <Upload className="w-4 h-4" /> Choose image
                  </button>
                  <span className="text-xs text-gray-500">PNG/JPG/WebP · up to {MAX_IMAGE_MB}MB</span>
                </div>
              ) : (
                <div className="flex items-start gap-4">
                  <div className="relative w-40 h-28 overflow-hidden rounded-lg border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={thumbPreview} alt="thumbnail preview" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="text-sm text-gray-600">
                      {thumbFile?.name ? (
                        <>
                          {thumbFile.name} · {formatFileSize(thumbFile.size)}
                        </>
                      ) : (
                        <span className="text-gray-500">Current thumbnail</span>
                      )}
                    </div>

                    {thumbUploading ? (
                      <div className="w-full">
                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-2 bg-[#4CA466] transition-all" style={{ width: `${thumbProgress}%` }} />
                        </div>
                        <div className="mt-1 text-xs text-gray-500">Uploading… {thumbProgress}%</div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handlePickFile}
                          className="px-3 py-1.5 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                          Replace
                        </button>
                        {thumbnailUrl && (
                          <button
                            type="button"
                            onClick={removeThumbnail}
                            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-red-200 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" /> Remove
                          </button>
                        )}
                      </div>
                    )}

                    {thumbnailUrl && !thumbUploading && (
                      <div className="text-xs text-gray-500 break-all">Uploaded URL: {thumbnailUrl}</div>
                    )}
                  </div>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept={ALLOWED_IMAGE_TYPES.join(",")}
                className="hidden"
                onChange={onThumbChange}
              />
            </div>

            {/* ERROR */}
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>
            )}

            {/* ACTIONS */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting || thumbUploading}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#4CA466] text-white hover:bg-[#3d8a56] focus:outline-none focus:ring-2 focus:ring-[#4CA466] disabled:opacity-60"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default EditCourseModal;