
// The definition of a player
export interface Player {

    command : string;    // the path to the player script
    version : string;    // A version id
    source : string;     // The file to play
    volume  : number;    // The volume percentage
    switchedOn: boolean; // Whether the player is on or off
}
