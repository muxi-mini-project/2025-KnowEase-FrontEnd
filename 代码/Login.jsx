import { StyleSheet, Text, View,Image,Pressable,Dimensions,TextInput } from 'react-native';
import React,{useEffect, useState,useContext} from 'react';
import { useNavigation } from '@react-navigation/native';
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
        marginBottom:height*0.01
    },
    pwForget:{
        display:'flex',
        alignSelf:'flex-end',
        color:'#929EB2'
    }
})

function Input1({email,inputSetEmail,password,inputSetPassword}){
    const navigation=useNavigation()
    return(  
        <View style={{width:width*0.5,display:'flex'}}>
            <TextInput
                style={styles.input}
                placeholder='输入Email'
                value={email}
                onChange={(e)=>{
                    inputSetEmail(e.nativeEvent.text)
                }}
            />
            <TextInput
                style={styles.input}
                placeholder='输入密码'
                value={password}
                onChange={e=>{
                    inputSetPassword(e.nativeEvent.text)
                }}
            ></TextInput>
            <Pressable
                onPress={()=>{navigation.navigate('ForgetPassword')}}
            >
                <Text style={styles.pwForget}>忘记密码？</Text>
            </Pressable>
        </View>
    )
}
function Input2({email,setEmail,verification,setVerification,onSendVerification}){
    return(
        <View>
            <TextInput
                style={styles.input}
                placeholder='输入Email'
                value={email}
                onChange={e=>setEmail(e.nativeEvent.text)}
            ></TextInput>
            <View style={{width:width*0.5}}>
                <TextInput
                    style={styles.input}
                    placeholder='输入验证码'
                    value={verification}
                    onChange={e=>setVerification(e.nativeEvent.text)}
                >
                </TextInput>
                <Pressable style={{position:'absolute',right:5}}
                    onPress={onSendVerification}
                >
                    <Text style={{lineHeight:height*0.04,color:'grey'}}>获取验证码</Text>
                </Pressable>
            </View>
        </View>
    )
}

export {Input1,Input2};