// services/adminServices.js
// Auto-generated frontend service layer for routes/admin_routes.py
// Always import axios instances exactly as required:
import { publicAxios, privateAxios } from "@/utils/axios";

/**
 * BASE_URL is a prefix applied to every route.
 * Keep it as an empty string by default so it can be customized later.
 */
export const BASE_URL = "";

const _clean = (s = "") => String(s).trim();

/**
 * Safely join BASE_URL with a route path ensuring no duplicate or missing slashes.
 * path may be like '/', '/:id/action', 'action', etc.
 */
const buildUrl = (path = "") => {
  let base = String(BASE_URL || "");
  // remove trailing slash from base
  if (base.endsWith("/")) base = base.slice(0, -1);
  // ensure path starts with a single slash
  let p = String(path || "");
  if (!p.startsWith("/")) p = `/${p}`;
  // avoid double slashes when path is just '/'
  if (p === "/") p = "/";
  return `${base}${p}`;
};

/* ---------------------------
   Input validation helpers
   --------------------------- */
const isString = (v) => typeof v === "string" || v instanceof String;
const isObject = (v) => v && typeof v === "object" && !Array.isArray(v);
const isBoolean = (v) => typeof v === "boolean";
const isNonEmptyString = (v) => isString(v) && v.trim().length > 0;

/** Simple email validation (conservative) */
const validateEmail = (email) => {
  if (!isNonEmptyString(email)) return false;
  // RFC-perfect regex is unnecessary; use a robust, conventional regex
  // which is good enough for frontend validation.
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.trim());
};

/* ---------------------------
   Service functions
   --------------------------- */

/**
 * Login admin (public)
 * POST /login
 * body: { email, password }
 */
export const login = async ({ email, password } = {}) => {
  // Frontend validation (matches backend expectations)
  if (!validateEmail(email)) {
    throw new Error("A valid email is required.");
  }
  if (!isNonEmptyString(password) || password.length < 6) {
    throw new Error("Password is required and must be at least 6 characters.");
  }

  const url = buildUrl("/login");
  return publicAxios.post(url, { email: email.trim(), password });
};

/**
 * Fetch all admins (requires auth)
 * GET /
 */
export const getAllAdmins = async () => {
  const url = buildUrl("/");
  return privateAxios.get(url);
};

/**
 * Add new admin (requires auth)
 * POST /
 * body: { name, email, password, permissions? }
 */
export const addAdmin = async ({ name, email, password, permissions = {} } = {}) => {
  if (!isNonEmptyString(name)) {
    throw new Error("Name is required and must be a non-empty string.");
  }
  if (!validateEmail(email)) {
    throw new Error("A valid email is required.");
  }
  if (!isNonEmptyString(password) || password.length < 6) {
    throw new Error("Password is required and must be at least 6 characters.");
  }
  if (!isObject(permissions)) {
    throw new Error("Permissions must be an object if provided.");
  }

  const url = buildUrl("/");
  const payload = {
    name: name.trim(),
    email: email.trim(),
    password,
    permissions,
  };
  return privateAxios.post(url, payload);
};

/**
 * Update admin password (requires auth)
 * PUT /:admin_id/password
 * body: { password }
 */
export const updatePassword = async (adminId, password) => {
  if (!isNonEmptyString(adminId)) {
    throw new Error("adminId is required and must be a non-empty string.");
  }
  if (!isNonEmptyString(password) || password.length < 6) {
    throw new Error("Password is required and must be at least 6 characters.");
  }

  const url = buildUrl(`/${encodeURIComponent(adminId)}/password`);
  return privateAxios.put(url, { password });
};

/**
 * Update admin permissions (requires auth)
 * PUT /:admin_id/permissions
 * body: { permissions }
 */
export const updatePermissions = async (adminId, permissions) => {
  if (!isNonEmptyString(adminId)) {
    throw new Error("adminId is required and must be a non-empty string.");
  }
  if (!isObject(permissions)) {
    throw new Error("Permissions must be an object.");
  }

  const url = buildUrl(`/${encodeURIComponent(adminId)}/permissions`);
  return privateAxios.put(url, { permissions });
};

/**
 * Update admin status (requires auth)
 * PUT /:admin_id/status
 * body: { status: boolean }
 */
export const updateStatus = async (adminId, status) => {
  if (!isNonEmptyString(adminId)) {
    throw new Error("adminId is required and must be a non-empty string.");
  }
  if (!isBoolean(status)) {
    throw new Error("Status is required and must be a boolean.");
  }

  const url = buildUrl(`/${encodeURIComponent(adminId)}/status`);
  return privateAxios.put(url, { status });
};

/**
 * Delete admin (requires auth)
 * DELETE /:admin_id
 */
export const deleteAdmin = async (adminId) => {
  if (!isNonEmptyString(adminId)) {
    throw new Error("adminId is required and must be a non-empty string.");
  }
  const url = buildUrl(`/${encodeURIComponent(adminId)}`);
  return privateAxios.delete(url);
};

/* ---------------------------
   Exports
   --------------------------- */

const AdminServices = {
  login,
  getAllAdmins,
  addAdmin,
  updatePassword,
  updatePermissions,
  updateStatus,
  deleteAdmin,
};

export default AdminServices;
