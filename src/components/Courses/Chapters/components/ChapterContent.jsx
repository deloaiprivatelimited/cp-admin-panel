// src/pages/components/ChapterContent.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

import UnitChip from "./UnitChip";
import AddUnitModal from "./AddUnitModal";
import EditUnitModal from "./EditUnitModal";
import ConfirmDialog from "./ConfirmDialog";

import { getUnits, addUnit, reorderUnits, updateUnitName, deleteUnit } from "../services/units";

export default function ChapterContent({ courseId, selectedChapterId, selectedLessonId }) {
  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]); // [{ id, name, unit_type }]
  const [openAdd, setOpenAdd] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const prevUnitsRef = useRef([]);
  const scrollerRef = useRef(null);

  // NEW: edit/delete UI state
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const canFetch = useMemo(
    () => !!courseId && !!selectedChapterId && !!selectedLessonId,
    [courseId, selectedChapterId, selectedLessonId]
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onWheel = (e) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      el.scrollLeft += e.deltaY;
      e.preventDefault();
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const fetchAll = async () => {
    if (!canFetch || isDragging) return;
    setLoading(true);
    setError("");
    try {
      const res = await getUnits(courseId, selectedChapterId, selectedLessonId);
      if (res?.success) {
        const incoming = Array.isArray(res.data?.units) ? res.data.units : [];
        setUnits(incoming);
      } else {
        setError(res?.message || "Failed to fetch units");
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to fetch units");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); /* eslint-disable-next-line */ }, [courseId, selectedChapterId, selectedLessonId]);

  const handleAddUnit = async (form) => {
    try {
      await addUnit(courseId, selectedChapterId, selectedLessonId, form);
      setOpenAdd(false);
      await fetchAll();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to add unit");
    }
  };

  // ------ NEW: Edit + Delete handlers ------
  const openEdit = (unit) => { setEditTarget(unit); setEditOpen(true); };
  const submitEdit = async ({ name }) => {
    try {
      await updateUnitName(courseId, selectedChapterId, selectedLessonId, editTarget.id, name);
      setEditOpen(false);
      setEditTarget(null);
      await fetchAll();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to update unit");
    }
  };

  const openDelete = (unit) => { setConfirmTarget(unit); setConfirmOpen(true); };
  const confirmDelete = async () => {
    try {
      await deleteUnit(courseId, selectedChapterId, selectedLessonId, confirmTarget.id);
      setConfirmOpen(false);
      setConfirmTarget(null);
      await fetchAll();
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to delete unit");
    }
  };

  // ---------- DnD helpers ----------
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };
  const onDragStart = () => setIsDragging(true);
  const onDragEnd = async (result) => {
    setIsDragging(false);
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.index === destination.index) return;

    prevUnitsRef.current = units;
    const newUnits = reorder(units, source.index, destination.index);
    setUnits(newUnits);

    try {
      const unitIds = newUnits.map((u) => u.id);
      const res = await reorderUnits(courseId, selectedChapterId, selectedLessonId, unitIds);
      if (!res?.success) throw new Error(res?.message || "Failed to save order");
      if (Array.isArray(res?.data?.units)) setUnits(res.data.units);
    } catch (err) {
      setUnits(prevUnitsRef.current);
      setError(err?.response?.data?.message || err.message || "Failed to save order");
    }
  };

  // ---------- UI guards ----------
  if (!courseId) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
        <h3 className="text-base font-semibold text-gray-800">No course selected</h3>
        <p className="mt-2 text-sm text-gray-600">Select a course to get started.</p>
      </div>
    );
  }
  if (!selectedChapterId) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
        <h3 className="text-base font-semibold text-gray-800">No chapter selected</h3>
        <p className="mt-2 text-sm text-gray-600">Pick a chapter to view its lessons.</p>
      </div>
    );
  }
  if (!selectedLessonId) {
    return (
      <div className="rounded-lg border border-dashed border-gray-300 bg-white p-8 text-center">
        <h3 className="text-base font-semibold text-gray-800">No lesson selected</h3>
        <p className="mt-2 text-sm text-gray-600">Select a lesson to build it.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="sticky top-0 z-10 overflow-x-hidden rounded-xl bg-[#4CA466] p-4 shadow">
        <div className="flex items-center justify-between gap-4">
          <h3 className="truncate text-sm font-semibold text-white">Lesson Units</h3>
          <button
            onClick={() => setOpenAdd(true)}
            className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-[#4CA466] shadow hover:bg-gray-100"
          >
            + Add Unit
          </button>
        </div>

        <div className="relative mt-4">
          {loading ? (
            <div className="animate-pulse text-sm text-indigo-100">Loading units…</div>
          ) : error ? (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
          ) : units.length > 0 ? (
            <div ref={scrollerRef} className="no-scrollbar w-full overflow-x-auto overflow-y-hidden">
              <DragDropContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <Droppable
                  droppableId="units"
                  direction="horizontal"
                  isDropDisabled={Boolean(loading) || units.length === 0}
                  isCombineEnabled={false}
                  ignoreContainerClipping={false}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex min-h-[56px] items-center gap-2 py-2 pr-4 ${
                        snapshot.isDraggingOver ? "bg-white/10" : ""
                      }`}
                      style={{ whiteSpace: "nowrap", width: "max-content" }}
                    >
                      {units.map((u, idx) => {
                        const id = String(u.id);
                        return (
                          <Draggable draggableId={id} index={idx} key={id}>
                            {(providedDraggable, snap) => (
                              <div
                                ref={providedDraggable.innerRef}
                                {...providedDraggable.draggableProps}
                                {...providedDraggable.dragHandleProps}
                                className={`inline-block transition-transform ${
                                  snap.isDragging ? "rotate-1 scale-[1.02]" : ""
                                }`}
                              >
                                <UnitChip
                                  id={id}
                                  name={u.name}
                                  type={u.unit_type}
                                  index={idx}
                                  onEdit={openEdit}
                                  onDelete={openDelete}
                                />
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </div>
          ) : (
            <div className="rounded-lg border border-dashed border-indigo-300 bg-indigo-500/30 p-4 text-sm text-indigo-100">
              No units yet. Click “Add Unit” to create the first one.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-4">
        <h4 className="text-sm font-semibold text-gray-700">Lesson Builder</h4>
        <p className="mt-2 text-sm text-gray-600">Choose a unit from above to edit, or add a new one.</p>
      </div>

      {/* Modals */}
      <AddUnitModal open={openAdd} onClose={() => setOpenAdd(false)} onSubmit={handleAddUnit} />
      <EditUnitModal open={editOpen} unit={editTarget} onClose={() => setEditOpen(false)} onSubmit={submitEdit} />
      <ConfirmDialog
        open={confirmOpen}
        title="Delete unit?"
        message={`“${confirmTarget?.name ?? ""}” will be permanently removed.`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
