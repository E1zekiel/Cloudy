import React, { useEffect, useState } from "react"
import { StyleProp, ViewStyle, View, StyleSheet, TouchableOpacity, Text, LayoutRectangle } from "react-native"
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from "react-native-reanimated"
import Svg, { Path } from "react-native-svg"
import { BlColors } from "../../colors/colors"
import { containerRect } from "../../types/sliderTypes"
import { createAnimatedComponent } from "react-native-reanimated/lib/typescript/createAnimatedComponent"

const OperationsStyle = StyleSheet.create({
  container:{
    height:'100%',
    justifyContent:'flex-end'
  },
  dropUpLabel:{
    flexDirection:'row',
    alignSelf:'center',
    alignItems:'flex-start',
    justifyContent:'center',
    position:'absolute',
    zIndex:-1,
    width:'100%',
    height:'100%',
    borderRadius:10,
    backgroundColor:'#DC7DFF'
  },
  toolsContainer:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'center',
    height:'70%',
    borderRadius:10, 
    backgroundColor:'#242424',
  },
  animationsDropDown:{
    height:'100%',
    backgroundColor:"#303030",
    borderRadius:6,
  },
  animationsDropDownContainer:{
    height:'80%',
    justifyContent:'flex-start',
  },
  buttons:{
    height:'65%',
    width:'12%',
    marginHorizontal:7
  }
})

interface IOperations{
  style:StyleProp<ViewStyle>,
  onItemChange:(animation:{id:number, name:string}) => void,
  onShowZonesEditorButtonPress:() => void
}

export const Operations:React.FC<IOperations> = ({style, onItemChange, onShowZonesEditorButtonPress}) => {
  const [dropUpLabel, setDropUpLabel] = useState({isOpen:false})

  const handleShowZonesEditorButtonPress = () => {
    onShowZonesEditorButtonPress()
    setDropUpLabel(p => ({isOpen:!p.isOpen}))
  }

  return(
    <View style={style}>
      <View style={OperationsStyle.container}>
        <DropUpLabel style={OperationsStyle.dropUpLabel} isOpen={dropUpLabel.isOpen}/>
        <View style={OperationsStyle.toolsContainer}>
          <ShowZonesEditorButton style={OperationsStyle.buttons} onPress={handleShowZonesEditorButtonPress}/>
          <View style={OperationsStyle.animationsDropDownContainer}>
            <AnimationsDropDownList style={OperationsStyle.animationsDropDown}/>
          </View>
          <ShowLevelsButton style={OperationsStyle.buttons}/>
        </View>
      </View>
    </View>
  )
}

const DropUpLabel:React.FC<{isOpen:boolean, style:StyleProp<ViewStyle>}> = ({isOpen, style}) => {

  const [layout, setLayout] = useState({height:0, isOpen:false, isOpenning:false})

  const height = useSharedValue(0)

  const handleLayout = (layout:LayoutRectangle) => {  
    setLayout(p => ({...p, height:layout.height}))
  }
  
  const dropUpAnimatedStyle = useAnimatedStyle(() => ({
    height:height.value
  }))

  const handleLabelOpened= () => {
    setLayout(p => ({...p, isOpenning:true}))
  }
  
  const handleLabelClosing= () => {
    setLayout(p => ({...p, isOpenning:false}))
  } 

  const handleIsOpenChange = () => {
    if(!isOpen){
      handleLabelClosing()
    }else if (isOpen){
      height.value = withTiming( layout.height, {duration:200}, () => {runOnJS(handleLabelOpened)()}) 
    }
  }

  const handleAnimationCloseComplete = () => {
    height.value = withTiming(0, {duration:200})
  }

  useEffect(() => {
    handleIsOpenChange()
    return(() => {})
  },[isOpen])

  return(
    <View style={[style, {backgroundColor:'red'}]} onLayout={e => handleLayout(e.nativeEvent.layout)}>
      <Animated.View style={[OperationsStyle.dropUpLabel, dropUpAnimatedStyle]}>
          <RemoveZoneButton isVisible={layout.isOpenning}/>
          <AddZoneButton isVisible={layout.isOpenning} onAnimationCloseComplete={handleAnimationCloseComplete}/>
      </Animated.View>
    </View>
  )
}


