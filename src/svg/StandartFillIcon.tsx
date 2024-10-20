import { useState } from "react"
import { TouchableOpacity, View } from "react-native"
import Svg, { Circle, Defs, G, LinearGradient, Path, Stop } from "react-native-svg"
import { containerRect } from "../types/sliderTypes"

interface IconProp {
  isPicked:boolean,
  onPress?:() => void
}

export const StandartFillIcon = ({isPicked,onPress}:IconProp) => {
    const [layout, setLayout] = useState<{width:number, height:number}>({width:0, height:0})
    let thumbR = 4
    let y = layout.height/2
    let thumb0x = thumbR+1
    let thumb1x = layout.width - (thumbR+1)
    let x0 =  thumb0x+thumbR
    let x1 = thumb1x-thumbR
    let zoneWidht = 5

    const onZoneLayout = (layout:containerRect) => {
      setLayout(layout)
    }

    const handlePress = () => {
      if(onPress){
        onPress()
      }
    }

    return (
        <TouchableOpacity style={{width:'13%', height:20, marginHorizontal:'10%', opacity:isPicked?1:0.3}} onPress={handlePress}>
          <Svg onLayout={p => onZoneLayout(p.nativeEvent.layout)}>
              <Defs>
                  <LinearGradient id="grad">
                      <Stop offset='0%' stopColor={'rgba(255,255,255,1)'}/>
                      <Stop offset='100%' stopOpacity={0} stopColor={'rgba(25,25,25,0)'}/>
                  </LinearGradient>
              </Defs>
              <Path d={`
                M ${x0} ${y - zoneWidht} 
                A ${6} ${6} 0 0 1 ${x0} ${y + zoneWidht}
                L ${x1} ${y + zoneWidht}
                A ${6} ${6} 0 0 1 ${x1} ${y - zoneWidht}
                L ${x1} ${y - zoneWidht} 
                `} fill={"white"} />
              <Circle cx={thumb0x} cy={y} r={thumbR} fill={'white'} />
              <Circle cx={thumb1x} cy={y} r={thumbR} fill={'white'}/>
          </Svg>
        </TouchableOpacity >
    )
  }