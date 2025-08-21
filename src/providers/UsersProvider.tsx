import { createContext, useContext, type ReactNode } from "react";
import type { TUser } from "../types";
import useCollection from "../hooks/useCollection";

interface TUsersContext {
  users: TUser[];
}

const UsersContext = createContext<TUsersContext | null>(null);

const useUsers = () => useContext(UsersContext) || { users: [] };

const UsersProvider = ({ children }: { children: ReactNode }) => {
  const { data } = useCollection<TUser>("users");
  return (
    <UsersContext.Provider
      value={{
        users: data,
      }}
    >
      {children}
    </UsersContext.Provider>
  );
};

export { useUsers, UsersProvider };
