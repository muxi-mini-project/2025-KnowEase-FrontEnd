import { StyleSheet, Text, View,Image,Pressable,Dimensions,TextInput,createContext } from 'react-native';
import { useState,useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import React from 'react';
const {width,height}=Dimensions.get('window')

const styles=StyleSheet.create({
    container:{
        display:'flex',
        alignItems:'center',
        marginTop:height*0.15
    },
    input:{
        borderColor:'black',
        height:height*0.05,
        borderWidth:0.5,
        width:width*0.5,
        borderRadius:5,
        marginBottom:height*0.01,
    },
    pwForget:{
        display:'flex',
        alignSelf:'flex-end',
        color:'#929EB2'
    }
})
export default function SetPassword({route}){
    const {email}=route.params
    const navigation=useNavigation()
    const [confirm,setConfirm]=useState('')
    const [password,setPassword]=useState('')
    function handleSubmit(){
        if(password===confirm){
            axios.post('http://8.152.214.138:8080/api/register/sendemail/verifycode/sendmessage',{
                email:email,
                id:'',
                password:password,
                role:'',
                username:''
            })
            .then(()=>{
                navigation.navigate('Agreement')
            })
            .catch((error)=>{
                console.log(password)
                console.log(email)
                console.log(error)
            })
        }
        else{
            console.log('密码不同，请重试')
        }
    }
    return(
        <View style={styles.container}>
            <Image source={require('../图片/logo1.jpg')}
                style={{width:width*0.2,height:height*0.1,marginBottom:height*0.03}}
            ></Image>
            <Text
                style={{fontSize:width*0.08}}
            >请设置您的密码</Text>
            <View>
                <View style={{marginTop:height*0.04}}>
                    <TextInput
                        style={styles.input}
                        placeholder='输入密码'
                        value={password}
                        onChange={e=>setPassword(e.nativeEvent.text)}
                    ></TextInput>
                    <View style={{width:width*0.5}}>
                        <TextInput
                            style={styles.input}
                            placeholder='确认密码'
                            value={confirm}
                            onChange={e=>setConfirm(e.nativeEvent.text)}
                        >
                        </TextInput>
                    </View>
                </View>
            </View>
            <Pressable
                style={{backgroundColor:'#61B15A',width:width*0.7,height:height*0.06,borderRadius:10,marginBottom:height*0.01,marginTop:height*0.04}}
                onPress={handleSubmit}
            >
                <Text
                    style={{lineHeight:height*0.06,textAlign:'center',color:'white',fontSize:20}}
                >立即注册</Text>
            </Pressable>
            <Pressable
                onPress={()=>{navigation.navigate('Login')}}
            >
                <Text
                    style={{color:'grey',fontSize:height*0.016}}
                >已经有账号？去登录</Text>
            </Pressable>
            <Image
                source={require('../图片/树叶bg.png')}
                style={{width:width,height:height*0.3}}
            ></Image>
        </View>
    )
}
