import { ROLES } from "~/server/constants";

/**
 * Filters the roles that the current user can pick to create a new user.
 * @param {string} currentUserRole - The role of the current user.
 * @returns {Array} - A list of roles the current user can assign.
 */
export const getAssignableRoles = (currentUserRole) => {
  return ROLES.filter((role) => role.hasAccess(currentUserRole)).map(
    (role) => role.value
  );
};
