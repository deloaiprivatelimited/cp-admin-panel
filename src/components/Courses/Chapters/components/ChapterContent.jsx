import React, { useEffect, useMemo, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import FullscreenPopup from "./UnitBuilders/FullScreenPopUP";
import UnitChip from "./UnitChip";
import AddUnitModal from "./AddUnitModal";
import EditUnitModal from "./EditUnitModal";
import ConfirmDialog from "./ConfirmDialog";
import EditQuestionBuilder from "./UnitBuilders/MCQ/AddMCQ/Edit/EditQuestionBuilder"
import { getUnits, addUnit, reorderUnits, updateUnitName, deleteUnit } from "../services/units";
import { showSuccess } from "../../../../utils/toast";
import TextBuilder from "./UnitBuilders/TextBuilder";
import QuestionBuilder from "./UnitBuilders/MCQ/AddMCQ/AddMCQ";
import RearrangeBuilder from "./UnitBuilders/Rearrange/RearrangeBuilder";
import AddQuestionPanel from "./UnitBuilders/Coding/AddCoding";
import CodeBuilder from "./UnitBuilders/Coding/CodingBuilder";
import EditRearrangeBuilder from "./UnitBuilders/Rearrange/Edit/EditQuestionBuilder";
import { useNavigate } from "react-router-dom";
import { Code } from "lucide-react";

export default function ChapterContent({ courseId, selectedChapterId, selectedLessonId }) {
    const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [units, setUnits] = useState([]); // [{ id, name, unit_type, ... }]
  const [openAdd, setOpenAdd] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const prevUnitsRef = useRef([]);
  const scrollerRef = useRef(null);
  const [selectedUnitId, setSelectedUnitId] = useState(null);

  // NEW: edit/delete UI state
  const [editOpen, setEditOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

  const canFetch = useMemo(
    () => !!courseId && !!selectedChapterId && !!selectedLessonId,
    [courseId, selectedChapterId, selectedLessonId]
  );

const handleOpenCodeEditor = () => {
  console.log(selectedUnit.coding.id);
  if (!selectedUnit?.coding) return;
  const codeEditorUrl = `/questions/coding/${selectedUnit.coding}/course-code-builder`;
  // open in a new tab, prevent the opener from having access for security
  navigate(codeEditorUrl, { target: "_blank", rel: "noopener noreferrer" });
};



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

  // fetchAll now returns the incoming units array so callers can act on it after fetch
  const fetchAll = async () => {
    if (!canFetch || isDragging) return [];
    setLoading(true);
    setError("");
    try {
      const res = await getUnits(courseId, selectedChapterId, selectedLessonId);
      if (res?.success) {
        const incoming = Array.isArray(res.data?.units) ? res.data.units : [];
        console.log(incoming)
        setUnits(incoming);
        return incoming;
      } else {
        setError(res?.message || "Failed to fetch units");
        return [];
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to fetch units");
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); /* eslint-disable-next-line */ }, [courseId, selectedChapterId, selectedLessonId]);
// after your other handlers in the component
const handleCodingAdded =  () => {
 
    setSelectedUnitId(null)
    // 1) If caller gave unitId explicitly, use it
  
};

  const handleAddUnit = async (form) => {
    try {
      // assume addUnit returns the created unit in res.data.unit (common pattern)
      const res = await addUnit(courseId, selectedChapterId, selectedLessonId, form);
      setOpenAdd(false);

      // re-fetch units and select the newly created unit if available
      const incoming = await fetchAll();
      const newUnitId =
        res?.success && res.data?.unit?.id
          ? String(res.data.unit.id)
          : incoming.length > 0
          ? String(incoming[incoming.length - 1].id)
          : null;

      if (newUnitId) {
        setSelectedUnitId(newUnitId);
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to add unit");
    }
  };

  // ------ NEW: Edit + Delete handlers ------
  const openEdit = (unit) => { setEditTarget(unit); setEditOpen(true); };
  const submitEdit = async ({ name }) => {
    try {
      await updateUnitName(courseId, selectedChapterId, selectedLessonId, editTarget.id, name);
      showSuccess("Unit updated");
      setEditOpen(false);
      const incoming = await fetchAll();
      // keep the edited unit selected so editor remains open
      setSelectedUnitId(String(editTarget.id));
      setEditTarget(null);
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

      // re-fetch units and pick a sensible fallback selection
      const incoming = await fetchAll();
      // If the deleted unit was selected, attempt to select the next unit at the same index,
      // otherwise keep current selection.
      if (String(selectedUnitId) === String(confirmTarget?.id)) {
        // find index of deleted unit in previous units
        const prev = prevUnitsRef.current.length ? prevUnitsRef.current : units;
        const idx = prev.findIndex((u) => String(u.id) === String(confirmTarget?.id));
        // pick next item (same idx) or previous one if next doesn't exist
        let fallback = null;
        if (incoming.length > 0) {
          if (idx >= 0 && idx < incoming.length) fallback = incoming[idx].id;
          else if (idx - 1 >= 0 && idx - 1 < incoming.length) fallback = incoming[idx - 1].id;
          else fallback = incoming[0].id;
        }
        setSelectedUnitId(fallback ? String(fallback) : null);
      }
    } catch (e) {
      setError(e?.response?.data?.message || e.message || "Failed to delete unit");
    }
  };

  // save prev units before reordering so we can restore on error
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
      if (Array.isArray(res?.data?.units)) {
        setUnits(res.data.units);
      }
      // keep selectedUnitId as-is (ids don't change on reorder)
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
  const selectedUnit = units.find((u) => String(u.id) === String(selectedUnitId)) ?? null;

  return (
    <div className="space-y-4 h-full min-h-0 flex flex-col">
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
                        const isSelected = String(selectedUnitId) === id;

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
                                <button
                                  type="button"
                                  onClick={() => setSelectedUnitId(id)}
                                  className={`rounded-lg focus:outline-none ${
                                    isSelected ? "ring-2 ring-white/70" : ""
                                  }`}
                                  title={`Select ${u.name}`}
                                >
                                  <UnitChip
                                    id={id}
                                    name={u.name}
                                    type={u.unit_type}
                                    index={idx}
                                    onEdit={openEdit}
                                    onDelete={openDelete}
                                  />
                                </button>
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

      {/* NEW: make only the unit content area scrollable and contained */}
<div className="mt-4 flex-1 min-h-0">
        <div className="h-[60vh] min-h-[220px] max-h-[72vh] overflow-hidden rounded-md border border-dashed border-gray-200 bg-white">
          {selectedUnit ? (
            (() => {
              const type = String(selectedUnit.unit_type || "").toLowerCase();

              switch (type) {
                case "text":
                  return (
                    <div className="h-full flex flex-col">
                      <div className="h-[10%] flex items-center justify-between overflow-auto p-4">
                        <h2 className="text-lg font-semibold">Text Editor</h2>

                        {/* Fullscreen editor control (keeps your existing FullscreenPopup usage) */}
                        <FullscreenPopup title="Editor Fullscreen">
                          <TextBuilder unitID={selectedUnit.id} />
                        </FullscreenPopup>
                      </div>

      <div className="h-[90%] border-t px-4 py-2 overflow-auto">
                        {/* Inline editor (main area) */}
                        <TextBuilder unitID={selectedUnit.id} />
                      </div>
                    </div>
                  );

                // inside the switch(...) for selectedUnit.unit_type
                  case "mcq": {
                    const hasMcq = Boolean(selectedUnit.mcq); // backend returns mcq id string or null
                      
                  return (
                    <div className="h-full flex flex-col">
                      <div className="h-[10%] flex items-center justify-between overflow-auto p-4">
                        <h2 className="text-lg font-semibold">MCQ Editor</h2>

                        <FullscreenPopup title="MCQ Editor Fullscreen">
                          {hasMcq ? (
                            // edit existing MCQ
                            <EditQuestionBuilder id={selectedUnit.mcq} />
                          ) : (
                            // add new MCQ
                            <QuestionBuilder unitID={selectedUnit.id} />
                          )}
                        </FullscreenPopup>
                      </div>

                      <div className="h-[90%] border-t px-4 py-2 overflow-auto">
        {/* Inline builder - same conditional */}
        {hasMcq ? (
          <EditQuestionBuilder id={selectedUnit.mcq} />
        ) : (
          <QuestionBuilder unitID={selectedUnit.id} />
        )}
      </div>
                    </div>
                  );
                }
                 case "coding": {
                  const hasCoding = Boolean(selectedUnit.coding); // backend returns coding id string or null

                  return (
                    <div className="h-full flex flex-col">
                      <div className="h-[10%] flex items-center justify-between overflow-auto p-4">

                         <FullscreenPopup title="Coding Editor Fullscreen">
        {hasCoding ? (
          // NAVIGATION: user already has coding — provide a button to go to external code builder route
          <div className="p-6">
            <div className="mb-3 text-sm text-gray-500">You already have a coding question for this unit.</div>
            <button
              onClick={handleOpenCodeEditor}
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Open code editor"
            >
              Open Code Editor
            </button>
          </div>
        ) : (
          // add new Coding Question
          <AddQuestionPanel id={selectedUnit.id} onSuccess={handleCodingAdded} />
        )}
      </FullscreenPopup>
                      </div>

                      <div className="h-[100%] border-t px-4 py-2">
                        {/* Inline builder - same conditional */}
                    {hasCoding ? (
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-500">Code question exists for this unit.</div>
            <button
              onClick={handleOpenCodeEditor}
              className="ml-auto px-3 py-1.5 border rounded-md text-sm bg-white hover:bg-gray-50"
              aria-label="Open code editor inline"
            >
              Open Code Editor
            </button>
          </div>
        ) : (
          <div className="h-[90%] overflow-auto">
            <AddQuestionPanel id={selectedUnit.id} onSuccess={handleCodingAdded} />
          </div>
        )}
                      </div>
                    </div>
                  );
                }
case "rearrange": {
                    const hasRearrange = Boolean(selectedUnit.rearrange); // backend returns rearrange id string or null

                  return (
                    <div className="h-full flex flex-col">
                      <div className="h-[10%] flex items-center justify-between overflow-auto p-4">
                        <h2 className="text-lg font-semibold">Rearrange Editor</h2>

                        <FullscreenPopup title="Rearrange Editor Fullscreen">
                          {hasRearrange ? (
                            // edit existing Rearrange
                            <EditRearrangeBuilder id={selectedUnit.rearrange} />
                          ) : (
                            // add new Rearrange
                            <RearrangeBuilder unitId={selectedUnit.id} />
                          )}
                        </FullscreenPopup>
                      </div>

      <div className="h-[90%] border-t px-4 py-2 overflow-auto">
                        {/* Inline builder - same conditional */}
                        {hasRearrange ? (
                          <EditRearrangeBuilder id={selectedUnit.rearrange} />
                        ) : (
                          <RearrangeBuilder unitId={selectedUnit.id} />
                        )}
                      </div>
                    </div>
                  );
                }

                default:
                  return (
                    <div className="h-full flex items-center justify-center p-6 text-sm text-gray-500">
                      <div className="rounded-md border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                        Invalid unit type
                      </div>
                    </div>
                  );
              }
            })()
          ) : (
            <div className="h-full flex items-center justify-center p-6 text-sm text-gray-500">
              <div className="rounded-md border border-dashed border-gray-200 p-6 text-center text-sm text-gray-500">
                Select a unit above to view or edit its content.
              </div>
            </div>
          )}
        </div>
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
