
/**
 * The definition of a player.
 * Make sure that the commmand is based on mpg123 !
 */
export interface Player {

    command: string;     // The path to the player script
    version: string;     // A version id
    source: string;      // The file to play
    volume: number;      // The volume percentage
    switchedOn: boolean; // Whether the player is on or off
}
