import { View } from "react-native"
import Svg, { Path } from "react-native-svg"

export const SvgLine = () => {
    return (
        <View style={{width:5, height:'100%'}}>
            <Svg viewBox="0 0 2 10">
                <Path d="M1 0.5 L 1 9.5" stroke={'white'} strokeWidth={1} strokeLinecap='round'/>
            </Svg>
        </View>
    )
}