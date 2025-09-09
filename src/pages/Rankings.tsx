import { Leaderboard } from "@mui/icons-material";
import {
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { reverse, sortBy, sum } from "lodash-es";
import { useEffect, useState } from "react";
import { getData } from "../hooks/useCollection";
import { useUsers } from "../providers/UsersProvider";
import type { TMatch } from "../types";
import { useLoader } from "../providers/Loader";

type TRankItem = {
  numberOfWins: number;
  totalPoints: number;
  firstName: string;
  lastName: string;
  avatar: string;
  gamesWon: number;
  gamesLost: number;
};
export const Rankings = () => {
  const { users, refresh } = useUsers();
  const [rankings, setRankings] = useState<TRankItem[]>([]);
  const { setLoading } = useLoader();

  const initialize = async () => {
    setLoading(true);
    const items: TRankItem[] = [];
    for (const user of users) {
      if (user.isAdmin) continue;
      const matches = await getData<TMatch>(`users/${user.id}/matches`);
      let gamesWon = 0;
      let gamesLost = 0;

      matches.forEach((match) => {
        if (match.playerOneId === user.id) {
          gamesWon += sum(
            match.sets.filter((_t, i) => i !== 2).map((t) => t.playerOneGames)
          );
          gamesLost += sum(
            match.sets.filter((_t, i) => i !== 2).map((t) => t.playerTwoGames)
          );
        } else {
          gamesWon += sum(
            match.sets.filter((_t, i) => i !== 2).map((t) => t.playerTwoGames)
          );
          gamesLost += sum(
            match.sets.filter((_t, i) => i !== 2).map((t) => t.playerOneGames)
          );
        }
      });

      const now = matches.filter((m) => m.winnerId === user.id).length;
      const item = {
        numberOfWins: now,
        gamesWon: gamesWon,
        gamesLost: gamesLost,
        totalPoints: now * 3,
        firstName: user.firstName,
        lastName: user.lastName,
        avatar: user.avatar,
      };
      items.push(item);
    }

    setRankings(items);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, []);

  useEffect(() => {
    initialize();
  }, [users]);

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <div className="flex items-center gap-3 mb-6">
        <Leaderboard
          sx={{
            color: "primary.main",
          }}
        />
        <Typography variant="h4" className="font-semibold text-gray-800">
          Rang lista
        </Typography>
      </div>
      <TableContainer component={Paper} variant="outlined">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <strong>Rang #</strong>
              </TableCell>
              <TableCell>
                <strong>Igrač</strong>
              </TableCell>
              <TableCell>
                <strong>Broj pobjeda</strong>
              </TableCell>
              <TableCell>
                <strong>Dobiveni gemovi</strong>
              </TableCell>
              <TableCell>
                <strong>Izgubljeni gemovi</strong>
              </TableCell>
              <TableCell>
                <strong>Gem razlika</strong>
              </TableCell>
              <TableCell>
                <strong>Ukupan broj bodova</strong>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reverse(
              sortBy(
                sortBy(rankings, (rank) => rank.gamesWon - rank.gamesLost),
                "totalPoints"
              )
            ).map((rank, index) => {
              return (
                <TableRow
                  key={index}
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
                    <Typography variant="body2" fontWeight="medium">
                      {rank?.firstName} {rank?.lastName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{rank.numberOfWins}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{rank.gamesWon}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{rank.gamesLost}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {rank.gamesWon - rank.gamesLost}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontSize="0.875rem">
                      {rank.totalPoints}
                    </Typography>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};
