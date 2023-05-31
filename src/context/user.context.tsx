import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { User } from "~/types";
import { api } from "~/utils/api";

type TUserContext = {
  user: User;
  setUser: (user: User) => void;

  selectedRowUser: User | undefined;
  setSelectedRowUser: (user: User) => unknown;

  flatUsers: User[];

  refetchUsers: () => unknown;

  fetchNextPage: () => unknown;

  hasNextPage: boolean;

  isUsersLoading: boolean;

  utils: any;
};

type UserProviderProps = {
  children: ReactNode;
};
const UserContext = createContext({} as TUserContext);

export function useUser() {
  return useContext(UserContext);
}

export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User>();

  const [selectedRowUser, setSelectedRowUser] = useState<User | undefined>(
    undefined
  );
  console.log("rerendered");
  const utils = api.useContext();
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
  function refetchUsers() {
    users.refetch();
  }

  function fetchNextPage() {
    users.fetchNextPage();
  }

  const isUsersLoading = users.isLoading;
  const hasNextPage = users.hasNextPage;
  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        selectedRowUser,
        setSelectedRowUser,
        flatUsers,
        refetchUsers,
        fetchNextPage,
        hasNextPage,
        isUsersLoading,
        utils,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
