// src/services/lessons.js
import { privateAxios } from "../../../../utils/axios";

/**
 * Add a lesson to a chapter in a course
 * @param {string} courseId
 * @param {string} chapterId
 * @param {{name:string, tagline?:string, description?:string}} payload
 * @returns {{ course_id: string, chapter_id: string, lesson: object }}
 */
export const addLessonToChapter = async (courseId, chapterId, payload) => {
  const { data } = await privateAxios.post(
    `/courses/${courseId}/chapters/${chapterId}/lessons`,
    payload
  );
  if (!data?.success) throw new Error(data?.message || "Failed to add lesson");
  return data.data; // { course_id, chapter_id, lesson }
};

/**
 * Edit/update a lesson in a chapter
 * @param {string} courseId
 * @param {string} chapterId
 * @param {string} lessonId
 * @param {{name?:string, tagline?:string, description?:string}} payload
 * @returns {{ course_id: string, chapter_id: string, lesson: object }}
 */
export const editLessonInChapter = async (courseId, chapterId, lessonId, payload) => {
  const { data } = await privateAxios.put(
    `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`,
    payload
  );
  if (!data?.success) throw new Error(data?.message || "Failed to update lesson");
  return data.data; // { course_id, chapter_id, lesson }
};

/**
 * Delete a lesson from a chapter
 * @param {string} courseId
 * @param {string} chapterId
 * @param {string} lessonId
 * @returns {true}
 */
export const deleteLessonFromChapter = async (courseId, chapterId, lessonId) => {
  const { data } = await privateAxios.delete(
    `/courses/${courseId}/chapters/${chapterId}/lessons/${lessonId}`
  );
  if (!data?.success) throw new Error(data?.message || "Failed to delete lesson");
  return true;
};
