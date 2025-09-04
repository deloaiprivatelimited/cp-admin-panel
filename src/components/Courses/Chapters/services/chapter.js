// src/services/chapters.js
// import { privateAxios } from "../utils/axios";

import { privateAxios } from "../../../../utils/axios";
export const getChaptersByCourse = async (courseId) => {
  const { data } = await privateAxios.get(`/courses/${courseId}/chapters`);
  // assuming your response() shape -> { success, message, data }
  if (!data?.success) throw new Error(data?.message || "Failed to fetch chapters");
  return data.data; // { course_id, chapters }
};

export const addChapterToCourse = async (courseId, payload) => {
  const { data } = await privateAxios.post(`/courses/${courseId}/chapters`, payload);
  if (!data?.success) throw new Error(data?.message || "Failed to add chapter");
  return data.data; // { chapter }
};
export const deleteChapterFromCourse = async (courseId, chapterId) => {
  const { data } = await privateAxios.delete(`/courses/${courseId}/chapters/${chapterId}`);
  if (!data?.success) throw new Error(data?.message || "Failed to delete chapter");
  return true; // no need to return payload, just confirm deletion
};

export const editChapterInCourse = async (courseId, chapterId, payload) => {
  const { data } = await privateAxios.put(`/courses/${courseId}/chapters/${chapterId}`, payload);
  if (!data?.success) throw new Error(data?.message || "Failed to update chapter");
  return data.data; // updated chapter object
};