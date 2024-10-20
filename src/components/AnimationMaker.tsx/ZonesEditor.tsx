import React, { ReactNode } from "react"
import { useState } from "react"
import Svg, { Circle, G, Path, Rect } from "react-native-svg"
import { FillType, SliderPoint, ZoneType } from "../../types/sliderTypes"
import { LayoutRectangle, PanResponder, StyleProp, Touchable, TouchableOpacity, View, ViewStyle } from "react-native"
import { ZoneFromModal, ZoneFirst, ZoneLast, ZoneMiddle, ZoneAlone } from "../../svg/Zones"
import Modal from "react-native-modal"
import { StandartFillIcon } from "../../svg/StandartFillIcon"
import { SvgLine } from "../../svg/SvgLine"
import { GradientFillIcon } from "../../svg/GradientFillIcon"
import ColorPicker from "react-native-wheel-color-picker"
import { BlurView } from "@react-native-community/blur"
import LinearGradient from "react-native-linear-gradient"


interface IMultiSegmentSliderProps{
  thumbsR:number,
  ledCount:number,
  styles:StyleProp<ViewStyle>,
  // onZoneAdd:(zones:ZoneType[]) => void,
  // onThumbMove:(movZones:{left:ZoneType, current:ZoneType}, zones:ZoneType[]) => void,
  // onColorChangeComplete:(zone:ZoneType) => void
}

export const ZonesEditor:React.FC<IMultiSegmentSliderProps> = ({ledCount, styles}) => {
  const [sliderPoints, setSliderPoints] = useState<SliderPoint[]>([])
  const [zones, setZones] = useState<ZoneType[]>([])
  const [modal, setModal] = useState<ZoneType|undefined>(undefined)
  const [lastCallTime, setLastCallTime] = useState(0)
  const [firstTooFastTime, setFirstTooFastTime] = useState<number|undefined>()

  const onColorChange = (picked:ZoneType) => {
    setZones(p => p.map(res => picked.id == res.id? picked:res))
  }

  const handleColorChangeComplete = (picked:ZoneType) => {
    // onColorChangeComplete(picked)
  }

  const onZonePress = (picked:ZoneType) => {
    setModal(picked)
  }

  const onBackdropPress = () => {
    setModal(undefined)
  }

  const onViewLayout = (container:LayoutRectangle) => {
    setSliderPoints(getSliderPoints(container, ledCount))
  }

  const onSvgLayout = () => {
    getZones(3)
  }

  const getZones = (numZones:number) => {
    let colors:{id:number, fill:FillType}[] = []
    for(let i=0; i<numZones; i++){
      colors.push({id:i, fill:zones[i]?zones[i].fill:randomColor()})
    }
    const newZones:ZoneType[] = []
    setZones([])
    for(let id = 0; id<numZones; id++){
      let first = sliderPoints[Math.round((sliderPoints.length-1)/numZones*id)]
      let second = sliderPoints[Math.round((sliderPoints.length-1)/numZones*(id+1))]
      newZones.push({id, points:{first, second}, fill:colors[id].fill})
    }
    setZones(newZones)
    // onZoneAdd(newZones)
  }
  
  const onSvgTouchMove = (movzones:{left:ZoneType, current: ZoneType}, closestPoint: SliderPoint) => {
    if(closestPoint.x-30 > movzones.left.points.first.x && closestPoint.x+30 < movzones.current.points.second.x){
      setZones(p => p.map(zone => 
        zone.id == movzones.left.id ? {...zone, points:{first:zone.points.first, second:closestPoint}} : 
        zone.id == movzones.current.id ? {...zone, points:{first:closestPoint, second:zone.points.second}} : zone
      ))
      if(zones.find(zone => zone.id == movzones.left.id)?.points.second.id !==  closestPoint.id){
        const currentTime = Date.now();
        if(currentTime-lastCallTime < 80 ){
          if(!firstTooFastTime){
            setFirstTooFastTime(currentTime)
          }else if(currentTime-firstTooFastTime>80){
            // onThumbMove({left:{...movzones.left, points:{...movzones.left.points, second:closestPoint}}, current:{...movzones.current, points:{...movzones.current.points, first:closestPoint}}}, zones)
            setFirstTooFastTime(undefined)
          }
        }else{
          // onThumbMove({left:{...movzones.left, points:{...movzones.left.points, second:closestPoint}}, current:{...movzones.current, points:{...movzones.current.points, first:closestPoint}}}, zones)
        }
        setLastCallTime(currentTime);
      }
    }
  }

  return(
    <View style={[styles, {justifyContent:'space-between'}]} >
      <View style={{width:'100%', height:'50%'}} onLayout={p => onViewLayout(p.nativeEvent.layout)}>
        <Svg onLayout={onSvgLayout}>
          <Zones sliderPoints={sliderPoints} onSvgTouchMove={onSvgTouchMove} zones={zones} onZonePress={onZonePress}/>
          {modal?
          <ZoneModal zones={zones} visible={modal?true:false} current={modal} onBackdropPress={onBackdropPress} onColorChangeComplete={handleColorChangeComplete}  onColorChange={onColorChange}/>:undefined}
        </Svg>
      </View>
      <View style={{width:'100%', height:'30%', flexDirection:'row', alignItems:'center', justifyContent:'center'}}>
            <TouchableOpacity style={{width:'7%', height:'80%'}} onPress={() => zones.length-1>=1?getZones(zones.length-1):undefined}>
              <Svg viewBox="0 0 10 10">
                <Path d="M0.5 5 H 9.5 " stroke={"white"} strokeWidth={1.3} strokeLinecap="round"/>
              </Svg>
            </TouchableOpacity>
            <View style={{width:'0.5%', height:'90%', backgroundColor:'white', marginHorizontal:'2%', borderRadius:20}}/>
            <TouchableOpacity style={{width:'7%', height:'80%'}} onPress={() => getZones(zones.length+1)}>
              <Svg viewBox="0 0 10 10">
                <Path d="M0.5 5 H 9.5 M 5 0.5 V 9.5" stroke={"white"} strokeWidth={1.3} strokeLinecap="round"/>
              </Svg>
            </TouchableOpacity>
      </View>
    </View>
  )
}

