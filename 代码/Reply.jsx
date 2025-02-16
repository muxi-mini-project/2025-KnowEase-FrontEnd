import { StyleSheet, Text, View,Image,Pressable,Dimensions,ScrollView,TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React,{useState,useRef,useEffect, useContext} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { jsx } from 'react/jsx-runtime';
const {width,height}=Dimensions.get('window')
export default function Reply({a,name,update,pickImage,uploadQiniu,handleSubmitReply,replyMap,setReplyMap,replyImageMap,setReplyImageMap,PostID}){
    const [replyCountMap,setReplyCountMap]=useState({});
    const [replyStatusMap,setReplyStatusMap]=useState({});
    async function handleSubmitReply(commentid,id) {
        console.log('1')
        const userId=await AsyncStorage.getItem('userId');
        const token=await AsyncStorage.getItem('token');
        console.log('sending')
        axios.post(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/${commentid}/publishreply`,{
            imageurl:replyImageMap[id]||'',
            body:replyMap[id]||''
        },{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })
        .then(()=>{
            console.log('发布回复成功');
            update();
            setReplyMap((pre)=>({...pre,[id]:''}));
            setReplyImageMap((pre)=>({...pre,[id]:''}));
        })
        .catch(err=>console.log(err))
    }
    async function uploadQiniu(file,commentid){
        console.log('qiniu')
        const tokenData=await AsyncStorage.getItem('token');
        const uploadToken=await axios.get('http://8.152.214.138:8080/api/getToken',{
            headers:{
                'Authorization':`Bearer ${tokenData}`
            }
        })
        
        if(!uploadToken){
            console.log('获取token失败')
        }
        else{
            const formData=new FormData();
            formData.append('file',{
                uri: file.uri,
                type: file.type,
                name: file.name
            });
            formData.append('token',uploadToken.data.token);
            console.log('sending')
            axios.post('https://up-z2.qiniup.com',formData,{
                headers:{
                    'Content-Type':'multipart/form-data'
                }
            })
            .then((response)=>{
                console.log('sending')
                const data=response.data;
                if(data.key){
                    setReplyImageMap((pre)=>({...pre,[commentid]:'https://mini-project.muxixyz.com/'+data.key}));
                    console.log('上传成功'+data.key);
                }
                else{
                    console.log('上传失败')
                }
            })
            .catch(error=>{
                if (error.response) {
                    console.log('服务器响应数据:', error.response.data);
                    console.log('服务器响应状态码:', error.response.status);
                    console.log('服务器响应头:', error.response.headers);
                } else if (error.request) {
                    console.log('请求已发送，但未收到响应:', error.request);
                } else {
                    console.log('请求设置出错:', error.message);
                }
            })
        }
    }
    const requestPermission=async ()=>{
            const {status}=await ImagePicker.requestMediaLibraryPermissionsAsync();
            if(status!=='granted'){
                Alert.alert('Permission required', 'You need to grant access to the photo library')
                return false;
            }
            return true;
        }
    async function pickImage(commentid){
        const permissionGranted=await requestPermission();
        if(!permissionGranted) return;
        const result=await ImagePicker.launchImageLibraryAsync({
            mediaTypes:'images',
            allowsEditing:true,
            aspect:[4,3],
            quality:1
        })
        if(!result.canceled){
            const file={
                uri:result.assets[0].uri,
                type:result.assets[0].mimeType,
                name:result.assets[0].fileName
            }
            
            await uploadQiniu(file,commentid);
            
        }
    }
    async function updateReply(commentid,replyid) {
        const userId=await AsyncStorage.getItem('userId');
        const token=await AsyncStorage.getItem('token');
        axios.get(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/${commentid}/${replyid}/getstatus`,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })
        .then((response)=>{
            setReplyStatusMap((pre)=>({...pre,[replyid]:response.data.LikeStatus}))
        })
        .catch(err=>console.log(err));
        axios.get(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/${commentid}/${replyid}/getcounts`,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })
        .then((response)=>{
            setReplyCountMap((pre)=>({...pre,[replyid]:response.data.likecount}))
        })
        .catch(err=>console.log(err))
    }
    async function handleLike(commentid,replyid){
        const userId=await AsyncStorage.getItem('userId');
        const token=await AsyncStorage.getItem('token');
        axios.post(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/${commentid}/${replyid}/like`,{},{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })
        .then(()=>{
            updateReply(commentid,replyid)
        })
        .catch(err=>console.log(err.response.data))
        
    }
    
    return(
        <View key={a.commentid}>
            {a.Reply && a.Reply.map((b)=>{
                updateReply(a.commentid,b.commentid)
                return(
                    <View key={b.commentid} style={{marginTop:height*0.03}}>
                        <Text>{b.ReplyerName} 回复 {name} </Text>
                        <Text>{b.body}</Text>
                        {b.imageurl&&<Image source={{uri:b.imageurl}} style={{height:height*0.1,width:width*0.4,marginTop:height*0.01}}></Image>}
                        <View style={{display:'flex',flexDirection:'row',marginTop:height*0.01,alignItems:'center'}}>
                            <TextInput
                                placeholder={`回复${name}`}
                                value={replyMap[b.commentid]||''}
                                onChangeText={text=>{setReplyMap((pre)=>({...pre,[b.commentid]:text}))}}
                                style={{width:width*0.4}}
                            ></TextInput>
                            <Pressable onPress={()=>pickImage(b.commentid)}>
                                <Image source={require('../图片/发布图片.png')} style={{height:height*0.02,width:width*0.04,marginLeft:width*0.03}}></Image>
                            </Pressable>
                            <Pressable onPress={()=>handleSubmitReply(a.commentid,b.commentid)}>
                                <Image source={require('../图片/提交成功(1).png')} style={{height:height*0.02,width:width*0.04,marginLeft:width*0.03}}></Image>
                            </Pressable>
                            <Pressable onPress={()=>handleLike(a.commentid,b.commentid)}>
                                <Image source={replyStatusMap[b.commentid]? require('../图片/已点赞 (2)(1).png'):require('../图片/已点赞(1).png')} style={{height:height*0.02,width:width*0.04,marginLeft:width*0.25,marginRight:width*0.01}}></Image>
                            </Pressable>
                            
                            <Text>{replyCountMap[b.commentid]}</Text>
                            <Pressable>
                                <Image source={require('../图片/删除(1).png')} style={{height:height*0.02,width:width*0.04,marginLeft:width*0.02}}></Image>
                            </Pressable>
                        </View>
                        <Reply a={b} name={b.ReplyerName} update={update} pickImage={pickImage} uploadQiniu={uploadQiniu} handleSubmitReply={handleSubmitReply} replyMap={replyMap} setReplyMap={setReplyMap} replyImageMap={replyImageMap} setReplyImageMap={setReplyImageMap} PostID={PostID}/>
                    </View>
                )
            })}
        </View>
    )
}