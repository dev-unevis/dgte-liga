import type { Timestamp } from "firebase/firestore";

export type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
  email: string;
  phone: string;
};

export type Member = TUser & {
  groupRanking: number;
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
  members: Array<{
    id: string;
    groupRanking: number;
    pointsInGroup: number;
  }>;
  createdAt: Timestamp;
};
