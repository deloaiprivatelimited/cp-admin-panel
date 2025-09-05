// src/pages/components/ChaptersSidebar.jsx
import React, { useMemo, useState } from "react";
import { Plus, Minus, Pencil, ChevronRight, ChevronDown } from "lucide-react";

export default function ChaptersSidebar({
  chapters = [],
  onDeleteChapter,
  onOpenModal,
  onEditChapter,
  onAddLesson,
  onEditLesson,
  onDeleteLesson,

  // selection props
  selectedChapterId,
  selectedLessonId,
  onSelectChapter,     // (chapterId) => void
  onSelectLesson,      // (chapterId, lessonId) => void
}) {
  const [openSet, setOpenSet] = useState(() => new Set());
  const toggle = (id) => {
    setOpenSet((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const getId = (obj) => obj?.id ?? obj?._id;

  const normalized = useMemo(
    () =>
      (chapters || []).map((c) => ({
        ...c,
        _cid: getId(c),
        lessons: Array.isArray(c.lessons) ? c.lessons : [],
      })),
    [chapters]
  );

  // helper: safe name truncation with tooltip
  const truncate = (txt, n = 24) => (typeof txt === "string" && txt.length > n ? txt.slice(0, n) + "…" : txt);

  return (
    <aside className="relative w-72 max-w-full bg-white shadow-md flex flex-col rounded-xl border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur px-4 py-3 border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-900 leading-none">Chapters</h2>
        <p className="text-[11px] text-gray-500 mt-1">Manage your content chapters</p>
      </div>

      {/* List */}
      <div className="flex-1 px-3 py-2 overflow-y-auto">
        {normalized.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 bg-gray-50 border border-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-600 text-sm font-medium">No chapters yet</p>
            <p className="text-gray-400 text-xs mt-1">Add your first chapter to get started</p>
          </div>
        ) : (
          <ul className="space-y-2" role="tree">
            {normalized.map((chapter) => {
              const cid = chapter._cid;
              const isOpen = openSet.has(cid);
              const isSelectedChapter = selectedChapterId === cid;
              const lessonCount = chapter.lessons?.length || 0;

              return (
                <li
                  key={cid}
                  role="treeitem"
                  aria-expanded={isOpen}
                  className={[
                    "relative group rounded-lg border transition-all duration-150",
                    isSelectedChapter
                      ? "bg-emerald-50/80 border-emerald-300"
                      : "bg-gray-50 border-gray-100 hover:border-emerald-300 hover:bg-white"
                  ].join(" ")}
                >
                  {/* left accent when selected */}
                  <span
                    aria-hidden
                    className={[
                      "absolute left-0 top-0 h-full w-1 rounded-l-lg",
                      isSelectedChapter ? "bg-emerald-500" : "bg-transparent group-hover:bg-emerald-200"
                    ].join(" ")}
                  />

                  {/* Chapter row */}
                  <div className="px-3 py-2 flex items-center gap-2">
                    <button
                      onClick={() => toggle(cid)}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                      aria-label={isOpen ? `Collapse ${chapter.name}` : `Expand ${chapter.name}`}
                    >
                      {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    {/* clicking the name selects the chapter */}
                    <button
                      onClick={() => onSelectChapter?.(cid)}
                      className="min-w-0 flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
                      aria-selected={isSelectedChapter}
                      title={chapter.name}
                    >
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-gray-900 text-sm leading-5 truncate">
                          {truncate(chapter.name, 28)}
                        </h3>
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700">
                          {lessonCount}
                        </span>
                      </div>
                      {chapter.tagline ? (
                        <p className="text-[11px] leading-4 text-gray-600 truncate" title={chapter.tagline}>
                          {truncate(chapter.tagline, 10)}
                        </p>
                      ) : null}
                    </button>

                    <button
                      onClick={() => onEditChapter?.(chapter)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                      aria-label={`Edit ${chapter.name}`}
                      title="Edit chapter"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteChapter?.(cid)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                      aria-label={`Delete ${chapter.name}`}
                      title="Delete chapter"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dropdown content */}
                  {isOpen && (
                    <div className="px-2 pb-2" role="group">
                      {lessonCount ? (
                        <ul className="mt-1 space-y-1">
                          {chapter.lessons.map((lesson) => {
                            const lid = lesson.id || lesson._id;
                            const isSelectedLesson = isSelectedChapter && selectedLessonId === lid;
                            return (
                              <li
                                key={lid}
                                className={[
                                  "flex items-center gap-2 px-2 py-2 rounded-md border transition",
                                  isSelectedLesson
                                    ? "bg-emerald-50/80 border-emerald-300 shadow-sm"
                                    : "bg-white border-gray-100 hover:border-emerald-300 hover:shadow-sm"
                                ].join(" ")}
                              >
                                {/* clicking the title selects the lesson */}
                                <button
                                  onClick={() => onSelectLesson?.(cid, lid)}
                                  className="flex-1 min-w-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 rounded"
                                  aria-selected={isSelectedLesson}
                                  title={lesson.name || "Untitled lesson"}
                                >
                                  <span className="text-sm text-gray-800 truncate">
                                    {truncate(lesson.name || "Untitled lesson", 6)}
                                  </span>
                                </button>

                                <button
                                  onClick={() => onEditLesson?.(cid, lesson)}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                                  aria-label={`Edit ${lesson.name || "lesson"}`}
                                  title="Edit lesson"
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => onDeleteLesson?.(cid, lid)}
                                  className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                                  aria-label={`Delete ${lesson.name || "lesson"}`}
                                  title="Delete lesson"
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="mt-1 px-2 py-3 text-xs text-gray-600 bg-white border border-dashed border-gray-200 rounded-md text-center">
                          No lessons in this chapter
                        </div>
                      )}

                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => onAddLesson?.(cid)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium py-2 px-3 rounded-md transition hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                          title="Add a new lesson"
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <Plus className="w-3.5 h-3.5" />
                            Add Lesson
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-gray-100 bg-white">
        <button
          onClick={onOpenModal}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-all duration-150 hover:shadow focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
          title="Add a new chapter"
        >
          <Plus className="w-4 h-4" />
          Add Chapter
        </button>
      </div>
    </aside>
  );
}
