import { StyleSheet, Text, View,Image,Pressable,Dimensions,TextInput,createContext } from 'react-native';
import { useState } from 'react';
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
export default function ForgetPassword(){
    const navigation=useNavigation()
    const[isChecked,setIsChecked]=useState(false)
    const [verifiation,setVerifiation]=useState('')
    const [email,setEmail]=useState('')
    function onSendVerification(){
        axios.post('http://8.152.214.138:8080/api/forgetPassword/sendemail',{
            email:email
        })
        .then(()=>console.log('success'))
        .catch((error)=>{
            console.log(email)
            console.log(error)
        })
    }
    function handleSubmit(){
        if(isChecked){
            axios.post('http://8.152.214.138:8080/api/forgetPassword/sendemail/verifycode',{
                code:verifiation
            })
            .then(()=>{
                console.log(verifiation)
                navigation.navigate('ResetPassword',{email:email})
            })
            .catch((error)=>{
                console.log(verifiation)
                console.log(error)
            })
        }
        else{
            console.log('没有勾选')
        }
    }
    return(
        <View style={styles.container}>
            <Image source={require('../图片/logo1.jpg')}
                style={{width:width*0.2,height:height*0.1,marginBottom:height*0.03}}
            ></Image>
            <Text
                style={{fontSize:width*0.08}}
            >邮箱验证</Text>
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
            <View style={{display:'flex',flexDirection:'row',marginTop:height*0.05}}>
                <Pressable
                    style={{width:width*0.04,height:width*0.04,borderColor:'black',borderWidth:1,marginTop:height*0.02,marginRight:width*0.03}}
                    onPress={()=>{setIsChecked(!isChecked)}}
                >
                    <Text style={{lineHeight:width*0.04,textAlign:'center',fontSize:width*0.04}}>{isChecked?'√':''}</Text>
                </Pressable>
                <Text style={{lineHeight:width*0.04,marginTop:height*0.02,fontSize:width*0.03}}>已阅读并同意</Text>
                <Pressable >
                    <Text style={{lineHeight:width*0.04,marginTop:height*0.02,fontSize:width*0.03,color:'red'}}>用户协议、隐私政策</Text>
                </Pressable>
            </View>
            <Pressable
                style={{backgroundColor:'#61B15A',width:width*0.7,height:height*0.06,borderRadius:10,marginBottom:height*0.01,marginTop:height*0.04}}
                onPress={handleSubmit}
            >
                <Text
                    style={{lineHeight:height*0.06,textAlign:'center',color:'white',fontSize:20}}
                >重设密码</Text>
            </Pressable>
            <Image
                source={require('../图片/树叶bg.png')}
                style={{width:width,height:height*0.3}}
            ></Image>
        </View>
    )
}
