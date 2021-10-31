/**
 * Please remember that team's index start from 1 but not 0
 */
const team = ["#000000", "#00b0f0", "#00b050", "#c00000", "#ffc000"];

export default function Player(teamIndex, attack = 1, defense = 1) {
  let color = team[teamIndex - 1];
  return {
    teamIndex,
    color,
    attack,
    defense,
  };
}