const AddZoneButton:React.FC<{onPress?:() => void, isVisible:boolean, onAnimationCloseComplete:() => void}> = ({onPress, isVisible, onAnimationCloseComplete}) => {

  const [layout, setLayout] = useState({
    width:0, 
    height:0,
  })

  const width= useSharedValue(0)
  const height= useSharedValue(0)

  const onIsVisibleChange = () => {
    if(isVisible){
      height.value = withTiming(layout.height, {duration:150})
      width.value = withTiming(layout.width, {duration:150})
    }else{
      height.value = withTiming(0, {duration:200}, () => {runOnJS(onAnimationCloseComplete)()})
      width.value = withTiming(0, {duration:200})
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    width:width.value,
    height:height.value,
  }))

  useEffect(() => {
    onIsVisibleChange()
  },[isVisible])


  return(
    <View style={{width:'7%', height:'27%', marginHorizontal:15, alignItems:'center', justifyContent:'center'}} onLayout={e => setLayout(e.nativeEvent.layout)}>
      <TouchableOpacity>
        <Animated.View style={animatedStyle}>
          <Svg viewBox="0 0 10 10">
            <Path d="M0.5 5 H 9.5 M 5 0.5 V 9.5" stroke={"#CECECE"} strokeWidth={1.3} strokeLinecap="round"/>
          </Svg>
        </Animated.View>
      </TouchableOpacity>
    </View>
  )
}

const RemoveZoneButton:React.FC<{onPress?:() => void, isVisible:boolean}> = ({onPress, isVisible}) => {

  const [layout, setLayout] = useState({
    width:0, 
    height:0,
  })

  const width = useSharedValue(0)
  const height = useSharedValue(0)

  const onIsVisibleChange = () => {
    if(isVisible){
      height.value = withTiming(layout.height, {duration:150})
      width.value = withTiming(layout.width, {duration:150})
    }else{
      height.value = withTiming(0, {duration:200})
      width.value = withTiming(0, {duration:200})
    }
  }

  const animatedStyle = useAnimatedStyle(() => ({
    width:width.value,
    height:height.value,
  }))

  useEffect(() => {
    onIsVisibleChange()
  },[isVisible])


  return(
    <View style={{width:'7%', height:'27%', marginHorizontal:15, alignItems:'center', justifyContent:'center'}} onLayout={e => setLayout(e.nativeEvent.layout)}>
      <TouchableOpacity>
        <Animated.View style={animatedStyle}>
          <Svg viewBox="0 0 10 10">
            <Path d="M0.5 5 H 9.5 " stroke={"#CECECE"} strokeWidth={1.3} strokeLinecap="round"/>
          </Svg>
        </Animated.View>
      </TouchableOpacity>
    </View>
  )
}



interface IModesList {
  style: StyleProp<ViewStyle>;
}

type modeType = {id: number; mode: string; isPicked: boolean; width: number};

