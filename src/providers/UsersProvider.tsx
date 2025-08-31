import { createContext, useContext, type ReactNode } from "react";
import type { TUser } from "../types";
import useCollection from "../hooks/useCollection";

interface TUsersContext {
  users: TUser[];
  refresh: () => Promise<void>;
}

const UsersContext = createContext<TUsersContext | null>(null);

const useUsers = () =>
  useContext(UsersContext) || { users: [], refresh: () => {} };

const UsersProvider = ({ children }: { children: ReactNode }) => {
  const { data, refresh } = useCollection<TUser>("users");

  return (
    <UsersContext.Provider
      value={{
        users: data,
        refresh: refresh,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export { useUsers, UsersProvider };
