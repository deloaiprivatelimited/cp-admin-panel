// src/services/unitContent.js
// import { privateAxios } from "../../../../utils/axios";
import { privateAxios } from "../../../../../utils/axios";
const BASE = "/courses/units";

/**
 * Fetch the content of a unit by unitId.
 * Works only for text units.
 * 
 * @param {string} unitId 
 * @returns {Promise<{ success: boolean, message: string, data: { unit_id, name, content } }>}
 */
export async function getUnitContent(unitId) {
  const { data } = await privateAxios.get(`${BASE}/${unitId}/content`);
  return data;
}

/**
 * Update (or add) content for a unit by unitId.
 * Works only for text units.
 * 
 * @param {string} unitId 
 * @param {string} content 
 * @returns {Promise<{ success: boolean, message: string, data: { unit_id, name, content } }>}
 */
export async function updateUnitContent(unitId, content) {
  const { data } = await privateAxios.put(`${BASE}/${unitId}/content`, {
    content,
  });
  return data;
}
