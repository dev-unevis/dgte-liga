import {
  Create,
  Delete,
  Edit,
  Group,
  MoreVert,
  Person,
} from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { serverTimestamp } from "firebase/firestore";
import { flatMap, sortBy } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import CreateGroupModal from "../components/CreateGroupModal";
import EditGroupModal from "../components/EditGroupModal";
import useCollection from "../hooks/useCollection";
import { useUsers } from "../providers/UsersProvider";
import type { Member, TGroup } from "../types";
import { addCollectionItem } from "../utils/addCollectionItem";
import { updateItem } from "../utils/updateDoc";

export default function GroupsPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGroup, setSelectedGroup] = useState<TGroup | null>();
  const [open, setIsOpen] = useState(false);
  const [createGroup, setCreateGroup] = useState(false);
  const { users: players } = useUsers();
  const { data, refresh } = useCollection<TGroup>("groups");
  const [groups, setGroups] = useState<TGroup[]>([]);

  useEffect(() => {
    setGroups(
      data.map((t) => {
        return {
          ...t,
          members: t.members.map((t) => ({
            ...t,
            ...players.find((p) => p.id === t.id),
          })),
        };
      })
    );
  }, [data, players]);

  const availableMembers = useMemo(() => {
    const members = flatMap(groups.map((t) => t.members));
    return players.filter((p) => !members.some((m) => m.id === p.id));
  }, [players, groups]);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    groupId: string
  ) => {
    setAnchorEl(event.currentTarget);
    const group = groups.find((g) => g.id === groupId);
    if (group) {
      setSelectedGroup(group);
    }
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGroup(null);
  };

  const onGroupCreate = async (groupName: string, members: Member[]) => {
    const memberIds = members.map((t) => t.id);
    await addCollectionItem<TGroup>("groups", {
      name: groupName,
      members: memberIds.map((id, index) => ({
        id,
        groupRanking: index + 1,
        pointsInGroup: 0,
      })),
      memberIds,
      createdAt: serverTimestamp(),
    } as TGroup);
    await refresh();
  };

  const onGroupEdit = async (groupName: string, members: Member[]) => {
    if (!selectedGroup?.id) return;
    const memberIds = members.map((t) => t.id);
    await updateItem<TGroup>("groups", selectedGroup?.id, {
      name: groupName,
      members: memberIds.map((id, index) => ({
        id,
        groupRanking: index + 1,
        pointsInGroup: 0,
      })),
      memberIds,
      createdAt: serverTimestamp(),
    } as TGroup);
    await refresh();
  };

  return (
    <>
      <Container maxWidth="lg" className="py-6">
        <div className="flex items-center gap-3 mb-6">
          <Group
            sx={{
              color: "primary.main",
            }}
          />
          <Typography variant="h4" className="font-semibold text-gray-800">
            Grupe
          </Typography>
        </div>

        <Box sx={{ mb: 2 }}>
          <DatePicker
            defaultValue={dayjs()}
            label={"Odaberi mjesec"}
            views={["month", "year"]}
          />
        </Box>

        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setCreateGroup(true)}
            startIcon={<Create />}
          >
            Kreiraj grupu
          </Button>
        </Box>
        <div className="flex flex-wrap gap-4">
          {sortBy(groups, "name").map((group) => (
            <Card
              key={group.id}
              className="h-full shadow-md hover:shadow-lg transition-shadow duration-200"
              sx={{
                minWidth: 300,
              }}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Chip
                      label={group.name}
                      variant="filled"
                      className="font-medium"
                    />
                    <Typography variant="body2" className="text-gray-500">
                      {group.members.length} člana
                    </Typography>
                  </div>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, group.id!)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreVert />
                  </IconButton>
                </div>

                {group.members && (
                  <div className="flex flex-col gap-2">
                    <Typography
                      variant="subtitle2"
                      className="text-gray-700 font-medium flex items-center gap-1"
                    >
                      <Person fontSize="small" />
                      Članovi grupe:
                    </Typography>
                    <div className="flex flex-col gap-2">
                      {sortBy(group.members, "groupRanking").map((member) => (
                        <div
                          key={member.id}
                          className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                        >
                          <p className="mx-2 font-semibold">
                            {member.groupRanking}.
                          </p>
                          <Avatar className="w-8 h-8 text-sm bg-blue-500">
                            {member.avatar}
                          </Avatar>
                          <div className="min-w-0 flex-1 flex justify-between mx-2">
                            <Typography
                              variant="body2"
                              className="font-medium text-gray-800 truncate"
                            >
                              {member.firstName}
                              &nbsp;
                              {member.lastName}
                            </Typography>
                            <Typography
                              variant="body2"
                              className="font-medium text-gray-800 truncate"
                            >
                              {member.pointsInGroup}
                            </Typography>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className="mt-2"
        >
          <MenuItem onClick={() => setIsOpen(true)}>
            <ListItemIcon>
              <Edit fontSize="small" />
            </ListItemIcon>
            <ListItemText primary="Uredi grupu" />
          </MenuItem>

          <MenuItem disabled onClick={handleMenuClose}>
            <ListItemIcon>
              <Delete fontSize="small" className="text-red-600" />
            </ListItemIcon>
            <ListItemText primary="Obriši grupu" className="text-red-600" />
          </MenuItem>
        </Menu>
      </Container>
      {selectedGroup && open && (
        <EditGroupModal
          onClose={() => setIsOpen(false)}
          open={open}
          currentMembers={selectedGroup.members}
          name={selectedGroup.name}
          availableMembers={availableMembers}
          onSave={onGroupEdit}
        />
      )}
      {createGroup && (
        <CreateGroupModal
          onClose={() => setCreateGroup(false)}
          open={createGroup}
          availableMembers={availableMembers}
          onSave={onGroupCreate}
        />
      )}
    </>
  );
}
