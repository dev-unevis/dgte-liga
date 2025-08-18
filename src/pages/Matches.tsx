import {
  Close as CloseIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Schedule
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
  Typography
} from "@mui/material";
import { useState } from "react";
import groups from "../constants/groups";
import matches from "../constants/matches";
import { players } from "../constants/players";

type TMatch = {
  id: string;
  playerOneId: string;
  playerTwoId: string;
  sets: Array<{
    setNumber: 1 | 2 | 3;
    playerOneGames: number;
    playerTwoGames: number;
  }>;
  winnerId: string;
  scheduledAt: string;
  status: string;
};

export default function Matches() {
  const [selectedMatch, setSelectedMatch] = useState<TMatch | null>(null);
  const [matchResults, setMatchResults] = useState<TMatch[]>(
    matches as TMatch[],
  );
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success" as "success" | "error",
  });
  const [modalOpen, setModalOpen] = useState(false);

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
    const hasResults = match.sets.some((set) =>
      set.playerOneGames > 0 || set.playerTwoGames > 0
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
    value: number,
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
    }

    return match.winnerId;
  };

  const saveMatchResults = () => {
    if (!selectedMatch) return;

    const winner = determineWinner(selectedMatch);
    const updatedMatch = { ...selectedMatch, winnerId: winner };

    const updatedMatches = matchResults.map((match) =>
      match.id === updatedMatch.id ? updatedMatch : match
    );

    setMatchResults(updatedMatches);
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
    setSelectedMatch({ ...selectedMatch, scheduledAt: newDateTime });
  };

  const formatScheduledTime = (scheduledAt: string) => {
    if (!scheduledAt) return "-";

    try {
      const date = new Date(scheduledAt);
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

  const formatDateTimeForInput = (scheduledAt: string) => {
    if (!scheduledAt) return "";

    try {
      const date = new Date(scheduledAt);
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
            {matchResults.map((match) => {
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
                      {match.id}
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
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {p1?.firstName} {p1?.lastName}
                        </Typography>
                        <Chip
                          label={p1Group?.name}
                          size="small"
                          color={p1Group?.color as any}
                          sx={{ fontSize: "0.75rem", height: 20 }}
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
                      <Box>
                        <Typography variant="body2" fontWeight="medium">
                          {p2?.firstName} {p2?.lastName}
                        </Typography>
                        <Chip
                          label={p2Group?.name}
                          size="small"
                          color={p2Group?.color as any}
                          sx={{ fontSize: "0.75rem", height: 20 }}
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
                      {formatScheduledTime(match.scheduledAt)}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    {isCompleted
                      ? <Chip label="Završen" size="small" color="success" />
                      : <Chip label="Čeka" size="small" color="default" />}
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
        fullScreen={false}
        sx={{
          "& .MuiDialog-paper": {
            margin: { xs: 1, sm: 2 },
            maxHeight: { xs: "95vh", sm: "90vh" },
          },
        }}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Unesite rezultate meča</Typography>
            <IconButton onClick={handleModalClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {selectedMatch && (
            <>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
                gap={2}
              >
                <Box display="flex" alignItems="center" gap={2}>
                  <Avatar
                    sx={{
                      bgcolor: playerOneGroup?.color + ".main",
                      width: 48,
                      height: 48,
                    }}
                  >
                    {playerOne?.avatar}
                  </Avatar>
                  <Box>
                    <Typography variant="h6">
                      {playerOne?.firstName} {playerOne?.lastName}
                    </Typography>
                    <Chip
                      label={playerOneGroup?.name}
                      size="small"
                      color={playerOneGroup?.color as any}
                    />
                  </Box>
                </Box>

                <Typography variant="h5" color="text.secondary">
                  PROTIV
                </Typography>

                <Box display="flex" alignItems="center" gap={2}>
                  <Box textAlign="right">
                    <Typography variant="h6">
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
                      width: 48,
                      height: 48,
                    }}
                  >
                    {playerTwo?.avatar}
                  </Avatar>
                </Box>
              </Box>

              {selectedMatch.status !== "Završen" && (
                <>
                  <Typography variant="h6" gutterBottom>
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
                          new Date(e.target.value).toISOString(),
                        )}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Box>
                  <Divider sx={{ mb: 3 }} />
                </>
              )}

              <Typography variant="h6" gutterBottom>
                Rezultati setova
              </Typography>

              {selectedMatch.sets.map((set, index) => (
                <Box key={index} mb={2}>
                  <Typography variant="subtitle1" gutterBottom>
                    {index + 1}. set
                  </Typography>
                  <Grid container spacing={2} alignItems="center">
                    <Grid>
                      <TextField
                        fullWidth
                        type="number"
                        label={`${playerOne?.firstName} - gemovi`}
                        value={set.playerOneGames}
                        onChange={(e) =>
                          handleSetScoreChange(
                            index,
                            "one",
                            Number.parseInt(e.target.value) || 0,
                          )}
                        inputProps={{ min: 0, max: 20 }}
                      />
                    </Grid>
                    <Grid textAlign="center">
                      <Typography variant="h6">-</Typography>
                    </Grid>
                    <Grid>
                      <TextField
                        fullWidth
                        type="number"
                        label={`${playerTwo?.firstName} - gemovi`}
                        value={set.playerTwoGames}
                        onChange={(e) =>
                          handleSetScoreChange(
                            index,
                            "two",
                            Number.parseInt(e.target.value) || 0,
                          )}
                        inputProps={{ min: 0, max: 20 }}
                      />
                    </Grid>
                  </Grid>
                </Box>
              ))}

              <Box mb={3}>
                <Typography variant="h6" gutterBottom>
                  Pobjednik meča
                </Typography>
                <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                  {(() => {
                    const winnerId = determineWinner(selectedMatch);
                    const winner = getPlayer(winnerId);
                    const winnerGroup = getPlayerGroup(winnerId);

                    return winner
                      ? (
                        <>
                          <Avatar
                            sx={{
                              bgcolor: winnerGroup?.color + ".main",
                            }}
                          >
                            {winner.avatar}
                          </Avatar>
                          <Typography variant="h6">
                            {winner.firstName} {winner.lastName}
                          </Typography>
                          <Chip label="Pobjednik" color="success" />
                        </>
                      )
                      : (
                        <Typography color="text.secondary">
                          Pobjednik će biti automatski određen na osnovu
                          osvojenih setova
                        </Typography>
                      );
                  })()}
                </Box>
              </Box>
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={handleModalClose} variant="outlined">
            Odustani
          </Button>
          <Button
            variant="contained"
            startIcon={<SaveIcon />}
            onClick={saveMatchResults}
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
