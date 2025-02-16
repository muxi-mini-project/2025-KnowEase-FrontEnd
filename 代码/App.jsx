
import { StyleSheet, Text, View,ImageBackground,Image,Pressable,Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { useState,useContext,createContext } from "react";
import LoginPage from './LoginPage';
import Agreement from './Agreement';
import Register from './Register'
import SetPassword from './SetPassword'
import ForgetPassword from './ForgetPassword'
import LifeZone from './LifeZone';
import AddPost from './AddPost';
import ResetPassword from './ResetPassword';
import My from './My';
import PostDetail from './PostDetail';
import EditInformation from './EditInformation';
import ChangeEmail from './ChangeEmail';
import ChatScreen from './ChatScreen';
const {width,height}=Dimensions.get('window')
const Stack = createStackNavigator()
function Start(){
  const navigation = useNavigation()//只能在函数组件中使用！返回navigation对象，有navigate,goBack,push方法
  return(
    <ImageBackground
      source={require('../图片/bg.png')}
      style={{flex:1,width:'100%',height:'100%'}}
    >
      <View 
        style={{display:'flex',alignItems:'center',marginTop:height*0.25}}
      >
        <Image
          source={require('../图片/l.png')}
          style={{width:width*0.3,height:height*0.14,marginBottom:height*0.06}}
        ></Image>
        <Text
          style={{color:'white',fontSize:width*0.05,textAlign:'center',letterSpacing:width*0.015
          }}
        >小知，你的校园生活小助手</Text>
      </View>
      <View
        style={{display:'flex',alignItems:'center',marginTop:height*0.3}}
      >
        <Pressable
          style={{backgroundColor:'#69B09C',width:width*0.7,height:height*0.06,borderRadius:10,marginBottom:height*0.01}}
          onPress={()=>{navigation.navigate('Login')}}
        >
          <Text
            style={{lineHeight:height*0.06,textAlign:'center',color:'white',fontSize:20}}
          >立即登录</Text>
        </Pressable>
        <Pressable
          onPress={()=>{navigation.navigate('Register')}}
        >
          <Text
            style={{color:'white',fontSize:height*0.016}}
          >还没有账号?去注册</Text>
        </Pressable>
      </View>
    </ImageBackground>
  )
}
export default function App(){
  return(
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Start" screenOptions={{headerShown:false}}>
        <Stack.Screen name="Start" component={Start}></Stack.Screen>
        <Stack.Screen name="Login" component={LoginPage}></Stack.Screen>
        <Stack.Screen name="Agreement" component={Agreement}></Stack.Screen>
        <Stack.Screen name='Register' component={Register}></Stack.Screen>
        <Stack.Screen name='SetPassword' component={SetPassword}></Stack.Screen>
        <Stack.Screen name='ForgetPassword' component={ForgetPassword}></Stack.Screen>
        <Stack.Screen name='LifeZone' component={LifeZone}></Stack.Screen>
        <Stack.Screen name='AddPost' component={AddPost}></Stack.Screen>
        <Stack.Screen name='ResetPassword' component={ResetPassword}></Stack.Screen>
        <Stack.Screen name='My' component={My}></Stack.Screen>
        <Stack.Screen name='PostDetail' component={PostDetail}></Stack.Screen>
        <Stack.Screen name='EditInformation' component={EditInformation}></Stack.Screen>
        <Stack.Screen name='ChangeEmail' component={ChangeEmail}></Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  )
}