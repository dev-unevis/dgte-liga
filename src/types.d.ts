import type { Timestamp } from "firebase/firestore";

export type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  phone: string;
};

export interface EditGroupModalProps {
  open: boolean;
  onClose: () => void;
  name: string;
  currentMembers: Member[];
  availableMembers: TUser[];
  onSave: (groupName: string, members: Member[]) => Promise<void>;
}

export interface CreateGroupModalProps {
  open: boolean;
  onClose: () => void;
  availableMembers: TUser[];
  onSave: (groupName: string, members: Member[]) => Promise<void>;
}

export type TGroup = {
  id?: string;
  name: string;
  memberIds: string[];
  members: Array<
    {
      id: string;
      pointsInGroup?: number;
    } & TUser
  >;
  createdAt: Timestamp;
  color: string;
};

export type TStatus = "Čeka" | "Završen" | "Predano";

export type TMatch = {
  id?: string;
  playerOneId: string;
  playerTwoId: string;
  sets: Array<{
    setNumber: number;
    playerOneGames: number;
    playerTwoGames: number;
  }>;
  winnerId: string;
  scheduledAt: null | Date | Timestamp;
  status: TStatus;
  groupId: string;
};
