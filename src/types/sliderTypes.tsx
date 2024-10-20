export type ZoneType = {
    id:number, points:{first:SliderPoint, second:SliderPoint}, fill:FillType
  }

export type FillType = string|{left:string, right:string}
  
export type SliderPoint = {
    id:number, x:number, y:number
}

export type containerRect = {width:number, height:number}

export type zonesPoints = {id:number, points:{first:SliderPoint, second:SliderPoint}}

export interface zoneProps{
    points:{first:SliderPoint, second:SliderPoint},
    fill:FillType,
    thumbR:number,
    onThumbPressIn?:() => void,
    onZonePress:() => void
}

export interface ISplitProps{
    points:{first:SliderPoint, second:SliderPoint},
    ThumbColors:{left:string, right:string},
    fill:FillType,
    thumbR:number,
    onThumbPressIn?:() => void,
    onZonePress:() => void|void
}

export interface ThumbProps {
    point:SliderPoint,
    color:string,
    r:number
    onPressIn?:() => void
}

export interface splitThumbProps{
    point:SliderPoint
    r:number,
    colors:{left:string, right:string},
    onPressIn?:() => void
  }
