
// The definition of a bluetooth output device
export interface Device {

    name : string;
    alias : string;
    address : string;
    trusted : boolean;
    paired : boolean;
    connected : boolean;
}
