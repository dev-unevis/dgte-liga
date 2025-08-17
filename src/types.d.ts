export type TUser = {
  id: string;
  firstName: string;
  lastName: string;
  avatar: string;
};

export type Member = TUser & {
  groupRanking: number;
};

export interface EditGroupModalProps {
  open: boolean;
  onClose: () => void;
  groupName: string;
  currentMembers: Member[];
  availableMembers: TUser[];
  onSave: (members: Member[]) => void;
}

export type TGroup = {
  id: string;
  name: string;
  color: string;
  members: Member[];
};
