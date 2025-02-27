import React, { useState } from "react";
import { toast } from "sonner";
import { useLanguage } from "~/context/language.context";
import UsersTable, {
  AcUser,
} from "~/pages/admin/settings/active-directory/user-table";
import Button from "~/ui/buttons";
import ThreeDotsWave from "~/ui/loadings/three-dots-wave";
import { api } from "~/utils/api";

export default function ActiveDirectoryUsersList() {
  const users = api.activeDirectory.getUsers.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  const createManyAcUsersMutate = api.user.createMultipleAcUsers.useMutation({
    onSuccess: () => {},
  });
  const [selectedUsers, setSelectedUsers] = useState<AcUser[]>([]);

  const { t } = useLanguage();
  return (
    <div className="flex flex-col gap-2">
      <Button
        isLoading={users.isFetching}
        className="bg-primary px-3 text-secondary"
        onClick={() => {
          users.refetch();
        }}
      >
        {t.refresh}
      </Button>
      <Button
        disabled={selectedUsers.length <= 0}
        isLoading={users.isFetching || createManyAcUsersMutate.isLoading}
        className="bg-primbuttn px-3 text-primary"
        onClick={() => {
          createManyAcUsersMutate.mutate(
            selectedUsers.map((a) => {
              return {
                email: a.mail,
                display_name: a.displayName,
                username: a.sAMAccountName,
              };
            })
          );
        }}
      >
        {t.add}
      </Button>
      {users.isLoading ? (
        <ThreeDotsWave />
      ) : (
        <UsersTable
          users={users?.data ?? []}
          onSelectionChange={(values) => {
            console.log({ values });
            setSelectedUsers(values);
          }}
        />
      )}
    </div>
  );
}
function getType(value) {
  if (Array.isArray(value)) return "array";
  if (value === null) return "null";
  return typeof value;
}
const JsonTypeViewer = ({ jsonData }) => {
  return (
    <div className="rounded-lg bg-gray-100 p-4">
      <h2 className="mb-2 text-lg font-bold">JSON Type Viewer</h2>
      <ul className="list-disc pl-4">
        {Object.entries(jsonData).map(([key, value]) => (
          <li key={key} className="text-sm">
            <strong>{key}</strong>:{" "}
            <span className="text-blue-600">{getType(value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};
