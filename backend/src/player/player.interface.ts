
// The definition of a player
export interface Player {

    version : string;
    source : string;     // The file to play
    volume  : number;    // The volume percentage
    switchedOn: boolean; // Whether the player is on or off
}
