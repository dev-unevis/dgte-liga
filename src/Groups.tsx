import { Group, MoreVert, Person } from "@mui/icons-material";
import {
  Avatar,
  Card,
  CardContent,
  Chip,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { playersData } from "./playersData";

const generateGroups = () => {
  const groups = [];
  const colors = [
    "primary",
    "secondary",
    "success",
    "warning",
    "error",
    "info",
    "default",
    "primary",
  ];

  for (let i = 0; i < 8; i++) {
    const startIndex = i * 4;
    const groupMembers = playersData
      .slice(startIndex, startIndex + 4)
      .map((player) => ({
        id: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        avatar: `${player.firstName.charAt(0)}${player.lastName.charAt(0)}`,
      }));

    groups.push({
      id: i + 1,
      name: `Grupa ${String.fromCharCode(65 + i)}`, // A, B, C, D, E, F, G, H
      color: colors[i],
      members: groupMembers,
    });
  }

  return groups;
};

const groupsData = generateGroups();

export default function GroupsPage() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [_selectedGroup, setSelectedGroup] = useState<number | null>(null);

  const handleMenuClick = (
    event: React.MouseEvent<HTMLElement>,
    groupId: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedGroup(groupId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedGroup(null);
  };

  return (
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
        {groupsData.map((group) => (
          <Card className="h-full shadow-md hover:shadow-lg transition-shadow duration-200">
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

              <div className="space-y-3">
                <Typography
                  variant="subtitle2"
                  className="text-gray-700 font-medium flex items-center gap-1"
                >
                  <Person fontSize="small" />
                  Članovi grupe:
                </Typography>
                <div className="flex flex-col">
                  {group.members.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center gap-2 p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                    >
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
        <MenuItem onClick={handleMenuClose} className="text-sm">
          Uredi grupu
        </MenuItem>
        <MenuItem onClick={handleMenuClose} className="text-sm text-red-600">
          Obriši grupu
        </MenuItem>
      </Menu>
    </Container>
  );
}