const AnimationsDropDownList: React.FC<IModesList> = ({style}) => {
  const [DropDown, setDropDown] = useState<{
    items: modeType[];
    isOpen: boolean;
    isOpenning: boolean;
    isClosing: boolean;
    height: number;
    layoutWhenClosed: {width: number; height: number};
}>({
    items: [
      {id: 0, mode: 'Угли', isPicked: true, width: 0},
      {id: 1, mode: 'Звезда', isPicked: false, width: 0},
      {id: 2, mode: 'beatSin', isPicked: false, width: 0},
    ],
    isClosing: false,
    isOpenning: false,
    isOpen: false,
    height: 0,
    layoutWhenClosed: {width: 0, height: 0},
  });

  const width = useSharedValue(0);

  const height = useSharedValue(0);

  const handleModalClosed = () => {
    setDropDown(p => ({...p, isOpen: false, isClosing: false}));
  };

  const handleModalOpened = () => {
    setDropDown(p => ({...p, isOpen: true, isOpenning: false}));
  };

  const animatedStyle = useAnimatedStyle(() => {
    return height.value > 0 && width.value > 0
      ? {
          height: height.value,
          width: width.value,
        }
      : {};
  });

  const handleLayout = (layout: containerRect) => {
    if (height.value <= 0 && width.value <= 0) {
      setDropDown(p => ({
        ...p,
        height: layout.height,
        layoutWhenClosed: layout,
      }));
      height.value = layout.height;
      width.value = layout.width;
    }
  };

  const handleDropDownTextLayout = (id: number, width: number) => {
    if (!DropDown.isClosing) {
      setDropDown(p => ({
        ...p,
        items: p.items.map(res =>
          res.id === id ? {...res, width: width + 14} : res,
        ),
      }));
    }
  };

  const handleDropDownItemPress = (id: number) => {
    // onModeChange({id: id, name: modesModal.items[id].mode});
    setDropDown(p => ({
      ...p,
      items: p.items.map(res =>
        res.isPicked
          ? {...res, isPicked: false}
          : res.id == id
          ? {...res, isPicked: true}
          : res,
      ),
    }));
    closeDropDown(DropDown.items[id].width);
  };

  const openDropDown = () => {
    setDropDown(p => ({...p, isOpenning: true}));
    height.value = withTiming(300, {duration: 300}, () => {
      runOnJS(handleModalOpened)();
    });
    width.value = withTiming(250, {duration: 300});
  };

  const closeDropDown = (widthTo?: number) => {
    setDropDown(p => ({...p, isClosing: true}));
    height.value = withTiming(
      DropDown.layoutWhenClosed.height,
      {duration: 300},
      () => {
        runOnJS(handleModalClosed)();
      },
    );
    width.value = withTiming(widthTo ? widthTo : width.value - 200, {
      duration: 300,
    });
  };

  return (
    <Animated.View
      style={[style, animatedStyle]}
      onLayout={e => handleLayout(e.nativeEvent.layout)}>
      <Text
        style={{
          marginHorizontal: 7,
          fontFamily: 'Inter SemiBold',
          color: BlColors.Primary,
        }}
        onPress={openDropDown}>
        {DropDown.items.find(res => res.isPicked)?.mode}
      </Text>
      {DropDown.isClosing || DropDown.isOpen || DropDown.isOpenning ? (
        <Animated.FlatList
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          data={DropDown.items}
          contentContainerStyle={{
            borderWidth: 1,
            borderTopColor: '#808080',
            borderRightColor: 'rgba(0,0,0,0)',
            borderLeftColor: 'rgba(0,0,0,0)',
            borderBottomColor: 'rgba(0,0,0,0)',
          }}
          renderItem={({item, index}) =>
            item.isPicked ? null : (
              <View
                style={{
                  height: DropDown.layoutWhenClosed.height,
                  flexDirection: 'row',
                  alignItems: 'center',
                  width: '100%',
                }}
                onTouchEnd={() => handleDropDownItemPress(index)}>
                <Text
                  style={{
                    marginHorizontal: 6,
                    fontFamily: 'Inter SemiBold',
                    color: '#808080',
                  }}
                  onLayout={e =>
                    handleDropDownTextLayout(index, e.nativeEvent.layout.width)
                  }>
                  {item.mode}
                </Text>
              </View>
            )
          }
        />
      ) : undefined}
    </Animated.View>
  );
};

const ShowZonesEditorButton: React.FC<{style: StyleProp<ViewStyle>; onPress:() => void}> = ({style, onPress}) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Svg viewBox="0 0 10 10">
        <Path
          d="
        M 0 0.5 L 3 0.5 L 3 9.5  L 0 9.5 
        M 5 3 L 5 7 
        M 10 0.5 L 7 0.5 L 7 9.5 L 10 9.5"
          stroke={'#808080'}
          strokeWidth={0.5}
          fill={'none'}
        />
      </Svg>
    </TouchableOpacity>
  );
};

const ShowLevelsButton: React.FC<{style: StyleProp<ViewStyle>}> = ({style}) => {
  return (
    <TouchableOpacity style={style}>
      <Svg viewBox="0 0 10 10">
        <Path
          d="
        M 2 0 
        L 2 5 A 1 1 0 0 0 2 8 
        A 1 1 0 0 0 2 5 
        M 2 8 L 2 10 
        M 8 0 L 8 2 
        A 1 1 0 0 0 8 5 
        A 1 1 0 0 0 8 2 
        M 8 5 L 8 10"
          stroke={'#808080'}
          strokeWidth={0.7}
          fill={'none'}
        />
      </Svg>
    </TouchableOpacity>
  );
};