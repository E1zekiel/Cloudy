import React, { useEffect, useState } from "react";
import { ActivityIndicator, PermissionsAndroid, Text, ToastAndroid, TouchableOpacity, View } from "react-native";
import RNBluetoothClassic, {
    BluetoothDevice
  } from 'react-native-bluetooth-classic';
import { BTStore } from "../../stores/stores";

export default function ConnectScreen(){
    const setConnected = BTStore(state => state.setConnectedDevice)
    useEffect(() => {
        const disconnect = RNBluetoothClassic.onDeviceDisconnected(() => {setConnected(undefined); ToastAndroid.show('device disconnected', ToastAndroid.SHORT)})
        return(() => {
            disconnect.remove()
        })
      }, [])
      
      const BtChecks = async() => {
        PermissionsAndroid.check((
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
            PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
          )).then(res => {
              if(res){
                RNBluetoothClassic.isBluetoothEnabled().then(res => {
                    res? console.log('bluetooth enabled'): RNBluetoothClassic.requestBluetoothEnabled()
                })
              }else{
                PermissionsAndroid.requestMultiple([
                  PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                  PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION   
                ]).then(res => {
                  if(res){
                    console.log('user accepted')
                    RNBluetoothClassic.isBluetoothEnabled().then(res => {
                        res? console.log('bluetooth enabled'):RNBluetoothClassic.requestBluetoothEnabled()
                    })
                  }else{
                    console.log('user declined')
                  }
                })
              }
            })
    }

    return(
        <View style={{flex:1, backgroundColor:'#1A1A1A', alignItems:'center'}}>
            <View style={{paddingHorizontal:'2%',width:'100%', height:'7%', justifyContent:'center'}}>
                <Text style={{color:'#DEAEF0',fontSize:25,fontFamily:'Inter ExtraBold'}}>Устройства</Text>
            </View>
            <PairedDevices/>
            <UnpairedDevices/>
        </View>
    )
}

const PairedDevices = () => {
    useEffect(() => {
        getBondedDevices()
    },[])

    const [paired, setPaired] = [BTStore(state => state.paired), BTStore(state => state.setPaired)]
    const [newConnectedDevice, setNewConnectedDevice] = useState<BluetoothDevice|undefined>(undefined)
    const setConnectedDevice = BTStore(state => state.setConnectedDevice)
    const connectedDevice = BTStore(state => state.connectedDevice)

    const getBondedDevices = async() => {
        try{
            await RNBluetoothClassic.getBondedDevices().then(pairedres => {
                const hc05 = pairedres.find(res => res.name === 'HC-05')
                setPaired(p => hc05&&!p.find(res => res.name === hc05.name)?[...p,hc05]:p)
            })
        }catch(err){
            console.log(err)
        }
    }
    
    const connect = async(device:BluetoothDevice) => {
        try{
            await device.connect().then(res => {
                console.log(res)
                if(res){
                    setNewConnectedDevice(device)
                    setConnectedDevice(device)
                }
            })
        }catch(err){
            console.log(err)
        }
    }

    const disconnect = async(device:BluetoothDevice) => {
        try{
            await device.disconnect().then(res => {
                console.log(res)
                if(res){
                    setNewConnectedDevice(undefined)
                    setConnectedDevice(undefined)
                }
            })
        }catch(err){
            console.log(err)
        }
    }

    return (
        <View style={{width:'96%', borderRadius:20, marginVertical:'2%'}}>
            <Text style={{margin:'2%', color:'#DEAEF0', fontFamily:'Inter SemiBold'}}>Доступные:</Text>
            <View style={{width:'100%', borderRadius:20, backgroundColor:'#242424'}}>
                {paired?.length!==0? paired.map(device => (
                    <ConnectDeviceButton device={device} key={device.id} onPress={() => newConnectedDevice?disconnect(device):connect(device)} isConnected={connectedDevice&&device===connectedDevice}/>
                )):<ConnectDeviceButton/>}
            </View>
        </View>
    )

}

const UnpairedDevices = () => {
    const setPaired = BTStore(state => state.setPaired)
    const [unpaired, setUnpaired] = [BTStore(state => state.unpaired), BTStore(state => state.setUnpaired)]
    const [isScanning, setIsScanning] = useState(false)

    const startDiscovery = async() => {
        try{
            setIsScanning(true)
            setUnpaired([])
            await RNBluetoothClassic.startDiscovery().then(res => {
                setIsScanning(false)
                const hc05 = res.find(res => res.name === 'HC-05')
                setUnpaired(p => hc05?[...p, hc05]:[...p])
            })
        }catch(err){
            console.log(err)
        }
    }

    const cancelDiscovery = async() => {
        try{
            await RNBluetoothClassic.cancelDiscovery().then(res => {setIsScanning(res)})
        }catch(err){
            console.log(err)
        }
    } 

    const pairDevice = async(device:BluetoothDevice) => {
        try{
            await RNBluetoothClassic.pairDevice(device.address).then(res => {
                setUnpaired(unpaired.filter(res => res.name !== device.name))
                setPaired(p => [...p, device])
            })
        }catch(err){
            console.log(err)
        }
    }

    return(
        <View style={{width:'96%', backgroundColor:'#242424', borderRadius:20, marginVertical:'2%'}}>
            <AddDeviceButton animating={isScanning} onPress={() => isScanning? cancelDiscovery():startDiscovery()}/>
            {unpaired?.length !==0? unpaired.map(device => (
                <ConnectDeviceButton device={device} onPress={p => pairDevice(p)} key={device.id}/>
            )):null}
        </View>
    )
}

interface AddDeviceButtonProp {
    animating:boolean,
    onPress?:() => void,
}

const AddDeviceButton = ({animating, onPress}:AddDeviceButtonProp) => { 
    return(
        <TouchableOpacity style={{width:'100%', height:45, flexDirection:'row', justifyContent:'space-between', alignItems:"center", paddingHorizontal:'3%'}} activeOpacity={0.7}onPress={onPress}>
            <Text style={{color:'#DEAEF0', fontFamily:'Inter SemiBold'}}>+ Добавить устройство</Text>
                <ActivityIndicator size={'small'} style={{marginRight:'2%'}} color={'white'} animating={animating}/>
        </TouchableOpacity>
    )
}


interface ConnectDeviceButtonProp{
    device?:BluetoothDevice,
    onPress?:(device: BluetoothDevice) => void,
    isConnected?:boolean
}

const ConnectDeviceButton = ({device, onPress, isConnected}:ConnectDeviceButtonProp) => {
    return(
        <TouchableOpacity style={{width:'100%', height:45, flexDirection:'row', alignItems:"center", paddingHorizontal:'3%',backgroundColor:isConnected?'#F6B17A':undefined, borderRadius:20, marginVertical:2}} onPress={() => {device&&onPress? onPress(device):onPress}}>
            <Text style={{color:'#DEAEF0', fontSize:16, fontFamily:'Inter SemiBold', marginLeft:14}}>{device?device.name:''}</Text>
        </TouchableOpacity>
    )
}