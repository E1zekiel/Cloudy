import { ToastAndroid } from "react-native";
import { BluetoothDevice } from "react-native-bluetooth-classic";
import zustand,  {create} from "zustand";

type BTType = {
    connectedDevice:BluetoothDevice|undefined,
    paired:BluetoothDevice[],
    unpaired:BluetoothDevice[],
    numLeds:number,

    write:(device:BluetoothDevice|undefined,msg:string) => void,
    setPaired:(array: BluetoothDevice[]| ((val:BluetoothDevice[]) => BluetoothDevice[])) => void
    setUnpaired:(array: BluetoothDevice[]| ((val:BluetoothDevice[]) => BluetoothDevice[])) => void,
    setConnectedDevice:(device:BluetoothDevice|undefined) => void,
}

export const BTStore = create<BTType>((set) => ({
    connectedDevice:undefined,
    HC05:undefined,
    paired:[],
    unpaired:[],
    numLeds:20,

    write: async (device, msg) => {
        if(device){
            console.log(msg)
            await device.write(msg, "ascii")
        }else{
            ToastAndroid.show("No device connected", ToastAndroid.SHORT)
        }
    },
    setPaired:(array) => {
        if(typeof array === 'function'){
            set(state => ({paired:array(state.paired)}))
        }else{
            set({paired:array})
        }
    },
    setUnpaired:(array) => {
        if(typeof array === 'function'){
            set(state => ({paired:array(state.unpaired)}))
        }else{
            set({unpaired:array})
        }
    },
    setConnectedDevice:(device) => {
        set(({ connectedDevice: device }))
        
    },
}))