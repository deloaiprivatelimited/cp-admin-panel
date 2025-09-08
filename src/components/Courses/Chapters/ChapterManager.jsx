// src/pages/ChapterManager.jsx
import React, { useState, useEffect } from "react";
import ChaptersSidebar from "./components/ChaptersSidebar";
import AddChapterModal from "./components/AddChapterModal";
import EditChapterModal from "./components/EditChapterModal";
import { useParams } from "react-router-dom";
import AddLessonModal from "./components/AddLessonModal";
import EditLessonModal from "./components/EditLessonModal";
import {
  getChaptersByCourse,
  addChapterToCourse,
  deleteChapterFromCourse,
  editChapterInCourse,
} from "./services/chapter";
import { showError, showSuccess } from "../../../utils/toast";
import {
  addLessonToChapter,
  editLessonInChapter,
  deleteLessonFromChapter,
} from "./services/lessons";
import ChapterContent from "./components/ChapterContent";

export default function ChapterManager() {
  const { courseId } = useParams();
  const [chapters, setChapters] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAddLessonOpen, setIsAddLessonOpen] = useState(false);
  const [targetChapterId, setTargetChapterId] = useState(null);

  const [isEditLessonOpen, setIsEditLessonOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [editingLessonChapterId, setEditingLessonChapterId] = useState(null);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingChapter, setEditingChapter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reload, setReload] = useState(0);

  // selection state
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  // selection handlers
  const handleSelectChapter = (chapterId) => {
    setSelectedChapterId(chapterId);
    setSelectedLessonId(null);
  };
  const handleSelectLesson = (chapterId, lessonId) => {
    setSelectedChapterId(chapterId);
    setSelectedLessonId(lessonId);
  };

  const openAddLesson = (chapterId) => {
    setTargetChapterId(chapterId);
    setIsAddLessonOpen(true);
  };

  const openEditLesson = (chapterId, lesson) => {
    setEditingLessonChapterId(chapterId);
    setEditingLesson(lesson);
    setIsEditLessonOpen(true);
  };

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await getChaptersByCourse(courseId);
        if (mounted) setChapters(res.chapters || []);
      } catch (err) {
        showError(err.message || "Failed to load chapters");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (courseId) load();
    return () => {
      mounted = false;
    };
  }, [courseId, reload]);

  const handleAddChapter = async (data) => {
    try {
      await addChapterToCourse(courseId, data);
      setIsModalOpen(false);
      showSuccess("Chapter added");
      setReload((r) => r + 1);
    } catch (err) {
      showError(err.message || "Failed to add chapter");
    }
  };

  const handleEditLesson = async (chapterId, lessonId, updates) => {
    try {
      await editLessonInChapter(courseId, chapterId, lessonId, updates);
      showSuccess("Lesson updated");
      setIsEditLessonOpen(false);
      setEditingLesson(null);
      setEditingLessonChapterId(null);
      setReload((r) => r + 1);
    } catch (err) {
      showError(err.message || "Failed to update lesson");
    }
  };

  const handleDeleteLesson = async (chapterId, lessonId) => {
    const ok = window.confirm("Delete this lesson? This cannot be undone.");
    if (!ok) return;
    try {
      await deleteLessonFromChapter(courseId, chapterId, lessonId);
      showSuccess("Lesson deleted");
      setSelectedLessonId((prev) => (prev === lessonId ? null : prev));
      setReload((r) => r + 1);
    } catch (err) {
      showError(err.message || "Failed to delete lesson");
    }
  };

  const handleDeleteChapter = async (chapterId) => {
    const ok = window.confirm("Delete this chapter? This cannot be undone.");
    if (!ok) return;
    try {
      await deleteChapterFromCourse(courseId, chapterId);
      showSuccess("Chapter deleted");
      setSelectedChapterId((prev) => (prev === chapterId ? null : prev));
      setSelectedLessonId((prev) => (selectedChapterId === chapterId ? null : prev));
      setReload((r) => r + 1);
    } catch (err) {
      showError(err.message || "Failed to delete chapter");
    }
  };

  const handleAddLesson = async (chapterId, payload) => {
    try {
      await addLessonToChapter(courseId, chapterId, payload);
      showSuccess("Lesson added");
      setReload((r) => r + 1);
    } catch (err) {
      showError(err.message || "Failed to add lesson");
    }
  };

  const openEditChapter = (chapter) => {
    setEditingChapter(chapter);
    setIsEditOpen(true);
  };

  const handleEditChapter = async (updates) => {
    try {
      const chapterId = editingChapter?._id || editingChapter?.id;
      const res = await editChapterInCourse(courseId, chapterId, updates);
      setChapters((prev) =>
        prev.map((c) => ((c._id || c.id) === (res._id || res.id) ? res : c))
      );
      setIsEditOpen(false);
      setEditingChapter(null);
      showSuccess("Chapter updated");
      setReload((r) => r + 1);
    } catch (err) {
      showError(err.message || "Failed to update chapter");
    }
  };

  return (
    // Clean layout with improved spacing, sticky header, and subtle separators
    <div className="w-full min-h-screen bg-gray-50">
  
      <div className="flex w-full ">
        {/* Left: sidebar */}
<div className="w-64 xl:w-72 shrink-0 border-r border-gray-200 bg-white flex h-screen">
       <ChaptersSidebar
            chapters={chapters}
            onDeleteChapter={handleDeleteChapter}
            onOpenModal={() => setIsModalOpen(true)}
            onEditChapter={openEditChapter}
            onAddLesson={openAddLesson}
            onEditLesson={openEditLesson}
            onDeleteLesson={handleDeleteLesson}
            selectedChapterId={selectedChapterId}
            selectedLessonId={selectedLessonId}
            onSelectChapter={handleSelectChapter}
            onSelectLesson={handleSelectLesson}
          />
        </div>

        {/* Right: content */}
        <main className="flex-1 min-w-0">
          <div className="mx-auto w-full max-w-[1100px] px-4 py-5">
            {/* Content surface */}
            <div className="rounded-xl border border-gray-200 bg-white">
              <div className="px-4 py-3 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div className="min-w-0">
                    <h2 className="text-sm font-semibold text-gray-900 truncate">
                      {selectedLessonId
                        ? "Lesson Details"
                        : selectedChapterId
                        ? "Chapter Details"
                        : "Overview"}
                    </h2>
                    <p className="text-[11px] text-gray-500">
                      {selectedLessonId
                        ? "Edit units and content for this lesson"
                        : selectedChapterId
                        ? "Manage lessons inside this chapter"
                        : "Select a chapter from the left to get started"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4">
                {loading ? (
                  // Skeleton loader
                  <div className="space-y-4 animate-pulse">
                    <div className="h-6 w-48 bg-gray-100 rounded" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="h-24 bg-gray-100 rounded" />
                      <div className="h-24 bg-gray-100 rounded" />
                    </div>
                    <div className="h-40 bg-gray-100 rounded" />
                  </div>
                ) : (
                  <ChapterContent
                    courseId={courseId}
                    selectedChapterId={selectedChapterId}
                    selectedLessonId={selectedLessonId}
                  />
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddChapterModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddChapter}
      />

      <EditChapterModal
        open={isEditOpen}
        initial={editingChapter}
        onClose={() => {
          setIsEditOpen(false);
          setEditingChapter(null);
        }}
        onSubmit={handleEditChapter}
      />

      <AddLessonModal
        open={isAddLessonOpen}
        chapterId={targetChapterId}
        onClose={() => {
          setIsAddLessonOpen(false);
          setTargetChapterId(null);
        }}
        onSubmit={handleAddLesson}
      />

      <EditLessonModal
        open={isEditLessonOpen}
        chapterId={editingLessonChapterId}
        lesson={editingLesson}
        onClose={() => {
          setIsEditLessonOpen(false);
          setEditingLesson(null);
          setEditingLessonChapterId(null);
        }}
        onSubmit={handleEditLesson}
      />
    </div>
  );
}
