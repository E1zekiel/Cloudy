import { StyleSheet, View } from "react-native"
import { AnimationMaker } from "../components/AnimationMaker.tsx/AnimationMaker"

const styles = StyleSheet.create(({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    paddingTop: '20%',
  },
}))

export const AnimationScreen = () => {
return(
  <View style={styles.container}>
    <AnimationMaker/>
  </View>
)
}