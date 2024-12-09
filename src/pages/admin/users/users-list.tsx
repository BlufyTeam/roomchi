import { User } from "~/types";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { useUser } from "~/context/user.context";
import Table from "~/features/table";
import { ROLES } from "~/server/constants";

import Button from "~/ui/buttons";
import withConfirmation from "~/ui/with-confirmation";
import { api } from "~/utils/api";
import { useLanguage } from "~/context/language.context";
import { translations } from "~/utils/translations";

const ButtonWithConfirmation = withConfirmation(Button);

export default function UsersList() {
  const { setSelectedRowUser, selectedRowUser } = useUser();

  const users = api.user.getUsers.useInfiniteQuery(
    {
      limit: 8,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    }
  );

  const flatUsers: any = useMemo(() => {
    return users.data?.pages.map((page) => page.items).flat(1) || [];
  }, [users]);

  const router = useRouter();
  const { language } = useLanguage();
  const t = translations[language];
  const utils = api.useContext();
  const deleteUser = api.user.deleteUser.useMutation({
    async onMutate(deletedUser: User) {
      // Cancel outgoing fetches (so they don't overwrite our optimistic update)
      await utils.user.getUsers.cancel();

      // Get the data from the queryCache
      const prevData = utils.user.getUsers.getInfiniteData();
      const newItems = flatUsers?.filter((item) => item.id !== deletedUser.id);
      //console.log({ prevData });
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
      //utils.user.getUsers.setData({}, ctx?.prevData);
    },
    onSettled() {
      // Sync with server once mutation has settled
      // utils.user.getUserById.invalidate({id:ctx.});
    },
    onSuccess: () => {
      setSelectedRowUser(undefined);
    },
  });

  const columns =
    useMemo(
      () => [
        {
          Header: "#",
          accessor: "number",
          Cell: ({ row }) => {
            return (
              <div className="w-full cursor-pointer rounded-full  px-2 py-2 text-primary  ">
                {row.index + 1}
              </div>
            );
          },
        },
        {
          Header: t.name,
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
          Header: t.username,
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
          Header: t.company,
          accessor: "user.company.name",
          Cell: ({ row }) => {
            const user: User = row.original;
            return (
              <div className="text-atysa-900 w-full cursor-pointer  rounded-full px-2 py-2  ">
                {user?.company?.name}
              </div>
            );
          },
        },
        {
          Header: t.role,
          accessor: "role",
          Cell: ({ row }) => {
            const user: User = row.original;
            return (
              <div className="text-atysa-900 w-full cursor-pointer  rounded-full px-2 py-2  ">
                {ROLES.find((a) => a.value.key === user.role)?.value.name ?? ""}
              </div>
            );
          },
        },
        {
          Header: t.options,
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
                  {t.enter}
                </Button>
                <ButtonWithConfirmation
                  isLoading={deleteUser.isLoading || !user.id}
                  onClick={async () => {
                    if (navigator && !navigator.onLine) return alert(t.offline);
                    await deleteUser.mutateAsync({ id: user.id });
                    router.replace(`/admin/users/`, `/admin/users/`);
                  }}
                  title={t.delete + " " + t.user}
                  className="w-full cursor-pointer rounded-full bg-primary px-2 py-2 text-secbuttn"
                >
                  {t.delete}
                </ButtonWithConfirmation>
              </div>
            );
          },
        },
      ],
      []
    ) || [];

  if (users.isLoading) return <UsersSkeleton />;

  return (
    <>
      <span className="text-primary">{flatUsers.length}</span>

      <Table
        {...{
          columns: flatUsers.length > 0 ? columns : [],
          data: flatUsers,
        }}
        clickedRowIndex={selectedRowUser?.id}
        onClick={(cell) => {
          const user = cell.row.original;
          setSelectedRowUser(user);
        }}
      />
      <div className="flex items-center justify-center gap-5 py-5">
        <Button
          disabled={users.isLoading || !users.hasNextPage}
          isLoading={users.isLoading}
          onClick={() => {
            users.fetchNextPage();
          }}
          className="w-fit cursor-pointer rounded-full bg-secbuttn px-4 py-2 text-primbuttn  "
        >
          {users.hasNextPage ? t.more : t.end}
        </Button>
      </div>
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
              className="inline-block h-12 w-full animate-pulse rounded-xl bg-accent opacity-30"
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
