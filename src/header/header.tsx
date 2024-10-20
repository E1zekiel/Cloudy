import { BottomTabHeaderProps, BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { BlColors } from "../colors/colors";
import { styles } from "../styles/styles";
import { Path, Svg } from "react-native-svg";

interface headerProps {
    props:BottomTabHeaderProps,
}

export default function Header({props}:headerProps){
    return(
        <View style={{backgroundColor:BlColors.Dark}}>
            <View style={{height:60, width:'100%',backgroundColor:BlColors.Dark, flexDirection:'row', alignItems:'center', justifyContent:'space-between', paddingHorizontal:'2%'}}>
                <Text style={styles.text}>{props.route.name}</Text>
                    <TouchableOpacity style={{height:'45%', width:'10%'}} onPress={() => props.navigation.navigate('ConnectScreen')}>
                        <Svg viewBox="0 0 20.21 24.66">
                            <Path d="M1.21,18.66l8.64-6.24,8.93,5.52c.29.15.29.38,0,.53l-7.64,4.87c-.47.24-1.26.07-1.26-.27V1.59c0-.33.8-.5,1.26-.27l7.64,4.87c.29.15.29.38,0,.53l-8.93,5.52L1.21,6.2" fill={'none'} strokeWidth={2.42} stroke={'#808080'} strokeLinecap={'round'} strokeMiterlimit={10}/>
                        </Svg>
                    </TouchableOpacity>
            </View>
        </View>
    )
}
// <Svg>
// <Rect width={"90%"} height={1} fill={'grey'}/>
// </Svg> borderBottomColor:BlColors.LightBlue, borderBottomEndRadius:20, borderBottomStartRadius:20,borderBottomWidth:1,