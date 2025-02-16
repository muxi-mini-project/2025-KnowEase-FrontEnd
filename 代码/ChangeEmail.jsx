import { StyleSheet, Text, View,Image,Pressable,Dimensions,TextInput,createContext } from 'react-native';
import { useState,useRef } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
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
export default function ChangeEmail(){
    const navigation=useNavigation()
    const [verifiation,setVerifiation]=useState('')
    const [email,setEmail]=useState('')
    function onSendVerification(){
        axios.post('http://8.152.214.138:8080/api/register/sendemail',{
            email:email
        })
        .then(()=>console.log('success'))
        .catch((error)=>{
            console.log(email)
            console.log(error)
        })
    }
    return(
        <View style={styles.container}>
            <Image source={require('../图片/logo1.jpg')}
                style={{width:width*0.2,height:height*0.1,marginBottom:height*0.03}}
            ></Image>
            <Text
                style={{fontSize:width*0.08}}
            >修改邮箱</Text>
            <View>
                <View style={{marginTop:height*0.04}}>
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
                            value={verifiation}
                            onChange={e=>setVerifiation(e.nativeEvent.text)}
                        >
                        </TextInput>

                        <Pressable style={{position:'absolute',right:5}}
                            onPress={onSendVerification}
                        >
                            <Text style={{lineHeight:height*0.04,color:'grey'}}>获取验证码</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
            <Pressable
                style={{backgroundColor:'#61B15A',width:width*0.7,height:height*0.06,borderRadius:10,marginBottom:height*0.01,marginTop:height*0.1}}
                
            >
                <Text
                    style={{lineHeight:height*0.06,textAlign:'center',color:'white',fontSize:20}}
                >确认修改</Text>
            </Pressable>
            <Image
                source={require('../图片/树叶bg.png')}
                style={{width:width,height:height*0.3}}
            ></Image>
        </View>
    )
}
