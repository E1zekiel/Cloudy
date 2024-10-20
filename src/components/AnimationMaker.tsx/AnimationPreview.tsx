import { useState } from "react"
import { StyleProp, ViewStyle, View, StyleSheet, LayoutRectangle } from "react-native"
import Svg, { Circle, Defs, Rect } from "react-native-svg"

const AnimationPreviewStyles = StyleSheet.create({
  thumbsContainer:{
    flexDirection: 'row',
    width:'100%', 
    height:'20%', 
    backgroundColor:'green'
  }
})

interface IAnimationPreview{
  style:StyleProp<ViewStyle>,
  isZonesEditorShow:boolean
}

export const AnimationPreview:React.FC<IAnimationPreview> = ({style, isZonesEditorShow}) => {

  const [zones, setZones] = useState([
    {point:{id0:0, id1:2}, fill:'white'},
    {point:{id0:3, id1:6}, fill:'white'},
    {point:{id0:7, id1:9}, fill:'white'},
  ])

  return(
    <View style={style}>
      <View style={AnimationPreviewStyles.thumbsContainer}>

      </View>
      <Svg style={{backgroundColor:'red', height:'80%', width:'100%'}}>
        <Defs>
          
        </Defs>
        <Rect height={'100%'} width={'100%'} fill={'#242424'} rx={30} ry={30}/>
        <Animation/>
      </Svg>
    </View>
  )
}

const Animation = () => {
  const [leds, setLeds] = useState([
    {id:0},
    {id:1},
    {id:2},
    {id:3},
    {id:4},
    {id:5},
    {id:6},
    {id:7},
    {id:8},
    {id:9},
  ])

  const [layout, setLayout] = useState({width:0, height:0})

  const handleLayout = (layout:LayoutRectangle) => {
    setLayout(layout)
  }

  return (
    <Svg onLayout={e => handleLayout(e.nativeEvent.layout)}>
      {leds.map((led,id) => (
        <Circle key={id} cy={'50%'} cx={`${(100/10)*(id+1)}%`} r={12} fill={'white'}/>
      ))}
    </Svg>
  )
}

// const StrokeStops = () => {
//   return(

//   )
// }