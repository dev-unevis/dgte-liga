import type { TGroup, TGroupMember, TMatch } from "../types";
import { supabase } from "./supabase";

export const generateSchedule = async (): Promise<TMatch[]> => {
  // Load groups with active members and joined user info
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
    .eq("is_deleted", false)
    .eq("members.is_deleted", false);

  const matches: TMatch[] = [];

  if (!data) return matches;

  for (const group of data as TGroup[]) {
    const members = (group.members as TGroupMember[]) || [];

    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const playerOne = members[i];
        const playerTwo = members[j];

        const match: TMatch = {
          player_one_id: playerOne.user_id,
          player_two_id: playerTwo.user_id,
          sets: [
            { set_number: 1, player_one_games: 0, player_two_games: 0 },
            { set_number: 2, player_one_games: 0, player_two_games: 0 },
            { set_number: 3, player_one_games: 0, player_two_games: 0 },
          ],
          winner_id: null,
          status: "waiting",
          group_id: group.id!,
          is_surrender: false,
        };

        matches.push(match);
      }
    }
  }

  return matches;
};
