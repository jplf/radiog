// The definition of a output device
import { Device } from '../device/device.interface';
export interface Output {
    
    ident: string; // Identifies the loud speaker or the bt controller
    bluetooth: boolean; // True in case of a bt connection
    device: Device; // The current bluetooth device or null
}
