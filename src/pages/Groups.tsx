import {
  Create,
  Delete,
  Edit,
  Group,
  MoreVert,
  Person,
  Schedule,
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
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { getAuth } from "firebase/auth";
import { serverTimestamp } from "firebase/firestore";
import { flatMap, reverse, sortBy } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import CreateGroupModal from "../components/CreateGroupModal";
import EditGroupModal from "../components/EditGroupModal";
import useCollection, { getData } from "../hooks/useCollection";
import { useUsers } from "../providers/UsersProvider";
import type { TGroup, TMatch, TUser } from "../types";
import { addCollectionItem } from "../utils/addCollectionItem";
import { generateSchedule } from "../utils/generateSchedule";
import { updateItem } from "../utils/updateItem";
import { setCollectionItem } from "../utils/setCollectionItem";

export const colors = [
  "#1976d2", // primary.main (blue)
  "#9c27b0", // secondary.main (purple)
  "#d32f2f", // error.main (red)
  "#ed6c02", // warning.main (orange)
  "#2e7d32", // success.main (green)
  "#0288d1", // info.main (cyan/teal)
  "#1565c0", // primary.dark (deep blue)
  "#7b1fa2", // secondary.dark (deep purple)
];

export default function GroupsPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGroup, setSelectedGroup] = useState<TGroup | null>();
  const [open, setIsOpen] = useState(false);
  const [createGroup, setCreateGroup] = useState(false);
  const { users: players } = useUsers();
  const { data, refresh } = useCollection<TGroup>("groups");
  const [groups, setGroups] = useState<TGroup[]>([]);
  const auth = getAuth();
  const [showOnlyMine, setShowOnlyMine] = useState(true);

  const initialize = async () => {
    let items: TMatch[] = [];

    for (const group of data) {
      const matches = await getData<TMatch>(`groups/${group.id}/matches`);
      items = items.concat(...matches);
    }

    const mappedGroups = data.map((group) => {
      return {
        ...group,
        members: group.members.map((member) => {
          const player = players.find((p) => p.id === member.id);
          return {
            ...member,
            ...player,
            pointsInGroup:
              items.filter((match) => match.winnerId === player?.id).length * 3,
          };
        }),
      };
    });
    setGroups(
      showOnlyMine
        ? mappedGroups.filter((g) =>
            g.memberIds.includes(auth.currentUser?.uid as string)
          )
        : mappedGroups
    );
  };

  useEffect(() => {
    initialize();
  }, [data, players, showOnlyMine]);

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

  const onGroupCreate = async (groupName: string, members: TUser[]) => {
    const memberIds = members.map((t) => t.id);
    await addCollectionItem<TGroup>("groups", {
      name: groupName,
      members: memberIds.map((id) => ({
        id,
      })),
      color: colors[groups.length ? groups.length - 1 : 0],
      memberIds,
      createdAt: serverTimestamp(),
    } as TGroup);
    await refresh();
  };

  const onGroupEdit = async (groupName: string, members: TUser[]) => {
    if (!selectedGroup?.id) return;
    const memberIds = members.map((t) => t.id);
    await updateItem<TGroup>("groups", selectedGroup?.id, {
      name: groupName,
      members: memberIds.map((id) => ({
        id,
      })),
      memberIds,
      createdAt: serverTimestamp(),
    } as TGroup);
    await refresh();
  };

  const createSchedule = async () => {
    const matches = await generateSchedule();
    for (const match of matches) {
      const doc = await addCollectionItem(
        `groups/${match.groupId}/matches`,
        match
      );
      await setCollectionItem(
        `users/${match.playerOneId}/matches/${doc.id}`,
        match
      );
      await setCollectionItem(
        `users/${match.playerTwoId}/matches/${doc.id}`,
        match
      );
    }
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
        <Button
          sx={{
            mb: 2,
          }}
          variant="contained"
          onClick={() => setShowOnlyMine((oldState) => !oldState)}
        >
          {showOnlyMine ? "Prikaži sve grupe" : "Prikaži samo moju grupu"}
        </Button>
        <Box sx={{ mb: 2 }}>
          <Button
            variant="contained"
            onClick={() => setCreateGroup(true)}
            startIcon={<Create />}
          >
            Kreiraj grupu
          </Button>
          <Button
            variant="outlined"
            sx={{ ml: 2 }}
            onClick={() => createSchedule()}
            startIcon={<Schedule />}
          >
            Generiraj raspored
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
                      sx={{
                        backgroundColor: group.color,
                        color: "white",
                      }}
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
                      Članovi skupine:
                    </Typography>
                    <div className="flex flex-col gap-2">
                      {reverse(sortBy(group.members, "pointsInGroup")).map(
                        (member, index) => (
                          <div
                            key={member.id}
                            className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <p className="mx-2 font-semibold">{index + 1}.</p>
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
                        )
                      )}
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
