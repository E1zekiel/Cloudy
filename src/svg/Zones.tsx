import Svg, { Circle, Defs, G, LinearGradient, Path, Stop } from "react-native-svg"
import { containerRect, FillType, splitThumbProps, zoneProps, ISplitProps } from "../types/sliderTypes"
import { useState } from "react"


interface Zone {
  fill:FillType, 
  pickedSide:'left'|'right'|undefined,
  onThumbPress:(side:'left'|'right') => void
}

export const ZoneFromModal = ({fill, pickedSide, onThumbPress}:Zone) => {
  const [layout, setLayout] = useState<{width:number, height:number}>({width:0, height:0})
  const onZoneLayout = (layout:containerRect) => {
    setLayout(layout)
  }
  let thumb0R = pickedSide === 'left'? 9:6
  let thumb1R = pickedSide === 'right'? 9:6
  let y = layout.height/2
  let thumb0x = thumb0R
  let thumb1x = layout.width - thumb1R
  let x0 =  thumb0x+(thumb0R)
  let x1 = thumb1x-(thumb1R)
  let zoneWidht = 8

  return (
    <Svg onLayout={p => onZoneLayout(p.nativeEvent.layout)}>
        {typeof fill === 'object'?
        <G>
            <Defs>
                <LinearGradient id="grad">
                    <Stop offset='0%' stopColor={fill.left}/>
                    <Stop offset='100%' stopColor={fill.right}/>
                </LinearGradient>
            </Defs>
            <Path d={`
            M ${x0} ${y - zoneWidht} 
            A ${thumb0R+4} ${thumb0R+4} 0 0 1 ${x0} ${y + zoneWidht}
            L ${x1} ${y + zoneWidht}
            A ${thumb1R+4} ${thumb1R+4} 0 0 1 ${x1} ${y - zoneWidht}
            L ${x1} ${y - zoneWidht} 
            `} fill={"url(#grad)"} />
            <Circle cx={thumb0x} cy={y} r={thumb0R} fill={fill.left} onPress={() => onThumbPress('left')}/>
            <Circle cx={thumb1x} cy={y} r={thumb1R} fill={fill.right} onPress={() => onThumbPress('right')}/>
        </G> 
        :
        <G>
            <Path d={`
            M ${x0} ${y - zoneWidht} 
            A ${thumb0R+4} ${thumb0R+4} 0 0 1 ${x0} ${y + zoneWidht}
            L ${x1} ${y + zoneWidht}
            A ${thumb1R+4} ${thumb1R+4} 0 0 1 ${x1} ${y - zoneWidht}
            L ${x1} ${y - zoneWidht} 
            `} fill={fill} />
            <Circle cx={thumb0x} cy={y} r={thumb0R} fill={fill}/>
            <Circle cx={thumb1x} cy={y} r={thumb1R} fill={fill}/>
        </G>}
    </Svg>
  )
}

export const ZoneAlone = ({points,fill,thumbR, onThumbPressIn, onZonePress}:zoneProps) => {
  let x0 = points.first.x+thumbR+1
  let x1 = points.second.x-thumbR-1
  let y = points.first.y
  let zoneWidht = 8
  return (
    <Svg>
      {typeof fill === 'object'? 
      <G>
        <Defs>
          <LinearGradient id="grad">
            <Stop offset='0%' stopColor={fill.left}/>
            <Stop offset='100%' stopColor={fill.right}/>
          </LinearGradient>
        </Defs>
        <Path onPress={onZonePress}d={`
        M ${x0} ${y - zoneWidht} 
        A 10 10 0 0 1 ${x0} ${y + zoneWidht}
        L ${x1} ${y + zoneWidht}
        A 10 10 0 0 1 ${x1} ${y - zoneWidht}
        L ${x1} ${y - zoneWidht} 
        `} fill={'url(#grad)'}/>
        <Circle cx={points.first.x} cy={y} r={thumbR} fill={fill.left} />
        <Circle cx={points.second.x} cy={y} r={thumbR} fill={fill.right} />
      </G>
      :
      <G>
        <Path onPress={onZonePress}d={`
        M ${x0} ${y - zoneWidht} 
        A 10 10 0 0 1 ${x0} ${y + zoneWidht}
        L ${x1} ${y + zoneWidht}
        A 10 10 0 0 1 ${x1} ${y - zoneWidht}
        L ${x1} ${y - zoneWidht} 
        `} fill={fill}/>
        <Circle cx={points.first.x} cy={y} r={thumbR} fill={fill} />
        <Circle cx={points.second.x} cy={y} r={thumbR} fill={fill} />
      </G>}
    </Svg>
  )
}

