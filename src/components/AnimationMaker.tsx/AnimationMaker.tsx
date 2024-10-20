import React, { useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { AnimationPreview } from "./AnimationPreview";
import { Operations } from "./Operations";

const AnimationMakerStyles = StyleSheet.create({
  container:{
    width:'84%', height:'20%', backgroundColor:'red'
  },
  preview:{
    width:'100%', height:'60%', backgroundColor:'blue',
  },
  operationContainer:{
    width:'100%', 
    height:'40%', 
    backgroundColor:'grey',
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
  }
})

type Animation = {
  zonesEditor:{isOpen:boolean},
  animation:{id:number, name:string},
  modal:{
    isOpened:boolean,
  }
}

export const AnimationMaker:React.FC = () => {
  const [animation, setAnimation] = useState<Animation>({
    zonesEditor:{isOpen:false},
    animation: {id:0, name:'Звезда'},
    modal:{
      isOpened:false
    }
  })

  const handleShowZonesEditorButtonPress = () => {

  }

  const handleItemChange = (item:{id:number, name:string}) => {
    setAnimation(p => ({...p, animation:item}))
  }

  return (
    <View style={AnimationMakerStyles.container}>
      <AnimationPreview isZonesEditorShow={animation.zonesEditor.isOpen} style={AnimationMakerStyles.preview}/>
      <Operations style={AnimationMakerStyles.operationContainer} onItemChange={item => handleItemChange(item)} onShowZonesEditorButtonPress={handleShowZonesEditorButtonPress}/>
    </View>
  )
}
