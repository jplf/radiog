
// The station object
export interface Station {
    key: string;       // The identifier used to look up a specific station
    name: string;      // The name of the station
    frequency: string; // The hertzian frequency
    stream: string;    // The internet stream URI
    url: string;       // The web site URL
  }