const randomColor = () => {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}


const getSliderPoints = (container:LayoutRectangle, ledCount:number) => {
  const newPoints:SliderPoint[] = []
  for(let id = 0; id<ledCount; id++){
    let x = container.width / 100 * (id/(ledCount-1)) * 94 + container.width/100 *3
    let y = container.height/2
    newPoints.push({id,x,y})
    if(id > 90){
      console.log(id,x)
    }
  }
  return newPoints
}

interface ZonesProps {
    zones:ZoneType[], 
    sliderPoints:SliderPoint[],
    onSvgTouchMove:(zones:{left:ZoneType, current:ZoneType}, closestPoint:SliderPoint) => void,
    onZonePress:(zone:ZoneType) => void
  }
  
const Zones:React.FC<ZonesProps> = ({zones, sliderPoints, onSvgTouchMove, onZonePress}) => {
    const [moveingZones, setMoveingZones] = useState<{left:ZoneType, current:ZoneType}|undefined>()
  
    const moveThumb = (x:number) => {
      const closestPoint = findClosestPoint(sliderPoints, x)
      if(moveingZones){
        onSvgTouchMove(moveingZones,closestPoint)
      }
    }
  
    return(
      <Svg onTouchMove={p => moveThumb(p.nativeEvent.locationX)} onTouchEnd={() => setMoveingZones(undefined)}>
        {zones.map((zone, index) => (
          <G key={index}>
            {zones.length == 1?
              <ZoneAlone points={{first:zone.points.first, second:zone.points.second}} fill={zones[index].fill} thumbR={6} onZonePress={() => onZonePress(zone)}/>
            :!zones[index-1]?
              <ZoneFirst points={{first:zone.points.first, second:zone.points.second}} fill={zones[index].fill} thumbR={6} onZonePress={() => onZonePress(zone)}/>
            :!zones[index+1]?
              <ZoneLast points={{first:zone.points.first, second:zone.points.second}} ThumbColors={ThumbColors(zones[index-1].fill, zones[index].fill)} fill={zones[index].fill} thumbR={6} onThumbPressIn={() => setMoveingZones({left:zones[index-1], current:zone})} onZonePress={() => onZonePress(zone)}/>
            : <ZoneMiddle points={{first:zone.points.first, second:zone.points.second}} ThumbColors={ThumbColors(zones[index-1].fill, zones[index].fill)} fill={zones[index].fill} thumbR={6} onThumbPressIn={() => setMoveingZones({left:zones[index-1], current:zone})} onZonePress={() => onZonePress(zone)}/>}
          </G>
        ))}
      </Svg>
    )
  }   

const findClosestPoint = (arr: SliderPoint[], target: number) => {
    let closestPoint:SliderPoint = {id:0, x:0, y:0}
    let distanceBetweenPoints = arr[1].x - arr[0].x;
  
    for(let i = 0; i<=arr.length; i++){
      let point = arr.find(res => res.id === i)
      if(point){
        let zone = {left:arr[i-1]?arr[i-1].x+distanceBetweenPoints/2:undefined, mid:arr[i].x, right:arr[i+1]?arr[i+1].x-distanceBetweenPoints/2:undefined}
        if(!zone.left&&zone.right){
          if(target < zone.right){
            closestPoint=point
          }
        }
        if(zone.left&&zone.right){
          if(target > zone.left&&target < zone.right){
            closestPoint=point
          }
        }
        if(zone.left&&!zone.right){
          if(target > zone.left){
            closestPoint=point
          }
        }
      }
    }
    return(closestPoint)
  }

