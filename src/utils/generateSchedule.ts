import { getData } from "../hooks/useCollection";
import type { TGroup, TMatch } from "../types";

export const generateSchedule = async () => {
  const groups = await getData<TGroup>("groups");
  const matches: TMatch[] = [];

  for (const group of groups) {
    const { members } = group;

    // Loop through members to generate all pair combinations
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const playerOne = members[i];
        const playerTwo = members[j];

        const match: TMatch = {
          playerOneId: playerOne.id,
          playerTwoId: playerTwo.id,
          sets: [
            {
              setNumber: 1,
              playerOneGames: 0,
              playerTwoGames: 0,
            },
            {
              setNumber: 2,
              playerOneGames: 0,
              playerTwoGames: 0,
            },
            {
              setNumber: 3,
              playerOneGames: 0,
              playerTwoGames: 0,
            },
          ], // no sets played yet
          winnerId: "", // no winner yet
          scheduledAt: null, // you can change this to something meaningful later
          status: "Čeka", // waiting
          groupId: group.id!,
        };

        matches.push(match);
      }
    }
  }

  return matches;
};
