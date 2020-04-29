
// The definition of a player
export interface Player {
    
    readonly command: string; // The unix command used to play something
    switchedOn: boolean;      // Whether the playe is on or off
}