const ThumbColors = (left:FillType, current:FillType) => {
        let colors:FillType = {left:'', right:''}
        if(typeof left === 'string'&&typeof current === 'string'){
        colors.left = left
        colors.right = current
        }if(typeof left === 'object'&&typeof current === 'string'){
        colors.left = left.right
        colors.right = current
        }if(typeof left === 'string'&&typeof current === 'object'){
        colors.left = left
        colors.right = current.left
        }if(typeof left === 'object'&&typeof current === 'object'){
        colors.left = left.right
        colors.right = current.left
        }
        return(colors)    
  }

  interface ZoneModalProps {
    visible: boolean,
    zones: ZoneType[],
    current:ZoneType,
    onColorChange:(zone:ZoneType) => void,
    onColorChangeComplete:(zone:ZoneType) => void,
    onBackdropPress: () => void,
  }
  
  
  const ZoneModal = ({visible,zones,current,onColorChange,onColorChangeComplete,onBackdropPress}:ZoneModalProps) => {
    
    const [fill, setFill] = useState<FillType>(current.fill)
    const [color, setColor] = useState<string|undefined>()
    const [pickedSide, setPickedSide] = useState<'left'|'right'|undefined>(undefined)
  
    const onZoneLayout = () => {
      if(typeof current.fill === 'object'){
        setColor(current.fill.left)
      }else{
        setColor(current.fill)
      }
    }
  
    const handleStandartIconPress = () => {
      if(typeof fill === 'object'){
        setFill('#FFFFFF')
        setColor('#FFFFFF')
        setPickedSide(undefined)
        console.log(fill)
      }
    }
  
    const handleGradientIconPress = () => {
      if(typeof fill === 'string'){
        setFill({left:'#FFFFFF', right:'#DC7DFF'})
        setColor('#FFFFFF')
        setPickedSide('left')
        console.log(fill)
      }
    }
  
    const handleColorChange = (color:string) => {
      if(typeof fill === 'string'){
        setFill(color)
      } else{
        if(pickedSide === 'left'){
          setFill({...fill, left:color})
        }
        if(pickedSide === 'right'){
          setFill({...fill, right:color})
        }
      }
      onColorChange({...current, fill})
    }

    const handleColorChangeComplete = () => {
      onColorChangeComplete({...current, fill})
    }

    const panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (evt, gestureState) => {
        const { dy } = gestureState;
        if (dy > 90) {
          onBackdropPress();
        }
      },
    });
  
    return(
      <Modal
        isVisible={visible}
        style={{ justifyContent: 'flex-end', margin: 0 }}
        hasBackdrop={true}
        backdropOpacity={0}
        onBackdropPress={onBackdropPress}
        animationIn={'fadeIn'}
        animationOut={'slideOutDown'}
        {...panResponder.panHandlers}
      >
        <BackGround style={{alignItems:'center', justifyContent:'flex-start'}}>
          <View style={{width:'100%', height:5, marginTop:'2%'}}>
            <Svg width={'100%'} height={'100%'}>
              <Rect width={'20%'} height={"90%"} fill={'white'} x={'40%'} rx={2}/>
            </Svg>
          </View>
          <View style={{width:'80%', height:20, marginTop:'8%'}} onLayout={onZoneLayout}>
            <ZoneFromModal fill={fill} pickedSide={pickedSide} onThumbPress={side => setPickedSide(p => p===side?undefined:side)} />
          </View>
          <View style={{width:'80%', height:20, marginTop:'8%', flexDirection:'row', justifyContent:'center'}}>
            <StandartFillIcon isPicked={typeof fill === 'string'?true:false} onPress={handleStandartIconPress}/>
            <SvgLine/>
            <GradientFillIcon isPicked={typeof fill === 'object'?true:false} onPress={handleGradientIconPress}/>
          </View>
          <View style={{width:'84%', height:'70%'}}>
            <ColorPicker onColorChangeComplete={handleColorChangeComplete} onColorChange={color => handleColorChange(color)} gapSize={16} color={color} palette={(zones.map(res => typeof res.fill === 'object'?[res.fill.left, res.fill.right]:res.fill)).flat()}/>
          </View>
        </BackGround>
      </Modal>
    )
  }

interface IBackGroundProps{
    children:ReactNode,
    style:StyleProp<ViewStyle>
  }
  
  const BackGround:React.FC<IBackGroundProps> = ({children, style}:IBackGroundProps) => {
    return(
      <View style={[{width:'100%', height:'70%'}]}>
        <BlurView style={{width:'100%', height:'100%', position:'absolute'}} blurAmount={10} overlayColor="rgba(255,255,255,0)"/>
        <LinearGradient colors={['rgba(199,105,234, 0.4)', 'rgba(26,26,26,0)']} style={{ width: '100%', height: '100%', position:'absolute', borderTopLeftRadius:30, borderTopRightRadius:30}}/>
        <View style={[style,{width:'100%', height:'100%'}]}>
          {children}
        </View>
      </View>
    )
  }