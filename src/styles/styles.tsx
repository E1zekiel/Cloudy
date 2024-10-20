import { StyleSheet } from "react-native";
import { BlColors } from "../colors/colors";

export const ConnectionButtonStyles = StyleSheet.create({
    itemContainer: {
        flexDirection:'row',
        width:'90%', 
        height:50, 
        backgroundColor:'grey', 
        marginTop:10, 
        borderRadius:20, 
        alignSelf:'center', 
        justifyContent:'space-between', 
        alignItems:'center', 
        paddingLeft:20
    },
    itemContainerText:{
        color:'white', 
        fontSize:15
    },
    disconnectButton:{
        width:'23%', 
        height:'100%', 
        borderRadius:20,
        backgroundColor:'red', 
        justifyContent:'center'
    },
    disconnectButtonText:{
        color:'white',
         fontSize:12, 
         textAlign:'center'
    }
  })

export const TabStyles = StyleSheet.create({
    tabBarStyle:{
      height:70,
      borderTopColor:'#242424', 
      backgroundColor:'#242424',
      position:'absolute',
      borderRadius:20,
      marginBottom:20,
      width:'90%',
      marginLeft:'5%'
    }
  })
  
export const styles = StyleSheet.create({
      text:{
        color:BlColors.Primary,
        fontSize:25,
        fontFamily:'Inter ExtraBold'
      },
  
    })