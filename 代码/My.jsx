import { StyleSheet, Text, View,Image,Pressable,Dimensions,TextInput,createContext,ImageBackground } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React,{useState,useRef, useEffect} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
const {width,height}=Dimensions.get('window')
const styles=StyleSheet.create({
    topBackground:{
        height:height*0.25,
        width:width
    },
    topProfileInformation:{
        marginTop:height*0.08,
        marginLeft:width*0.08,
        height:height*0.1,
        width:width*0.55,
        display:'flex',
        flexDirection:'row'
    },
    profileImage:{
        width:width*0.17,
        height:width*0.17,
        borderRadius:width*0.1,
        marginRight:width*0.08
    },
    passageInformation:{
        display:'flex',
        flexDirection:'row',
        gap:width*0.08,
        marginLeft:width*0.07,
        
    },
    topText:{
        fontSize:width*0.035
    },
    editeButton:{
        borderWidth:1.5,
        height:height*0.04,
        width:width*0.2,
        borderRadius:width*0.04,
        borderColor:'#96C583',
        backgroundColor:'#F4F8EC'
    },
    bodyNavigator:{
        marginTop:height*0.01,
        display:'flex',
        flexDirection:'row',
        height:height*0.07,
        alignItems:'center',
        width:width,
    },
    icon:{
        marginLeft:width*0.04,
        height:height*0.03,
        width:height*0.03,
        marginRight:width*0.04
    },
    text:{
        fontSize:width*0.04,
    },
    detail:{
        marginLeft:'auto',
        marginRight:width*0.05,
        height:height*0.03,
        width:height*0.03
    },
    bottom:{
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-around',
        height:height*0.07,
        borderBottomWidth:1,
        borderTopWidth:1,
        borderColor:'grey',
        padding:height*0.01,
        marginTop:height*0.02,
        alignItems:'center'
    },
    bottomImage:{
        height:height*0.03
    }
})
export default function My(){
    const [profile,setProfile]=useState('');
    const [backgroundImage,setBackgroundImage]=useState('');
    const [getLikeCount,setGetLikeCount]=useState(0);
    const [fansCount,setFansCount]=useState(0);
    const [followCount,setFollowCount]=useState(0);
    const [userName,setUserName]=useState('');
    const [userId,setUserId]=useState('')
    const navigation=useNavigation();
    AsyncStorage.getItem('profile')
    .then((url)=>{
        setProfile(url)
    })
    .catch(err=>console.log(err))
    // AsyncStorage.getItem('backgroundImage')
    // .then((url)=>{
    //     setBackgroundImage(url)
    // })
    .catch(err=>console.log(err))
    AsyncStorage.getItem('userName')
    .then((name)=>{
        setUserName(name)
    })
    .catch(err=>console.log(err))
    AsyncStorage.getItem('userId')
    .then((id)=>{
        setUserId(id)
    })
    .catch(err=>console.log(err))
    async function update() {
        try{
            const token=await AsyncStorage.getItem('token');
            const response=await axios.get(`http://8.152.214.138:8080/api/${userId}/userpage/likecount`,{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            setGetLikeCount(response.data.LikesCount);
            setFansCount(response.data.FollowerCount);
            setFollowCount(response.data.FolloweeCount);
        }
        catch{
            err=>console.log(err)
        }
        
    }
    // async function handleChangeBackGround(){
    //     const token=await AsyncStorage.getItem('token');
    //     const userId=await AsyncStorage.getItem('userId');
    //     axios.post(`http://8.152.214.138:8080/api/${userId}/userpage/alterbackground`,{
    //         backgroundURL:backgroundImage
    //     },{
    //         headers:{
    //             'Authorization':`Bearer ${token}`
    //         }
    //     })
    //     .then(()=>{
    //         console.log('更换背景成功');
    //         // console.log(backgroundImage)
    //     })
    //     .catch((err)=>console.log(err))
    // }
    // async function uploadQiniu(file){
    //     const tokenData=await AsyncStorage.getItem('token');
    //     if(!tokenData){
    //         console.log('failed');
    //     }
    //     else{
    //         console.log('successful');
    //         console.log(tokenData)
    //         try{
    //             const uploadToken=await axios.get('http://8.152.214.138:8080/api/getToken',{
    //                 headers:{
    //                     'Authorization':`Bearer ${tokenData}`
    //                 }
    //             });
    //             console.log(uploadToken.data.token);
    //             const formData=new FormData();
    //             formData.append('file',{
    //                 uri: file.uri,
    //                 type: file.type,
    //                 name: file.name
    //             });
    //             formData.append('token',uploadToken.data.token);
    //             console.log('sending')
    //             axios.post('https://up-z2.qiniup.com',formData,{
    //                 headers:{
    //                     'Content-Type':'multipart/form-data'
    //                 }
    //             })
    //             .then(response=>{
    //                 console.log(response.data);
    //                 const data=response.data;
    //                 if(data.key){
    //                     console.log('上传成功',data);
    //                     setBackgroundImage('https://mini-project.muxixyz.com/'+data.key);
    //                     console.log(backgroundImage)
    //                 }
    //                 else{
    //                     console.log('失败')
    //                 }
    //             })
    //             .catch(error=>{
    //                 console.log(error,'失败');
    //                 if (error.response) {
    //                     console.log('服务器响应数据:', error.response.data);
    //                     console.log('服务器响应状态码:', error.response.status);
    //                     console.log('服务器响应头:', error.response.headers);
    //                 } else if (error.request) {
    //                     console.log('请求已发送，但未收到响应:', error.request);
    //                 } else {
    //                     console.log('请求设置出错:', error.message);
    //                 }
    //             })
    //         }
    //         catch(error){
    //             console.log(error)
    //         }
    //     }
    // }
    // const requestPermission=async ()=>{
    //         const {status}=await ImagePicker.requestMediaLibraryPermissionsAsync();
    //         if(status!=='granted'){
    //             Alert.alert('Permission required', 'You need to grant access to the photo library')
    //             return false;
    //         }
    //         return true;
    //     }
    // async function pickImage(){
    //     const permissionGranted=await requestPermission();
    //         if(!permissionGranted) return;
    //         const result=await ImagePicker.launchImageLibraryAsync({
    //             mediaTypes:'images',
    //             allowsEditing:true,
    //             aspect:[4,3],
    //             quality:1,
    //         });
    //         if(!result.canceled){
    //             const file={
    //                 uri:result.assets[0].uri,
    //                 type:result.assets[0].mimeType,
    //                 name:result.assets[0].fileName
    //             }
    //             await uploadQiniu(file);
    //             handleChangeBackGround();
    //         }
    // }
    async function handleLogOut(){
        const token=await AsyncStorage.getItem('token');
        axios.post('http://8.152.214.138:8080/api/logout',{},{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })
        .then(()=>{
            navigation.navigate('Start')
        })
        .catch(err=>console.log(err))
    }
    useEffect(()=>{update()},[]);
    
    useEffect(()=>{
        const fetchBackgroundImage=async()=>{
            const url=await AsyncStorage.getItem('backgroundImage');
            setBackgroundImage(url);
        }
        fetchBackgroundImage();
    },[])
    
    return(
        <View style={{display:'flex'}}>
            <ImageBackground source={{uri:backgroundImage}} style={styles.topBackground}>
                <View style={styles.topProfileInformation}>
                    <Image source={{uri:profile}} style={styles.profileImage}></Image>
                    <View>
                        <Text style={{lineHeight:height*0.05,fontSize:width*0.04}}>{userName}</Text>
                        <Text>ID:{userId}</Text>
                        
                    </View>
                </View>
                <Pressable>
                    <Image source={require('../图片/编辑 (1)(1).png')} style={{height:height*0.03,width:height*0.03,position:'absolute',top:-height*0.045,left:width*0.22}}></Image>
                </Pressable>
                <View style={styles.passageInformation}>
                    <View>
                        <Text style={styles.topText}>{followCount}</Text>
                        <Text style={styles.topText}>关注</Text>
                    </View>
                    <View>
                        <Text style={styles.topText}>{fansCount}</Text>
                        <Text style={styles.topText}>粉丝</Text>
                    </View>
                    <View style={{marginRight:width*0.2}}>
                        <Text style={styles.topText}>{getLikeCount}</Text>
                        <Text style={styles.topText}>获赞</Text>
                    </View>
                    <Pressable 
                    style={styles.editeButton}
                    onPress={()=>{
                        navigation.navigate('EditInformation')
                    }}
                    >
                        <Text style={{fontSize:width*0.04,textAlign:'center',lineHeight:height*0.04}}>编辑资料</Text>
                        
                    </Pressable>
                </View>
            </ImageBackground>
            <View>
                <View style={styles.bodyNavigator}>
                    <Image source={require('../图片/发布买卖(1).png')} style={styles.icon}></Image>
                    <Text style={styles.text}>发布</Text>
                    <Image source={require('../图片/详情(1).png')} style={styles.detail}></Image>
                </View>
                <View  style={styles.bodyNavigator}>
                    <Image source={require('../图片/浏览记录 (2)(1).png')} style={styles.icon}></Image>
                    <Text style={styles.text}>浏览记录</Text>
                    <Image source={require('../图片/详情(1).png')} style={styles.detail}></Image>
                </View>
                <View  style={styles.bodyNavigator}>
                    <Image style={styles.icon} source={require('../图片/点赞 红心.png')}></Image>
                    <Text style={styles.text}>点赞</Text>
                    <Image source={require('../图片/详情(1).png')} style={styles.detail}></Image>
                </View>
                <View  style={styles.bodyNavigator}>
                    <Image style={styles.icon} source={require('../图片/收藏 (2)(1).png')}></Image>
                    <Text style={styles.text} >收藏</Text>
                    <Image source={require('../图片/详情(1).png')} style={styles.detail}></Image>
                </View>
                <View  style={styles.bodyNavigator}>
                    <Image style={styles.icon} source={require('../图片/消息 (1)(1).png')}></Image>
                    <Text style={styles.text}>消息</Text>
                    <Image source={require('../图片/详情(1).png')} style={styles.detail}></Image>
                </View>
                <View  style={styles.bodyNavigator}>
                    <Image style={styles.icon} source={require('../图片/隐私 (1)(1).png')}></Image>
                    <Text style={styles.text}>隐私政策</Text>
                    <Image source={require('../图片/详情(1).png')} style={styles.detail}></Image>
                </View>
                <View  style={styles.bodyNavigator}>
                    <Image style={styles.icon} source={require('../图片/关于我们 (2)(1).png')}></Image>
                    <Text style={styles.text}>关于我们</Text>
                    <Image source={require('../图片/详情(1).png')}style={styles.detail}></Image>
                </View>
                <Pressable onPress={handleLogOut}>
                    <View  style={styles.bodyNavigator}>
                        <Image style={styles.icon} source={require('../图片/退出 (2)(1).png')}></Image>
                        <Text style={styles.text}>退出账号</Text>
                    </View>
                </Pressable>
                
                <View style={styles.bottom}>
                    <Pressable>
                        <Image source={require('../图片/问号.jpg')}></Image>
                        <Text style={{color:'#A1A8AD'}}>问答</Text>
                    </Pressable>
                    <Pressable onPress={()=>{navigation.navigate('LifeZone')}}>
                        <Image source={require('../图片/生活.jpg')}></Image>
                        <Text style={{color:'#A1A8AD'}}>生活</Text>
                    </Pressable>
                    <Pressable>
                        <Image source={require('../图片/发布帖子.jpg')}></Image>
                    </Pressable>
                    <Pressable>
                        <Image source={require('../图片/聊天.png')} ></Image>
                        <Text style={{color:'#A1A8AD'}}>聊天</Text>
                    </Pressable>
                    <Pressable>
                        <Image source={require('../图片/我的（绿）.png')} style={styles.bottomImage}></Image>
                        <Text style={{color:'#63AD64',textAlign:'center'}}>我的</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}