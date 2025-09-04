// src/pages/ChapterManager.jsx
import React, { useState, useEffect } from "react";
import ChaptersSidebar from "./components/ChaptersSidebar";
import ChapterContent from "./components/ChapterContent";
import AddChapterModal from "./components/AddChapterModal";
import EditChapterModal from "./components/EditChapterModal";
import { useParams } from "react-router-dom";
import AddLessonModal from "./components/AddLessonModal";
// import EditChapte  rModal from "./components/EditChapterModal";
import EditLessonModal from "./components/EditLessonModal";
// import { getChaptersByCourse, addChapterToCourse } from "../../services/chapters";
// src/pages/ChapterManager.jsx
import { getChaptersByCourse, addChapterToCourse, deleteChapterFromCourse, editChapterInCourse } from "./services/chapter";
// import { showError, showSuccess } from "../../utils/toast";
import { showError,showSuccess } from "../../../utils/toast";
import {
  addLessonToChapter,
  editLessonInChapter,
  deleteLessonFromChapter,
} from "./services/lessons";

// ...imports...
// ...imports (unchanged)

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

  // NEW: selection state
  const [selectedChapterId, setSelectedChapterId] = useState(null);
  const [selectedLessonId, setSelectedLessonId] = useState(null);

  // NEW: selection handlers
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
    return () => { mounted = false; };
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
      // NEW: clear selection if we deleted the selected one
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
      // NEW: clear selection if we deleted the selected one
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
    <div className="min-h-screen bg-gray-50 flex">
      <ChaptersSidebar
        chapters={chapters}
        onDeleteChapter={handleDeleteChapter}
        onOpenModal={() => setIsModalOpen(true)}
        onEditChapter={openEditChapter}
        onAddLesson={openAddLesson}
        onEditLesson={openEditLesson}
        onDeleteLesson={handleDeleteLesson}

        // NEW: selection props
        selectedChapterId={selectedChapterId}
        selectedLessonId={selectedLessonId}
        onSelectChapter={handleSelectChapter}
        onSelectLesson={handleSelectLesson}
      />

 <div className="flex-1 min-w-0 pl-2">
        <div >
          {loading ? (
            <div className="text-gray-500">Loading chapters…</div>
          ) : (
            <ChapterContent
              // NEW: show selected IDs in content
                courseId={courseId}             // ⬅️ pass it down

              selectedChapterId={selectedChapterId}
              selectedLessonId={selectedLessonId}
            />
          )}
        </div>
      </div>

      <AddChapterModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleAddChapter}
      />

      <EditChapterModal
        open={isEditOpen}
        initial={editingChapter}
        onClose={() => { setIsEditOpen(false); setEditingChapter(null); }}
        onSubmit={handleEditChapter}
      />

      <AddLessonModal
        open={isAddLessonOpen}
        chapterId={targetChapterId}
        onClose={() => { setIsAddLessonOpen(false); setTargetChapterId(null); }}
        onSubmit={handleAddLesson}
      />

      <EditLessonModal
        open={isEditLessonOpen}
        chapterId={editingLessonChapterId}
        lesson={editingLesson}
        onClose={() => { setIsEditLessonOpen(false); setEditingLesson(null); setEditingLessonChapterId(null); }}
        onSubmit={handleEditLesson}
      />
    </div>
  );
}
