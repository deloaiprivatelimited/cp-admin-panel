// src/services/units.js
// import { privateAxios } from "../utils/axios"; // adjust path if different
import { privateAxios } from "../../../../utils/axios";
// If your Flask blueprint is mounted under /courses, this is correct.
// If it's different (like /api/courses), update the BASE accordingly.
const BASE = "/courses";

export const getUnits = async (courseId, chapterId, lessonId) => {
  const { data } = await privateAxios.get(
    `${BASE}/${courseId}/chapters/${chapterId}/lessons/${lessonId}/units`
  );
  return data; // { success, message, data: { course_id, chapter_id, lesson_id, units:[{name, unit_type}]} }
};

export const addUnit = async (courseId, chapterId, lessonId, payload) => {
  // Assuming POST to the same path with { name, unit_type }
  const { data } = await privateAxios.post(
    `${BASE}/${courseId}/chapters/${chapterId}/lessons/${lessonId}/units`,
    payload
  );
  return data;
};


export async function reorderUnits(courseId, chapterId, lessonId, unitIds) {
  const { data } = await privateAxios.put(
    `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}/units/reorder`,
    { unit_ids: unitIds }
  );
  return data; // { success, message, data: { units: [...] } }
}


/** Rename a unit (name-only PUT; backend path already exists) */
export const updateUnitName = async (
  courseId,
  chapterId,
  lessonId,
  unitId,
  name
) => {
  const { data } = await privateAxios.put(
    `${BASE}/${courseId}/chapters/${chapterId}/lessons/${lessonId}/units/${unitId}`,
    { name }
  );
  return data; // { success, message, data: { unit: {...} } }
};

/** Delete a unit */
export const deleteUnit = async (courseId, chapterId, lessonId, unitId) => {
  const { data } = await privateAxios.delete(
    `${BASE}/${courseId}/chapters/${chapterId}/lessons/${lessonId}/units/${unitId}`
  );
  return data; // { success, message }
};