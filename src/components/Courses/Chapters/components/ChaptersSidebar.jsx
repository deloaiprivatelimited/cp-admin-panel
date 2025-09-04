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

  // NEW: selection props
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

  return (
    <aside className="relative w-64 bg-white shadow-lg flex flex-col">
      <div className="px-4 py-3 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-800 leading-none">Chapters</h2>
        <p className="text-xs text-gray-500 mt-1">Manage your content chapters</p>
      </div>

      <div className="flex-1 px-3 py-2 overflow-y-auto overflow-x-visible">
        {normalized.length === 0 ? (
          <div className="text-center py-10">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Plus className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500 text-sm">No chapters yet</p>
            <p className="text-gray-400 text-xs mt-1">Add your first chapter to get started</p>
          </div>
        ) : (
          <div className="space-y-2">
            {normalized.map((chapter) => {
              const cid = chapter._cid;
              const isOpen = openSet.has(cid);
              const isSelectedChapter = selectedChapterId === cid;

              return (
                <div
                  key={cid}
                  className={[
                    "relative group rounded-lg border transition-all duration-150",
                    isSelectedChapter
                      ? "bg-green-50 border-[#4CA466]"
                      : "bg-gray-50 border-gray-100 hover:border-[#4CA466]"
                  ].join(" ")}
                >
                  {/* Chapter row */}
                  <div className="px-3 py-2 flex items-center gap-2">
                    <button
                      onClick={() => toggle(cid)}
                      className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
                      aria-label={isOpen ? `Collapse ${chapter.name}` : `Expand ${chapter.name}`}
                    >
                      {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    </button>

                    {/* clicking the name selects the chapter */}
                    <button
                      onClick={() => onSelectChapter?.(cid)}
                      className="min-w-0 flex-1 text-left"
                      aria-selected={isSelectedChapter}
                    >
                      <h3 className="font-medium text-gray-900 text-sm leading-5 truncate">
                        {chapter.name}
                      </h3>
                      {chapter.tagline ? (
                        <p className="text-[11px] leading-4 text-gray-600 truncate">{chapter.tagline}</p>
                      ) : null}
                    </button>

                    <button
                      onClick={() => onEditChapter?.(chapter)}
                      className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                      aria-label={`Edit ${chapter.name}`}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onDeleteChapter?.(cid)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                      aria-label={`Delete ${chapter.name}`}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Dropdown content */}
                  {isOpen && (
                    <div className="px-2 pb-2">
                      {chapter.lessons?.length ? (
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
                                    ? "bg-green-50 border-[#4CA466] shadow-sm"
                                    : "bg-white border-gray-100 hover:border-[#4CA466] hover:shadow-sm"
                                ].join(" ")}
                              >
                                {/* clicking the title selects the lesson */}
                                <button
                                  onClick={() => onSelectLesson?.(cid, lid)}
                                  className="flex-1 text-left"
                                  aria-selected={isSelectedLesson}
                                >
                                  <span className="text-sm text-gray-800 truncate">
                                    {lesson.name || "Untitled lesson"}
                                  </span>
                                </button>

                                <button
                                  onClick={() => onEditLesson?.(cid, lesson)}
                                  className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                  aria-label={`Edit ${lesson.name || "lesson"}`}
                                >
                                  <Pencil className="w-4 h-4" />
                                </button>

                                <button
                                  onClick={() => onDeleteLesson?.(cid, lid)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                                  aria-label={`Delete ${lesson.name || "lesson"}`}
                                >
                                  <Minus className="w-4 h-4" />
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <div className="mt-1 px-2 py-3 text-xs text-gray-500 bg-white border border-dashed border-gray-200 rounded-md text-center">
                          No lessons in this chapter
                        </div>
                      )}

                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => onAddLesson?.(cid)}
                          className="flex-1 bg-[#4CA466] hover:bg-[#429356] text-white text-xs font-medium py-2 px-3 rounded-md transition hover:shadow"
                        >
                          <div className="flex items-center justify-center gap-1.5">
                            <Plus className="w-3.5 h-3.5" />
                            Add Lesson
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="px-3 py-3 border-t border-gray-100">
        <button
          onClick={onOpenModal}
          className="w-full bg-[#4CA466] hover:bg-[#429356] text-white font-medium py-2.5 px-3 rounded-lg flex items-center justify-center gap-2 text-sm transition-all duration-150 hover:shadow"
        >
          <Plus className="w-4 h-4" />
          Add Chapter
        </button>
      </div>
    </aside>
  );
}
