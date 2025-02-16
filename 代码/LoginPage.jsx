import { StyleSheet, Text, View,Image,Pressable,Dimensions,TextInput,createContext } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React,{useState,useRef} from 'react';
import axios from 'axios';
import { Input1,Input2 } from './Login';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
    },
    warningText:{
        color:'red'
    }
})
function Framework({children,handleSubmit1,handleSubmit2,pwLogin,isChecked,setPwLogin,setIsChecked,warningVisible,setWarningVisible}){
    const navigation=useNavigation()
    return(
        <View style={styles.container}>
            <Image source={require('../图片/logo1.jpg')}
                style={{width:width*0.2,height:height*0.1,marginBottom:height*0.03}}
            ></Image>
            <Text
                style={{fontSize:width*0.08}}
            >登录</Text>
            <View style={{display:'flex',flexDirection:'row',gap:width*0.05,marginTop:height*0.03,marginBottom:height*0.03}}>
                <Pressable style={{borderRightWidth: 1,borderRightColor: '#ccc',paddingRight:width*0.04}}
                    onPress={()=>{
                        setPwLogin(true)
                    }}
                >
                    <Text style={{fontSize:width*0.05,color:pwLogin?'black':'#929EB2'}}
                    >密码登录</Text>
                </Pressable>
                <Pressable onPress={()=>{
                    setPwLogin(false)
                }}>
                    <Text style={{fontSize:width*0.05,color:pwLogin?'#929EB2':'black'}}>邮箱登录</Text>
                </Pressable>
            </View>
            <View>
                {children}
            </View>
            <View style={{display:'flex',flexDirection:'row',marginTop:height*0.05}}>
                <Pressable
                    style={{width:width*0.04,height:width*0.04,borderColor:'black',borderWidth:1,marginTop:height*0.02,marginRight:width*0.03}}
                    onPress={()=>{
                        setIsChecked(!isChecked)
                        setWarningVisible(false)
                    }}
                >
                    <Text style={{lineHeight:width*0.04,textAlign:'center',fontSize:width*0.04}}>{isChecked?'√':''}</Text>
                </Pressable>
                <Text style={{lineHeight:width*0.04,marginTop:height*0.02,fontSize:width*0.03}}>已阅读并同意</Text>
                <Pressable >
                    <Text style={{lineHeight:width*0.04,marginTop:height*0.02,fontSize:width*0.03,color:'red'}}>用户协议、隐私政策</Text>
                </Pressable>
                
            </View>
            {warningVisible&&<Text style={styles.warningText}>还未勾选！</Text>}
            <Pressable
                style={{backgroundColor:'#61B15A',width:width*0.7,height:height*0.06,borderRadius:10,marginBottom:height*0.01,marginTop:height*0.04}}
                onPress={pwLogin?handleSubmit1:handleSubmit2}
            >
                <Text
                    style={{lineHeight:height*0.06,textAlign:'center',color:'white',fontSize:20}}
                >立即登录</Text>
            </Pressable>
            <Pressable onPress={()=>{navigation.navigate('Register')}}>
                <Text
                    style={{color:'grey',fontSize:height*0.016}}
                >还没有账号?去注册</Text>
            </Pressable>
            <Image
                source={require('../图片/树叶bg.png')}
                style={{width:width,height:height*0.3}}
            ></Image>
        </View>
    )
}
export default function LoginPage(){
    const navigation=useNavigation()
    const [pwLogin,setPwLogin]=useState(true)
    const[isChecked,setIsChecked]=useState(false)
    const[warningVisible,setWarningVisible]=useState(false)
    const verifiation=useRef('')
    const password=useRef('')
    const email=useRef('')
    function handleSubmit1(){
        if(isChecked){
            axios.post('http://8.152.214.138:8080/api/login/bypassword',{
                email:email.current,
                password:password.current
            })
            .then((response)=>{
                AsyncStorage.setItem('token',response.data.token)
                AsyncStorage.setItem('userId',response.data.usermessage.ID)
                AsyncStorage.setItem('profile',response.data.usermessage.url)
                AsyncStorage.setItem('backgroundImage',response.data.usermessage.backgroundURL)
                AsyncStorage.setItem('userName',response.data.usermessage.Username)
                AsyncStorage.setItem('email',response.data.usermessage.email)
                navigation.navigate('LifeZone')
                console.log('success')
                console.log(response.data.usermessage.email)
                AsyncStorage.getItem('token')
                .then(token=>{
                    console.log(token);
                })
                .catch(err=>{
                    console.log(err)
                })
                AsyncStorage.getItem('userId')
                .then(id=>console.log(id))
                .catch(error=>console.log(error))
                AsyncStorage.getItem('profile')
                .then(url=>console.log(url))
                .catch(err=>console.log(err))
            })
            .catch(error=>{
                console.log({email,password})
                console.log(error)
            })
        }
        else{
            console.log('没有勾选')
            setWarningVisible(true)
        }
    }
    function handleSubmit2(){
        if(isChecked){
            axios.post('http://8.152.214.138:8080/api/login/sendemail/verifycode',{
                code:verifiation.current,
                email:email.current
            })
            .then((response)=>{
                AsyncStorage.setItem('token',response.data.token)
                navigation.navigate('LifeZone')
            })
            .catch((error)=>{
                console.log(error)
            })
        }
        else{
            console.log('没有勾选')
            setWarningVisible(true)
        }
    }
    
    const handleSetEmail = (value)=>{
        email.current = value
    }
    const handleSetPassword = (value)=>{
        password.current = value
    }
    const handleSetVerification=(value)=>{
        verifiation.current=value
    }
    const handleSendVerification=()=>{
        axios.post('http://8.152.214.138:8080/api/login/sendemail',{
            email:email.current
        })
        .then(()=>console.log('success'))
        .catch((error)=>{
            console.log(email.current)
            console.log(error)
        })
    }
    return(
        <Framework handleSubmit1={handleSubmit1} handleSubmit2={handleSubmit2} pwLogin={pwLogin} isChecked={isChecked} setPwLogin={setPwLogin} setIsChecked={setIsChecked} warningVisible={warningVisible} setWarningVisible={setWarningVisible} >
            <View>
                {pwLogin?<Input1 inputSetEmail={handleSetEmail} inputSetPassword={handleSetPassword} email={email} password={password}/>:<Input2 email={email} verification={verifiation} setEmail={handleSetEmail} setVerification={handleSetVerification} onSendVerification={handleSendVerification} />}
            </View>
        </Framework>
    )
}
