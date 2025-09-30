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
import { flatMap, reverse, sortBy } from "lodash-es";
import { useEffect, useMemo, useState } from "react";
import CreateGroupModal from "../components/CreateGroupModal";
import EditGroupModal from "../components/EditGroupModal";
import { useAuth } from "../providers/AuthProvider";
import { useLoader } from "../providers/Loader";
import { useUsers } from "../providers/UsersProvider";
import type { TGroup, TGroupMember, TMatch } from "../types";
import { supabase } from "../utils/supabase";

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
  const [groups, setGroups] = useState<TGroup[]>([]);
  const { user } = useAuth();
  const player = players.find((p) => p.user_id === user?.id);
  const [showOnlyMine, setShowOnlyMine] = useState(true);
  const { setLoading } = useLoader();

  useEffect(() => {
    if (player && player.is_viewer) {
      setShowOnlyMine(false);
    }
  }, [user?.id, players]);

  const initialize = async () => {
    setLoading(true);

    const { data } = await supabase
      .from("group")
      .select(
        `
      *,
      members:group_member (
        *,
        user:user_id (*)
      )
    `
      )
      .eq("is_deleted", false) // Filter groups where is_deleted is false
      .eq("members.is_deleted", false); // Filter members where is_deleted is false

    if (data) {
      let items: TMatch[] = [];

      const mappedGroups = (data as TGroup[]).map((group) => {
        return {
          ...group,
          members: group.members.map((member) => {
            return {
              ...member,
              points_in_group:
                items.filter((match) => match.winner_id === member.user_id)
                  .length * 3,
            };
          }),
        };
      });
      setGroups(
        showOnlyMine
          ? mappedGroups.filter((g) =>
              g.members.map((t) => t.user_id).includes(user?.id as string)
            )
          : mappedGroups
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    initialize();
  }, [showOnlyMine]);

  const availableMembers = useMemo(() => {
    const members = flatMap(groups.map((t) => t.members));
    return players.filter((p) => !members.some((m) => m.user_id === p.user_id));
  }, [groups, players]);

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

  const onGroupDelete = async () => {
    if (!selectedGroup?.id) return;
    await supabase
      .from("group")
      .update({ is_deleted: true })
      .eq("id", selectedGroup.id);
    handleMenuClose();
    await initialize();
  };

  const onGroupCreate = async (groupName: string, members: TGroupMember[]) => {
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const { data } = await supabase
      .from("group")
      .insert({
        name: groupName,
        color: randomColor,
      })
      .select("*");

    if (data) {
      const group = data[0];
      for (const member of members) {
        await supabase.from("group_member").insert({
          group_id: group.id,
          user_id: member.user_id,
          is_deleted: false,
        });
      }
    }
    await initialize();
  };

  const onGroupEdit = async (groupName: string, members: TGroupMember[]) => {
    if (!selectedGroup?.id) return;

    await supabase
      .from("group")
      .update({ name: groupName })
      .eq("id", selectedGroup.id);

    const currentMemberIds = (selectedGroup.members || []).map(
      (m) => m.user_id
    );
    const nextMemberIds = members.map((m) => m.user_id);

    const toRemove = currentMemberIds.filter(
      (id) => !nextMemberIds.includes(id)
    );
    const toAdd = nextMemberIds.filter((id) => !currentMemberIds.includes(id));

    if (toRemove.length > 0) {
      await supabase
        .from("group_member")
        .update({ is_deleted: true })
        .eq("group_id", selectedGroup.id)
        .in("user_id", toRemove);
    }

    if (toAdd.length > 0) {
      const { data: existing } = await supabase
        .from("group_member")
        .select("user_id, is_deleted")
        .eq("group_id", selectedGroup.id)
        .in("user_id", toAdd);

      const existingIds = (existing || []).map(
        (e: { user_id: string }) => e.user_id
      );
      const needUndelete = toAdd.filter((id) => existingIds.includes(id));
      const needInsert = toAdd.filter((id) => !existingIds.includes(id));

      if (needUndelete.length > 0) {
        await supabase
          .from("group_member")
          .update({ is_deleted: false })
          .eq("group_id", selectedGroup.id)
          .in("user_id", needUndelete);
      }

      if (needInsert.length > 0) {
        const rows = needInsert.map((id) => ({
          group_id: selectedGroup.id,
          user_id: id,
          is_deleted: false,
        }));
        await supabase.from("group_member").insert(rows);
      }
    }

    await initialize();
  };

  // const createSchedule = async () => {
  //   const matches = await generateSchedule();
  // };

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

        {/* <Box sx={{ mb: 2 }}>
          <DatePicker
            defaultValue={dayjs()}
            label={"Odaberi mjesec"}
            views={["month", "year"]}
          />
        </Box> */}
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

          {/* Schedule generation button can be wired to call generateSchedule and insert rows */}
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
                            key={member.user.user_id}
                            className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                          >
                            <p className="mx-2 font-semibold">{index + 1}.</p>
                            <Avatar className="w-8 h-8 text-sm bg-blue-500">
                              {member.user.avatar}
                            </Avatar>
                            <div className="min-w-0 flex-1 flex justify-between mx-2">
                              <Typography
                                variant="body2"
                                className="font-medium text-gray-800 truncate"
                              >
                                {member.user.first_name}
                                &nbsp;
                                {member.user.last_name}
                              </Typography>
                              <Typography
                                variant="body2"
                                className="font-medium text-gray-800 truncate"
                              >
                                {member.points_in_group}
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

          <MenuItem onClick={onGroupDelete}>
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
          currentMembers={[...selectedGroup.members]}
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
