// The definition of the possible output devices
import { Device } from '../device/device.interface';
export interface Output {
    
    name: string; // Identifies the loud speaker or the bt controller
    bluetooth: boolean; // True in case of a bt connection
    device: Device; // The current bluetooth device or null
}
