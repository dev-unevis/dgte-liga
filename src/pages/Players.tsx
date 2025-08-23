"use client";

import { Person, Phone, Search } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Container,
  InputAdornment,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useUsers } from "../providers/UsersProvider";
import { orderBy } from "firebase/firestore";
import { sortBy } from "lodash-es";

export default function Players() {
  const [searchTerm, setSearchTerm] = useState("");
  const { users: players } = useUsers();

  const filteredPlayers = players.filter(
    (player) =>
      `${player.firstName} ${player.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      player.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      player.phone.includes(searchTerm)
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 4 }}>
        <div className="flex items-center gap-3 mb-6">
          <Person
            sx={{
              color: "primary.main",
            }}
          />
          <Typography variant="h4" className="font-semibold text-gray-800">
            Igrači
          </Typography>
        </div>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Lista registriranih igrača
        </Typography>

        <TextField
          fullWidth
          variant="outlined"
          placeholder="Pretražite igrače po imenu, email-u ili telefonu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3, maxWidth: 400 }}
        />
      </Box>

      <TableContainer component={Paper} elevation={2}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow sx={{ backgroundColor: "primary.main" }}>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Igrač
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Ime
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Prezime
              </TableCell>
              <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Telefon
              </TableCell>
              {/* <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Email
              </TableCell> */}
              {/* <TableCell sx={{ color: "white", fontWeight: 600 }}>
                Akcije
              </TableCell> */}
            </TableRow>
          </TableHead>
          <TableBody>
            {sortBy(filteredPlayers, "lastName").map((player) => {
              // const defaultEmail =
              //   player.firstName.toLowerCase() +
              //   player.lastName.toLowerCase() +
              //   "@" +
              //   player.firstName.toLowerCase() +
              //   player.lastName.toLowerCase();
              // const isDefaultEmail = defaultEmail === player.email;
              return (
                <TableRow
                  key={player.id}
                  sx={{
                    "&:hover": { backgroundColor: "action.hover" },
                    "&:nth-of-type(odd)": {
                      backgroundColor: "action.selected",
                    },
                  }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        sx={{ bgcolor: "primary.main", width: 40, height: 40 }}
                        className="text-sm!"
                      >
                        {player.firstName[0]}
                        {player.lastName[0]}
                      </Avatar>
                    </Box>
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {player.firstName}
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500 }}>
                    {player.lastName}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Phone fontSize="small" color="action" />
                      {player.phone}
                    </Box>
                  </TableCell>
                  {/* <TableCell>
                    {!isDefaultEmail ? (
                      <Box
                        sx={{ display: "flex", alignItems: "center", gap: 1 }}
                      >
                        <Email fontSize="small" color="action" />
                        {player.email}
                      </Box>
                    ) : (
                      "-"
                    )}
                  </TableCell> */}
                  {/* <TableCell>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <IconButton size="small" color="primary">
                      <Edit fontSize="small" />
                    </IconButton>
                    <IconButton size="small" color="error">
                      <Delete fontSize="small" />
                    </IconButton>
                  </Box>
                </TableCell> */}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      {filteredPlayers.length === 0 && (
        <Box sx={{ textAlign: "center", py: 4 }}>
          <Typography variant="h6" color="text.secondary">
            Nema pronađenih igrača
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Pokušajte sa drugačijim pojmom pretrage
          </Typography>
        </Box>
      )}
    </Container>
  );
}
