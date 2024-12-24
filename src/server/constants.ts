export const ROLES = [
  {
    id: 0,
    value: {
      key: "USER",
      name: "User",
    },
    hasAccess: (role) => {
      return ["SUPER_ADMIN", "ADMIN"].includes(role); // ADMIN can be assigned by SUPER_ADMIN and ADMIN
    },
  },
  {
    id: 1,
    value: {
      key: "ADMIN",
      name: "Admin",
    },
    hasAccess: (role) => {
      return ["SUPER_ADMIN", "ADMIN"].includes(role); // ADMIN can be assigned by SUPER_ADMIN and ADMIN
    },
  },
  {
    id: 2,
    value: {
      key: "ROOM",
      name: "Room",
    },
    hasAccess: (role) => {
      return ["ADMIN", "SUPER_ADMIN"].includes(role); // ROOM can be assigned by ADMIN and SUPER_ADMIN
    },
  },
  {
    id: 3,
    value: {
      key: "SUPER_ADMIN",
      name: "Super Admin",
    },
    hasAccess: (role) => {
      return ["SUPER_ADMIN"].includes(role); // SUPER_ADMIN can only be assigned by SUPER_ADMIN
    },
  },
];
