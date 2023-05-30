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
  const router = useRouter();

  const users = api.user.getUsers.useInfiniteQuery(
    {
      limit: 10,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const utils = api.useContext();
  const flatUsers = useMemo(
    () => users.data?.pages.map((page) => page.items).flat(1) || [],
    [users]
  );
  const deleteUser = api.user.deleteUser.useMutation({
    async onMutate(deletedUser: User) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.user.getUsers.cancel();

      // Get the data from the queryCache
      const prevData = utils.user.getUsers.getData();
      const newItems = flatUsers?.filter((item) => item.id !== deletedUser.id);

      // Optimistically update the data with our new comment
      utils.user.getUsers.setData(
        {},
        { items: [...newItems], nextCursor: undefined }
      );

      // Return the previous data so we can revert if something goes wrong
      return { prevData };
    },
    onError(err, newPost, ctx) {
      // If the mutation fails, use the context-value from onMutate
      utils.user.getUsers.setData({}, ctx?.prevData);
    },
    onSettled() {
      // Sync with server once mutation has settled
      users.refetch();
    },
  });

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
                    if (navigator && !navigator.onLine)
                      return alert("شما آفلاین هستید");
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