export const ZoneFirst = ({points,fill,thumbR, onThumbPressIn, onZonePress}:zoneProps) => {
  let x0 = points.first.x+thumbR+1
  let x1 = points.second.x-thumbR-1
  let y = points.first.y
  let zoneWidht = 8
  return (
    <Svg>
      {typeof fill === 'object'? 
      <G>
        <Defs>
          <LinearGradient id="grad">
            <Stop offset='0%' stopColor={fill.left}/>
            <Stop offset='100%' stopColor={fill.right}/>
          </LinearGradient>
        </Defs>
        <Path onPress={onZonePress}d={`
        M ${x0} ${y - zoneWidht} 
        A 10 10 0 0 1 ${x0} ${y + zoneWidht}
        L ${x1} ${y + zoneWidht}
        A 10 10 0 0 1 ${x1} ${y - zoneWidht}
        L ${x1} ${y - zoneWidht} 
        `} fill={'url(#grad)'}/>
        <Circle cx={points.first.x} cy={y} r={thumbR} fill={fill.left} />
      </G>
      :
      <G>
        <Path onPress={onZonePress}d={`
        M ${x0} ${y - zoneWidht} 
        A 10 10 0 0 1 ${x0} ${y + zoneWidht}
        L ${x1} ${y + zoneWidht}
        A 10 10 0 0 1 ${x1} ${y - zoneWidht}
        L ${x1} ${y - zoneWidht} 
        `} fill={fill}/>
        <Circle cx={points.first.x} cy={y} r={thumbR} fill={fill} />
      </G>}
    </Svg>
  )
}

export const ZoneMiddle = ({points,ThumbColors,fill, thumbR, onThumbPressIn,onZonePress}:ISplitProps) => {
  let x0 = points.first.x+thumbR+1
  let x1 = points.second.x-thumbR-1
  let y = points.first.y
  let zoneWidht = 8
  return (
    <Svg>
      {typeof fill === 'object'?
      <G>
        <Defs>
          <LinearGradient id="grad">
            <Stop offset='0%' stopColor={fill.left}/>
            <Stop offset='100%' stopColor={fill.right}/>
          </LinearGradient>
        </Defs>
        <Path onPress={onZonePress} d={`
        M ${x0} ${y - zoneWidht} 
        A 10 10 0 0 1 ${x0} ${y + zoneWidht}
        L ${x1} ${y + zoneWidht}
        A 10 10 0 0 1 ${x1} ${y - zoneWidht}
        L ${x1} ${y - zoneWidht} 
        `} fill={'url(#grad)'} />
        <SplitThumb point={points.first} r={thumbR} colors={ThumbColors} onPressIn={onThumbPressIn}/>
      </G>
      :
      <G>
        <Path onPress={onZonePress} d={`
        M ${x0} ${y - zoneWidht} 
        A 10 10 0 0 1 ${x0} ${y + zoneWidht}
        L ${x1} ${y + zoneWidht}
        A 10 10 0 0 1 ${x1} ${y - zoneWidht}
        L ${x1} ${y - zoneWidht} 
        `} fill={fill} />
        <SplitThumb point={points.first} r={thumbR} colors={ThumbColors} onPressIn={onThumbPressIn}/>
      </G>}
    </Svg>
  )
}

export const ZoneLast = ({points,ThumbColors,fill, thumbR, onThumbPressIn,onZonePress}:ISplitProps) => {
  let x0 = points.first.x+thumbR+1
  let x1 = points.second.x-thumbR-1
  let y = points.first.y
  let zoneWidht = 8
  return (
    <Svg>
      {typeof fill === 'object'?
      <G>
        <Defs>
          <LinearGradient id="grad">
            <Stop offset='0%' stopColor={fill.left}/>
            <Stop offset='100%' stopColor={fill.right}/>
          </LinearGradient>
        </Defs>
        <Path onPress={onZonePress} d={`
        M ${x0} ${y - zoneWidht} 
        A 10 10 0 0 1 ${x0} ${y + zoneWidht}
        L ${x1} ${y + zoneWidht}
        A 10 10 0 0 1 ${x1} ${y - zoneWidht}
        L ${x1} ${y - zoneWidht} 
        `} fill={'url(#grad)'} />
        <SplitThumb point={points.first} r={thumbR} colors={ThumbColors} onPressIn={onThumbPressIn}/>
        <Circle cx={points.second.x} cy={y} r={thumbR} fill={fill.right} />
      </G>
      :
      <G>
        <Path onPress={onZonePress} d={`
        M ${x0} ${y - zoneWidht} 
        A 10 10 0 0 1 ${x0} ${y + zoneWidht}
        L ${x1} ${y + zoneWidht}
        A 10 10 0 0 1 ${x1} ${y - zoneWidht}
        L ${x1} ${y - zoneWidht} 
        `} fill={fill} />
        <SplitThumb point={points.first} r={thumbR} colors={ThumbColors} onPressIn={onThumbPressIn}/>
        <Circle cx={points.second.x} cy={y} r={thumbR} fill={fill} />
      </G>}
    </Svg>
  )
}

const SplitThumb = ({point,r, colors, onPressIn}:splitThumbProps) => {
  return(
    <Svg x={point.x} y={point.x} strokeWidth={2} fill={'none'}>
      <G onPressIn={onPressIn}>
        <Path d={`M ${point.x} ${point.y-r} A ${r} ${r} 0 0 0 ${point.x} ${point.y+r}`} fill={colors.left} transform={`rotate(-45 ${point.x} ${point.y})`}/>
        <Path d={`M ${point.x} ${point.y-r} A ${r} ${r} 0 0 1 ${point.x} ${point.y+r}`} fill={colors.right} transform={`rotate(-45 ${point.x} ${point.y})`}/>
      </G>
    </Svg>
  )
}