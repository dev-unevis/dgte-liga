import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Schedule,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import useCollection, { getData } from "../hooks/useCollection";
import { useUsers } from "../providers/UsersProvider";
import type { TGroup, TMatch } from "../types";
import { updateItem } from "../utils/updateItem";
import type { Timestamp } from "firebase/firestore";
import { sortBy } from "lodash-es";
import { getAuth } from "firebase/auth";

export default function Matches() {
  const [selectedMatch, setSelectedMatch] = useState<TMatch | null>(null);
  const [matches, setMatches] = useState<TMatch[]>([]);
  const { users: players } = useUsers();
  const { data: groups, refresh } = useCollection<TGroup>("groups");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down("sm"));
  const auth = getAuth();
  const [showOnlyMine, setShowOnlyMine] = useState(false);

  const getGroupMatches = async () => {
    let items: TMatch[] = [];

    for (const group of sortBy(groups, "name")) {
      const groupMatches = await getData<TMatch>(`groups/${group.id}/matches`);
      items = items.concat(groupMatches);
    }

    const uid = auth.currentUser?.uid;
    setMatches(
      showOnlyMine
        ? items.filter((t) =>
            [t.playerOneId, t.playerTwoId].includes(uid as string)
          )
        : items
    );
  };

  useEffect(() => {
    getGroupMatches();
  }, [groups, auth.currentUser, showOnlyMine]);

  const getPlayer = (id: string) => {
    const player = players.find((p) => p.id.toString() === id);
    return player;
  };

  const getPlayerGroup = (playerId: string) => {
    return groups.find((group) =>
      group.members.some((member) => member.id === playerId)
    );
  };

  const handleMatchSelect = (match: TMatch) => {
    setSelectedMatch({ ...match });
    setModalOpen(true);
  };

  const calculateSetResult = (match: TMatch) => {
    const hasResults = match.sets.some(
      (set) => set.playerOneGames > 0 || set.playerTwoGames > 0
    );
    if (!hasResults) return "-";

    let playerOneSets = 0;
    let playerTwoSets = 0;

    match.sets.forEach((set) => {
      if (set.playerOneGames > set.playerTwoGames) {
        playerOneSets++;
      } else if (set.playerTwoGames > set.playerOneGames) {
        playerTwoSets++;
      }
    });

    return `${playerOneSets} - ${playerTwoSets}`;
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedMatch(null);
  };

  const handleSetScoreChange = (
    setIndex: number,
    player: "one" | "two",
    value: number
  ) => {
    if (!selectedMatch) return;

    const updatedMatch = { ...selectedMatch };
    if (player === "one") {
      updatedMatch.sets[setIndex].playerOneGames = Math.max(0, value);
    } else {
      updatedMatch.sets[setIndex].playerTwoGames = Math.max(0, value);
    }
    setSelectedMatch(updatedMatch);
  };

  const determineWinner = (match: TMatch): string => {
    let playerOneSets = 0;
    let playerTwoSets = 0;

    match.sets.forEach((set) => {
      if (set.playerOneGames > set.playerTwoGames) {
        playerOneSets++;
      } else if (set.playerTwoGames > set.playerOneGames) {
        playerTwoSets++;
      }
    });

    if (playerOneSets > playerTwoSets) {
      return match.playerOneId;
    } else if (playerTwoSets > playerOneSets) {
      return match.playerTwoId;
    } else {
      return "";
    }
  };

  const saveMatchResults = async () => {
    if (!selectedMatch || !selectedMatch.id) return;

    const winner = determineWinner(selectedMatch);
    const updatedMatch = { ...selectedMatch, winnerId: winner };

    updatedMatch.status = winner ? "Završen" : "Čeka";

    const path = `groups/${updatedMatch.groupId}/matches`;

    await updateItem(path, selectedMatch.id, updatedMatch);
    await refresh();
    setSnackbar({
      open: true,
      message: "Rezultati meča su uspješno spremljeni!",
      severity: "success",
    });
    setModalOpen(false);
    setSelectedMatch(null);
  };

  const getMatchWinnerDisplay = (match: TMatch) => {
    const winnerId = determineWinner(match);
    if (!winnerId) return "-";

    const winner = getPlayer(winnerId);
    return winner ? `${winner.firstName} ${winner.lastName}` : "-";
  };

  const handleScheduledTimeChange = (newDateTime: string) => {
    if (!selectedMatch) return;
    setSelectedMatch({ ...selectedMatch, scheduledAt: new Date(newDateTime) });
  };

  const formatScheduledTime = (scheduledAt: Timestamp) => {
    if (!scheduledAt) return "-";

    try {
      const date = scheduledAt.toDate();
      if (isNaN(date.getTime())) return "-";
      return date.toLocaleString("hr-HR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (error) {
      console.log("[v0] Error formatting scheduled time:", error);
      return "-";
    }
  };

  const formatDateTimeForInput = (scheduledAt: Date | Timestamp | null) => {
    if (!scheduledAt) return "";

    const date =
      scheduledAt instanceof Date ? scheduledAt : scheduledAt.toDate();
    try {
      if (isNaN(date.getTime())) return "";
      return date.toISOString().slice(0, 16);
    } catch (error) {
      console.log("[v0] Error formatting date:", error);
      return "";
    }
  };

  const playerOne = selectedMatch ? getPlayer(selectedMatch.playerOneId) : null;
  const playerTwo = selectedMatch ? getPlayer(selectedMatch.playerTwoId) : null;
  const playerOneGroup = playerOne
    ? getPlayerGroup(selectedMatch!.playerOneId)
    : null;
  const playerTwoGroup = playerTwo
    ? getPlayerGroup(selectedMatch!.playerTwoId)
    : null;

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <div className="flex items-center gap-3 mb-6">
        <Schedule
          sx={{
            color: "primary.main",
          }}
        />
        <Typography variant="h4" className="font-semibold text-gray-800">
          Raspored
        </Typography>
      </div>
      <Button
        sx={{
          mb: 2,
        }}
        variant="contained"
        onClick={() => setShowOnlyMine((oldState) => !oldState)}
      >
        {showOnlyMine ? "Prikaži sve mečeve" : "Prikaži samo moje mečeve"}
      </Button>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Meč #</strong>
              </TableCell>
              <TableCell>
                <strong>Igrač 1</strong>
              </TableCell>
              <TableCell>
                <strong>Igrač 2</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Rezultat</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Pobjednik</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Zakazano</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Status</strong>
              </TableCell>
              <TableCell align="center">
                <strong>Akcije</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {matches.map((match, index) => {
              const p1 = getPlayer(match.playerOneId);
              const p2 = getPlayer(match.playerTwoId);
              const p1Group = getPlayerGroup(match.playerOneId);
              const p2Group = getPlayerGroup(match.playerTwoId);
              const isCompleted = match.status === "Završen";

              return (
                <TableRow
                  key={match.id}
                  hover
                  sx={{
                    "&:hover": {
                      backgroundColor: "action.hover",
                      cursor: "pointer",
                    },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="medium">
                      {index + 1}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor: p1Group?.color + ".main",
                          width: 32,
                          height: 32,
                          fontSize: "0.875rem",
                        }}
                      >
                        {p1?.avatar}
                      </Avatar>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          gap: 2,
                          width: "60%",
                        }}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          {p1?.firstName} {p1?.lastName}
                        </Typography>
                        <Chip
                          label={p1Group?.name}
                          variant="filled"
                          sx={{
                            backgroundColor: p1Group?.color,
                            color: "white",
                          }}
                          className="font-medium"
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Box display="flex" alignItems="center" gap={2}>
                      <Avatar
                        sx={{
                          bgcolor: p2Group?.color + ".main",
                          width: 32,
                          height: 32,
                          fontSize: "0.875rem",
                        }}
                      >
                        {p2?.avatar}
                      </Avatar>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 2,
                          width: "60%",
                        }}
                      >
                        <Typography variant="body2" fontWeight="medium">
                          {p2?.firstName} {p2?.lastName}
                        </Typography>
                        <Chip
                          label={p2Group?.name}
                          variant="filled"
                          sx={{
                            backgroundColor: p2Group?.color,
                            color: "white",
                          }}
                          className="font-medium"
                        />
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="h6">
                      {calculateSetResult(match)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2">
                      {getMatchWinnerDisplay(match)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="body2" fontSize="0.875rem">
                      {formatScheduledTime(match.scheduledAt as Timestamp)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {isCompleted ? (
                      <Chip label="Završen" size="small" color="success" />
                    ) : (
                      <Chip label="Čeka" size="small" color="default" />
                    )}
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<EditIcon />}
                      onClick={() => handleMatchSelect(match)}
                    >
                      Uredi
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      <Dialog
        open={modalOpen}
        onClose={handleModalClose}
        maxWidth="md"
        fullWidth
        fullScreen={isMobile}
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: 0, sm: 2 },
            maxHeight: { xs: "100vh", sm: "90vh" },
            borderRadius: { xs: 0, sm: 2 },
          },
        }}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography
              variant="h6"
              sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
            >
              Unesite rezultate meča
            </Typography>
            <IconButton onClick={handleModalClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent dividers sx={{ px: { xs: 2, sm: 3 } }}>
          {selectedMatch && (
            <>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
                gap={2}
              >
                <Box
                  display="flex"
                  alignItems="center"
                  gap={2}
                  width={{ xs: "100%", sm: "auto" }}
                >
                  <Avatar
                    sx={{
                      bgcolor: playerOneGroup?.color + ".main",
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                    }}
                  >
                    {playerOne?.avatar}
                  </Avatar>
                  <Box>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                    >
                      {playerOne?.firstName} {playerOne?.lastName}
                    </Typography>
                    <Chip
                      label={playerOneGroup?.name}
                      size="small"
                      color={playerOneGroup?.color as any}
                    />
                  </Box>
                </Box>

                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{
                    fontSize: { xs: "1.1rem", sm: "1.5rem" },
                  }}
                >
                  PROTIV
                </Typography>

                <Box
                  display="flex"
                  alignItems="center"
                  justifyContent="flex-end"
                  gap={2}
                  width={{ xs: "100%", sm: "auto" }}
                >
                  <Box textAlign={{ xs: "left", sm: "right" }}>
                    <Typography
                      variant="h6"
                      sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                    >
                      {playerTwo?.firstName} {playerTwo?.lastName}
                    </Typography>
                    <Chip
                      label={playerTwoGroup?.name}
                      size="small"
                      color={playerTwoGroup?.color as any}
                    />
                  </Box>
                  <Avatar
                    sx={{
                      bgcolor: playerTwoGroup?.color + ".main",
                      width: { xs: 40, sm: 48 },
                      height: { xs: 40, sm: 48 },
                    }}
                  >
                    {playerTwo?.avatar}
                  </Avatar>
                </Box>
              </Box>

              {selectedMatch.status !== "Završen" && (
                <>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                  >
                    Zakazano vrijeme
                  </Typography>
                  <Box mb={3}>
                    <TextField
                      fullWidth
                      type="datetime-local"
                      label="Datum i vrijeme meča"
                      value={formatDateTimeForInput(selectedMatch.scheduledAt)}
                      onChange={(e) =>
                        handleScheduledTimeChange(
                          new Date(e.target.value).toISOString()
                        )
                      }
                      InputLabelProps={{
                        shrink: true,
                      }}
                      sx={{
                        "& .MuiInputBase-input": {
                          fontSize: { xs: "0.9rem", sm: "1rem" },
                        },
                      }}
                    />
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                </>
              )}

              <Typography
                variant="h6"
                gutterBottom
                sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
              >
                Rezultati setova
              </Typography>

              {selectedMatch.sets.map((set, index) => (
                <Box
                  key={index}
                  mb={3}
                  sx={{
                    width: "100%",
                  }}
                >
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    sx={{ fontSize: { xs: "1rem", sm: "1.1rem" } }}
                  >
                    {index + 1}. set
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Grid width="40%">
                      <TextField
                        fullWidth
                        type="number"
                        label={`${playerOne?.firstName} - gemovi`}
                        value={set.playerOneGames}
                        onChange={(e) =>
                          handleSetScoreChange(
                            index,
                            "one",
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                        inputProps={{ min: 0, max: 20 }}
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            padding: { xs: "12px", sm: "16.5px 14px" },
                          },
                          "& .MuiInputLabel-root": {
                            fontSize: { xs: "0.85rem", sm: "1rem" },
                          },
                        }}
                      />
                    </Grid>
                    <Grid textAlign="center">
                      <Typography
                        variant="h6"
                        sx={{ fontSize: { xs: "1.2rem", sm: "1.5rem" } }}
                      >
                        -
                      </Typography>
                    </Grid>
                    <Grid width="40%">
                      <TextField
                        fullWidth
                        type="number"
                        label={`${playerTwo?.firstName} - gemovi`}
                        value={set.playerTwoGames}
                        onChange={(e) =>
                          handleSetScoreChange(
                            index,
                            "two",
                            Number.parseInt(e.target.value) || 0
                          )
                        }
                        inputProps={{ min: 0, max: 20 }}
                        sx={{
                          "& .MuiInputBase-input": {
                            fontSize: { xs: "0.9rem", sm: "1rem" },
                            padding: { xs: "12px", sm: "16.5px 14px" },
                          },
                          "& .MuiInputLabel-root": {
                            fontSize: { xs: "0.85rem", sm: "1rem" },
                          },
                        }}
                      />
                    </Grid>
                  </Box>
                </Box>
              ))}

              <Box mb={3}>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                >
                  Pobjednik meča
                </Typography>
                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                  {(() => {
                    const winnerId = determineWinner(selectedMatch);
                    const winner = getPlayer(winnerId);
                    const winnerGroup = getPlayerGroup(winnerId);

                    return winnerId && winner ? (
                      <>
                        <Avatar
                          sx={{
                            bgcolor: winnerGroup?.color + ".main",
                            width: { xs: 32, sm: 40 },
                            height: { xs: 32, sm: 40 },
                          }}
                        >
                          {winner.avatar}
                        </Avatar>
                        <Typography
                          variant="h6"
                          sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
                        >
                          {winner.firstName} {winner.lastName}
                        </Typography>
                        <Chip
                          label="Pobjednik"
                          color="success"
                          size={isMobile ? "small" : "medium"}
                        />
                      </>
                    ) : (
                      <Typography
                        color="text.secondary"
                        sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}
                      >
                        Pobjednik će biti automatski određen na osnovu osvojenih
                        setova
                      </Typography>
                    );
                  })()}
                </Box>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions
          sx={{
            p: { xs: 2, sm: 2 },
            flexDirection: { xs: "column", sm: "row" },
            gap: { xs: 1, sm: 0 },
          }}
        >
          <Button
            onClick={handleModalClose}
            variant="outlined"
            fullWidth={isMobile}
            sx={{ order: { xs: 2, sm: 1 } }}
          >
            Odustani
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveMatchResults}
            fullWidth={isMobile}
            sx={{ order: { xs: 1, sm: 2 } }}
          >
            Spremi rezultate
          </Button>
        </DialogActions>
      </Dialog>

      {snackbar.open && (
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            severity={snackbar.severity}
            onClose={() => setSnackbar({ ...snackbar, open: false })}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
}
