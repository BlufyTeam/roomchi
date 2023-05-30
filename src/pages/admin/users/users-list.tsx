import { User } from "@prisma/client";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import Table from "~/features/table";
import { ROLES } from "~/server/constants";

import Button from "~/ui/buttons";
import withConfirmation from "~/ui/with-confirmation";
import { api } from "~/utils/api";

const ButtonWithConfirmation = withConfirmation(Button);

export default function UsersList({ onRowClick = (user: User) => {} }) {
  const deleteUser = api.user.deleteUser.useMutation({});
  const router = useRouter();
  const users = api.user.getUsers.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const flatUsers = useMemo(
    () => users.data?.pages.map((page) => page.items).flat(1) || [],
    [users]
  );

  const columns =
    useMemo(
      () => [
        {
          Header: "نام",
          accessor: "name",
          Cell: ({ row }) => {
            const user = row.original;
            return (
              <div className="w-full cursor-pointer rounded-full  px-2 py-2 text-primary  ">
                {user.name}
              </div>
            );
          },
        },
        {
          Header: "نام کاربری",
          accessor: "first_nameAndlast_name",
          Cell: ({ row }) => {
            const user: User = row.original;
            return (
              <div className="w-full cursor-pointer rounded-full  px-2 py-2 text-primary  ">
                {user.username}
              </div>
            );
          },
        },

        {
          Header: "نقش",
          accessor: "role",
          Cell: ({ row }) => {
            const user: User = row.original;
            return (
              <div className="text-atysa-900 w-full cursor-pointer  rounded-full px-2 py-2  ">
                {ROLES.find((a) => a.value.key === user.role).value.name}
              </div>
            );
          },
        },
        {
          Header: "عملیات",
          accessor: "",
          Cell: ({ row }) => {
            const user: User = row.original;
            return (
              <div
                className="flex items-center justify-center gap-5"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Button
                  onClick={async () => {
                    await signIn("credentials", {
                      username: user.username,
                      password: user.password,
                      callbackUrl: `${window.location.origin}/`,
                      redirect: true,
                    });
                  }}
                  className="w-full cursor-pointer rounded-full bg-secbuttn px-2 py-2 text-primbuttn  "
                >
                  ورود
                </Button>
                <ButtonWithConfirmation
                  isLoading={deleteUser.isLoading}
                  onClick={async () => {
                    await deleteUser.mutateAsync({ id: user.id });
                    router.replace(`/admin/users/`, `/admin/users/`);
                  }}
                  title="حذف کاربر"
                  className="w-full cursor-pointer rounded-full bg-primary px-2 py-2 text-secbuttn  "
                >
                  حذف
                </ButtonWithConfirmation>
              </div>
            );
          },
        },
      ],
      []
    ) || [];

  const isUsersLoading = users.isFetchingNextPage || users.isLoading;
  if (isUsersLoading) return <UsersSkeleton />;

  return (
    <>
      <Table
        {...{
          columns: flatUsers.length > 0 ? columns : [],
          data: flatUsers,
        }}
        onClick={(cell) => {
          const user: User = cell.row.original;
          onRowClick(user);
        }}
      />
    </>
  );
}

function UsersSkeleton() {
  return (
    <>
      {[...Array(11).keys()].map((i) => {
        return (
          <>
            <span
              key={i}
              className="inline-block h-12 w-full animate-pulse rounded-xl bg-accent"
              style={{
                animationDelay: `${i * 5}`,
                animationDuration: "1s",
              }}
            />
          </>
        );
      })}
    </>
  );
}
