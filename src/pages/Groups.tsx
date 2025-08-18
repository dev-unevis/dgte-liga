import { Delete, Edit, Group, MoreVert, Person } from "@mui/icons-material";
import {
  Avatar,
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
import { useState } from "react";
import EditGroupModal from "../components/EditGroupModal";
import type { TGroup } from "../types";
import groups from "../constants/groups";
import { sortBy } from "lodash-es";
import { players } from "../constants/players";

export default function GroupsPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedGroup, setSelectedGroup] = useState<TGroup | null>();
  const [open, setIsOpen] = useState(false);

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

        <div className="flex flex-wrap gap-4">
          {groups.map((group) => (
            <Card
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
                      color={group.color as any}
                      variant="filled"
                      className="font-medium"
                    />
                    <Typography variant="body2" className="text-gray-500">
                      {group.members.length} člana
                    </Typography>
                  </div>
                  <IconButton
                    size="small"
                    onClick={(e) => handleMenuClick(e, group.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreVert />
                  </IconButton>
                </div>

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
                        <div className="min-w-0 flex-1">
                          <Typography
                            variant="body2"
                            className="font-medium text-gray-800 truncate"
                          >
                            {member.firstName}
                            &nbsp;
                            {member.lastName}
                          </Typography>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
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
      {selectedGroup && (
        <EditGroupModal
          onClose={() => setIsOpen(false)}
          open={open}
          currentMembers={selectedGroup.members}
          groupName={selectedGroup.name}
          availableMembers={players}
          onSave={() => {}}
        />
      )}
    </>
  );
}
