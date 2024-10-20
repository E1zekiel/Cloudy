import { StatusBar, View } from "react-native";
import { MultiSegmentSlider } from "../components/Slider";
import { FillType, ZoneType } from "../types/sliderTypes";
import hexRgb, { RgbaObject } from "hex-rgb";
import Gradient from "javascript-color-gradient";
import { BTStore } from "../stores/stores";

type RgbObject = {red:number, green:number, blue:number}
type GradRgbObject = {first:RgbObject, second:RgbObject}
new Gradient

export const DrawScreen = () => {
  const HC05 = BTStore(state => state.connectedDevice)
  const write = BTStore(state => state.write)
  const numLeds = BTStore(state => state.numLeds)

  const onZonesAdd = (zones:ZoneType[]) => {
    write(HC05,zones.map((zone, index) => {
      if(typeof zone.fill === 'object'){
        let fill:GradRgbObject = {first:hexRgb(zone.fill.left), second:hexRgb(zone.fill.right)}
        return `${index == 0? '1,': ''} ${zone.points.first.id}, ${fill.first.red}, ${fill.first.green}, ${fill.first.blue}, ${index == (zones.length-1)?zone.points.second.id:zone.points.second.id-1}, ${fill.second.red}, ${fill.second.green}, ${fill.second.blue}, ${index == (zones.length-1)? '1;': '0,'}`
      }else{
        let fill:RgbObject = hexRgb(zone.fill)
        return `${index == 0? '1,': ''} ${zone.points.first.id}, ${fill.red}, ${fill.green}, ${fill.blue}, ${index == (zones.length-1)?zone.points.second.id:zone.points.second.id-1}, ${fill.red}, ${fill.green}, ${fill.blue},${index == (zones.length-1)? '1;': '0,'}`
      }
    }).join(''))
  }

  let timer:number = 0

  const onThumbMove = (movZones:{left:ZoneType,current:ZoneType}) => {
    write(HC05,[movZones.left, movZones.current].map((zone, index) => {
      if(typeof zone.fill === 'object'){
        let fill:GradRgbObject = {first:hexRgb(zone.fill.left), second:hexRgb(zone.fill.right)}
        return `${index == 0? '1,': ''} ${zone.points.first.id}, ${fill.first.red}, ${fill.first.green}, ${fill.first.blue}, ${index == 1?zone.points.second.id:zone.points.second.id-1}, ${fill.second.red}, ${fill.second.green}, ${fill.second.blue}, ${index == 1? '1;': '0,'}`
      }else{
        let fill:RgbObject = hexRgb(zone.fill)
        return `${index == 0? '1,': ''} ${zone.points.first.id}, ${fill.red}, ${fill.green}, ${fill.blue}, ${index == 1?zone.points.second.id:zone.points.second.id-1}, ${fill.red}, ${fill.green}, ${fill.blue},${index == 1? '1;': '0,'}`
      }
    }).join(''))
  } 

  const onColorChange = (zone:ZoneType) => {
    if(typeof zone.fill === 'object'){
      let fill:GradRgbObject = {first:hexRgb(zone.fill.left), second:hexRgb(zone.fill.right)}
      let msg = 
      `1, ${zone.points.first.id}, ${fill.first.red}, ${fill.first.green}, ${fill.first.blue}, ${zone.points.second.id},${fill.second.red}, ${fill.second.green}, ${fill.second.blue}, 1; `
      write(HC05, msg)
    }else{
      let fill:RgbObject = hexRgb(zone.fill) 
      let msg = `1, ${zone.points.first.id}, ${fill.red}, ${fill.green}, ${fill.blue}, ${zone.points.second.id}, ${fill.red}, ${fill.green}, ${fill.blue}; `
      write(HC05, msg)
    }
  }

  return (
    <View style={{flex:1, backgroundColor:'#1a1a1a', alignItems:'center', paddingVertical:20}}>
        <MultiSegmentSlider styles={{width:'100%', height:'8%'}} thumbsR={6} ledCount={20} onZoneAdd={onZonesAdd} onThumbMove={onThumbMove} onColorChangeComplete={onColorChange}/>
        <StatusBar backgroundColor={'#1a1a1a'}/>
    </View>
  )
}



