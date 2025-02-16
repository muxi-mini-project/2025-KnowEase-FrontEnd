import { StyleSheet, Text, View,Image,Pressable,Dimensions,ScrollView,TextInput} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import React,{useState,useRef,useEffect, useContext} from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import Reply from './Reply';
const {width,height}=Dimensions.get('window')
const styles=StyleSheet.create({
    returnImage:{
        marginTop:height*0.05,
        marginLeft:width*0.03,
        height:height*0.02,
        width:width*0.06
    },
    profileImage:{
        height:height*0.04,
        width:width*0.09,
        
    },
    contentBody:{
        display:'flex',
        flexDirection:'row',
        marginTop:height*0.02,
        marginLeft:width*0.06
    },
    contentImage:{
        marginTop:height*0.02,
        marginLeft:width*0.19,
        width:width*0.55,
        height:height*0.2
    },
    like:{
        height:height*0.03,
        width:width*0.06,
        
    },
    tag:{
        width:width*0.15,
        height:height*0.03,
        backgroundColor:'#D6EBD5',
        marginLeft:width*0.07,
        borderRadius:width*0.02,
        borderWidth:1,
        borderColor:'#61B15A',
        display:'flex',
        flexDirection:'row'
    },
    tagIcon:{
        width:width*0.043,
        height:height*0.02,
        marginTop:height*0.005,
        marginLeft:width*0.005
    },
    division:{
        height:height*0.002,
        margin:'auto',
        marginTop:height*0.02,
        width:width*0.95
    },
    question:{
        height:height*0.03,
        width:width*0.067,
        marginLeft:width*0.04,
        marginRight:width*0.02
    },
    look:{
        height:height*0.03,
        width:width*0.077,
    }
})

export default function PostDetail({route}){
    const navigation=useNavigation();
    const [ViewCount,setViewCount]=useState(0);
    const [profileUrl,setProfileUrl]=useState('');
    const {PostID}=route.params;//已经获取帖子id！
    const [LikeCount,setLikeCount]=useState(0);
    const [SaveCount,setSaveCount]=useState(0);
    const [image,setImage]=useState('')
    const [content,setContent]=useState('');
    const [tag,setTag]=useState('');
    // const [date,setDate]=useState('');
    const [PosterName,setPosterName]=useState('');
    const [comment,setComment]=useState([]);
    const [addComment,setAddComment]=useState('');
    const [replyMap,setReplyMap]=useState({});
    const [replyImageMap,setReplyImageMap]=useState({});
    const [commentImage,setCommentImage]=useState('');
    const [likeStatusMap,setLikeStatusMap]=useState({});
    const [saveStatusMap,setSaveStatusMap]=useState({});
    const [commentLikeMap,setCommentLikeMap]=useState({});
    const [commentLikeStatusMap,setCommentLikeStatusMap]=useState({});
    
    // const {likeStatusMap,toggleLike,saveStatusMap,toggleSave}=useContext(LikeContext);
    async function update() {
        try{
            const userId=await AsyncStorage.getItem('userId');
            const token=await AsyncStorage.getItem('token');
            const response=await axios.get(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/getstatus`,{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            setLikeStatusMap((pre)=>({...pre,[PostID]:response.data.LikeStatus}))
            setSaveStatusMap((pre)=>({...pre,[PostID]:response.data.SaveStatus}))
            
            const data=await axios.get(`http://8.152.214.138:8080/api/${userId}/post/${PostID}`,{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            
            setImage(data.data.postMessage.urls);
            setContent(data.data.postMessage.body);
            setPosterName(data.data.postMessage.PosterName);
            // setDate(data.data.postMessage.CreateAt);
            setTag(data.data.postMessage.tag);
            setComment(data.data.postMessage.Comment)
            // setLike(likeStatusMap[PostID]||false);
            const information=await axios.get(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/getcounts`,{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            setLikeCount(information.data.likecount);
            setSaveCount(information.data.savecount);
            setViewCount(information.data.ViewCount)
        }
        catch{err=>{console.log(err)}}
    }
    async function uploadQiniu(file,status,commentid){
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
                    if(status==='评论')
                    {setCommentImage('https://mini-project.muxixyz.com/'+data.key);
                    console.log('上传成功'+data.key);
                    console.log(commentImage)}
                    else if(status==='回复'){
                        setReplyImageMap((pre)=>({...pre,[commentid]:'https://mini-project.muxixyz.com/'+data.key}));
                        console.log('上传成功'+data.key);
                    }
                    
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
    async function pickImage(status,commentid){
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
            
            await uploadQiniu(file,status,commentid);
            
        }
    }
    async function handleSubmit(){
        const userId=await AsyncStorage.getItem('userId');
        const token=await AsyncStorage.getItem('token');
            axios.post(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/publishcomment`,{
                imageurl:commentImage,
                body:addComment
            },{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            .then(()=>{
                console.log('图片url:'+commentImage)
                console.log('发布评论成功');
                update();
                setAddComment('');
                setCommentImage('');
            })
            .catch(err=>console.log(err));
    }
    async function handleSubmitReply(commentid) {
        const userId=await AsyncStorage.getItem('userId');
        const token=await AsyncStorage.getItem('token');
        axios.post(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/${commentid}/publishreply`,{
            imageurl:replyImageMap[commentid]||'',
            body:replyMap[commentid]||''
        },{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })
        .then((response)=>{
            console.log(response.data)
            console.log('发布回复成功');
            console.log(commentid)
            update();
            setReplyMap((pre)=>({...pre,[commentid]:''}));
            setReplyImageMap((pre)=>({...pre,[commentid]:''}));
        })
        .catch(err=>console.log(err))
    }
    async function handleLike(){
        try{
            
            const userId=await AsyncStorage.getItem('userId');
            const token=await AsyncStorage.getItem('token');
            if(!likeStatusMap[PostID]){
                axios.post(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/like`,{},{
                    headers:{
                        'Authorization':`Bearer ${token}`
                    }
                })
                .then(()=>{
                    
                    update();
                })
                .catch(error=>{if (error.response) {
                    console.log('服务器响应数据:', error.response.data);
                    console.log('服务器响应状态码:', error.response.status);
                    console.log('服务器响应头:', error.response.headers);
                } else if (error.request) {
                    console.log('请求已发送，但未收到响应:', error.request);
                } else {
                    console.log('请求设置出错:', error.message);
                }})
            }
            else{
                axios.post(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/cancellike`,{},{
                    headers:{
                        'Authorization':`Bearer ${token}`
                    }
                })
                .then(()=>{
                    
                    update();
                    
                })
                .catch(error=>{if (error.response) {
                    console.log('服务器响应数据:', error.response.data);
                    console.log('服务器响应状态码:', error.response.status);
                    console.log('服务器响应头:', error.response.headers);
                } else if (error.request) {
                    console.log('请求已发送，但未收到响应:', error.request);
                } else {
                    console.log('请求设置出错:', error.message);
                }})
            }
            
        }
        catch(err){
            console.log(err.message);
        }
        
    }
    async function handleCollect(){
        try{
            
            const userId=await AsyncStorage.getItem('userId');
            const token=await AsyncStorage.getItem('token');
            if(!saveStatusMap[PostID]){
                axios.post(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/save`,{},{
                    headers:{
                        'Authorization':`Bearer ${token}`
                    }
                })
                .then((response)=>{
                    console.log(response);
                    update();
                    // setSaveCount(SaveCount+1);
                })
                .catch(error=>{if (error.response) {
                    console.log('服务器响应数据:', error.response.data);
                    console.log('服务器响应状态码:', error.response.status);
                    console.log('服务器响应头:', error.response.headers);
                } else if (error.request) {
                    console.log('请求已发送，但未收到响应:', error.request);
                } else {
                    console.log('请求设置出错:', error.message);
                }})
            }
            else{
                axios.post(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/cancelsave`,{},{
                    headers:{
                        'Authorization':`Bearer ${token}`
                    }
                })
                .then((response)=>{
                    console.log(response);
                    update();
                    // setSaveCount(SaveCount-1)
                })
                .catch(error=>{if (error.response) {
                    console.log('服务器响应数据:', error.response.data);
                    console.log('服务器响应状态码:', error.response.status);
                    console.log('服务器响应头:', error.response.headers);
                } else if (error.request) {
                    console.log('请求已发送，但未收到响应:', error.request);
                } else {
                    console.log('请求设置出错:', error.message);
                }})
            }
        }
        catch(err){
            console.log(err.message);
        }
    }
    async function updateCommentLike(commentid){
        const userId=await AsyncStorage.getItem('userId');
        const token=await AsyncStorage.getItem('token');
        const response=await axios.get(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/${commentid}/getcounts`,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })
        setCommentLikeMap((pre)=>({...pre,[commentid]:response.data.likecount}))
        const data=await axios.get(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/${commentid}/getstatus`,{
            headers:{
                'Authorization':`Bearer ${token}`
            }
        })
        setCommentLikeStatusMap((pre)=>({...pre,[commentid]:data.data.LikeStatus}))
    }
    async function handleCommentLike(commentid){
        const userId=await AsyncStorage.getItem('userId');
        const token=await AsyncStorage.getItem('token');
        if(!commentLikeStatusMap[commentid]){
            axios.post(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/${commentid}/like`,{},{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            .then(()=>{
                updateCommentLike(commentid)
            })
            .catch(err=>console.log(err))
        }
        else{
            axios.post(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/${commentid}/cancellike`,{},{
                headers:{
                    'Authorization':`Bearer ${token}`
                }
            })
            .then(()=>{
                updateCommentLike(commentid)
            })
            .catch(err=>console.log(err))
        }
    }
    AsyncStorage.getItem('profile')
    .then((url)=>{
        setProfileUrl(url);
    })
    .catch(err=>{
        console.log(err);
    })
    useEffect(()=>{
        update();
    },[])
    useEffect(() => {
        const updateCommentLikes = async () => {
            try {
                const userId = await AsyncStorage.getItem('userId');
                const token = await AsyncStorage.getItem('token');
                const requests = comment.map(async (a) => {
                    const response = await axios.get(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/${a.commentid}/getcounts`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    const data = await axios.get(`http://8.152.214.138:8080/api/${userId}/post/${PostID}/${a.commentid}/getstatus`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                    return {
                        commentid: a.commentid,
                        likecount: response.data.likecount,
                        LikeStatus: data.data.LikeStatus
                    };
                });
                const results = await Promise.all(requests);
                const newCommentLikeMap = {};
                const newCommentLikeStatusMap = {};
                results.forEach((result) => {
                    newCommentLikeMap[result.commentid] = result.likecount;
                    newCommentLikeStatusMap[result.commentid] = result.LikeStatus;
                });
                setCommentLikeMap(newCommentLikeMap);
                setCommentLikeStatusMap(newCommentLikeStatusMap);
            } catch (err) {
                console.log('初始化评论点赞信息出错:', err);
            }
        };
        if (comment.length > 0) {
            updateCommentLikes();
        }
    }, [comment]);

    return(
        <View>
            <Pressable onPress={()=>navigation.navigate('LifeZone')}>
                <Image source={require('../图片/返回按钮.png')} style={styles.returnImage}></Image>
            </Pressable>
            <View style={styles.contentBody}>
                <Image source={{uri:profileUrl}} style={styles.profileImage}></Image>
                <View style={{marginLeft:width*0.04}}>
                    <Text style={{fontSize:width*0.04,marginBottom:height*0.01}}>{PosterName}</Text>
                    <Text style={{fontSize:width*0.03}}>{content}</Text>
                </View>
            </View>
            <Image source={{uri:image}} style={styles.contentImage}></Image>
            <View style={{display:'flex',flexDirection:'row',gap:width*0.05,justifyContent:'flex-end',marginRight:width*0.03,marginTop:height*0.01}}>
                <View style={{display:'flex',flexDirection:'row'}}>
                    <Image source={require('../图片/浏览(1).png')} style={styles.look}></Image>
                    <Text style={{lineHeight:height*0.03,fontSize:width*0.035,marginLeft:width*0.01}}>{ViewCount}</Text>
                </View>
                <Pressable onPress={handleCollect} style={{display:'flex',flexDirection:'row'}}>
                    <Image source={saveStatusMap[PostID]?require('../图片/已收藏 .png'):require('../图片/未收藏.png')} style={styles.like}></Image>
                    <Text style={{lineHeight:height*0.03,fontSize:width*0.035,marginLeft:width*0.01}}>{SaveCount}</Text>
                </Pressable>
                <Pressable onPress={handleLike} style={{display:'flex',flexDirection:'row'}}>
                    <Image source={likeStatusMap[PostID]?require('../图片/已点赞 (2)(1).png'):require('../图片/已点赞(1).png')} style={styles.like}></Image>
                    <Text style={{lineHeight:height*0.03,fontSize:width*0.035,marginLeft:width*0.01}}>{LikeCount}</Text>
                </Pressable>
                <Pressable>
                    <Image source={require('../图片/删除(1).png')} style={styles.like}></Image>
                </Pressable>
            </View>
            <View style={styles.tag}>
                <Image source={require('../图片/tag标签(1).png')} style={styles.tagIcon}></Image>
                <Text style={{lineHeight:height*0.028,marginLeft:width*0.01,fontSize:width*0.03,color:'#61B15A'}}>{tag}</Text>
            </View>
            <Image source={require('../图片/分割线 (1)(1).png')} style={styles.division}></Image>
            <View style={{display:'flex',flexDirection:'row',marginTop:height*0.01}}>
                <Image source={require('../图片/问好(1).png')} style={styles.question}></Image>
                <Text style={{lineHeight:height*0.03,fontSize:width*0.04,color:'#61B15A'}}>最热评论</Text>
            </View>
            <ScrollView style={{marginLeft:width*0.03,height:height*0.43}}>
                {comment.map((a)=>{
                    // updateCommentLike(a.commentid)
                    return(
                        <View key={a.commentid} style={{marginTop:height*0.03}}>
                            <View style={{display:'flex',flexDirection:'row',marginTop:height*0.01,marginBottom:height*0.01}}>
                                <Image source={{uri:a.CommenterURL}}></Image>
                                <Text>{a.CommenterName}</Text>
                            </View>
                            <Text>{a.body}</Text>
                            {a.imageurl&&<Image source={{uri:a.imageurl}} style={{height:height*0.1,width:width*0.4,marginTop:height*0.01}}></Image>}
                            <View style={{display:'flex',flexDirection:'row',marginTop:height*0.01,alignItems:'center'}}>
                                <TextInput
                                    placeholder={`回复${a.CommenterName}`}
                                    value={replyMap[a.commentid]||''}
                                    onChangeText={text=>{
                                        setReplyMap((pre)=>({...pre,[a.commentid]:text}))
                                    }}
                                    style={{width:width*0.4}}
                                ></TextInput>
                                <Pressable onPress={()=>pickImage('回复',a.commentid)}>
                                    <Image source={require('../图片/发布图片.png')} style={{height:height*0.02,width:width*0.04,marginLeft:width*0.03}}></Image>
                                </Pressable>
                                <Pressable onPress={()=>handleSubmitReply(a.commentid)}>
                                    <Image source={require('../图片/提交成功(1).png')} style={{height:height*0.02,width:width*0.04,marginLeft:width*0.03}}></Image>
                                </Pressable>
                                <Pressable onPress={()=>handleCommentLike(a.commentid)}>
                                    <Image source={commentLikeStatusMap[a.commentid]?require('../图片/已点赞 (2)(1).png'):require('../图片/已点赞(1).png')} style={{height:height*0.02,width:width*0.04,marginLeft:width*0.25,marginRight:width*0.01}}></Image>
                                </Pressable>
                                <Text>{commentLikeMap[a.commentid]}</Text>
                                <Pressable>
                                    <Image source={require('../图片/删除(1).png')} style={{height:height*0.02,width:width*0.04,marginLeft:width*0.02}}></Image>
                                </Pressable>
                            </View>
                            {a.Reply&& <Reply a={a} name={a.CommenterName} update={update} pickImage={pickImage} uploadQiniu={uploadQiniu} handleSubmitReply={handleSubmitReply} replyMap={replyMap} setReplyMap={setReplyMap} replyImageMap={replyImageMap} setReplyImageMap={setReplyImageMap} PostID={PostID} />}
                        </View>
                    )
                })}
                
            </ScrollView>
            <View style={{display:'flex',flexDirection:'row',height:height*0.04,borderWidth:1,width:width*0.8,margin:'auto',borderRadius:width*0.01,backgroundColor:'#D6EBD5',borderColor:'#61B15A',alignItems:'center'}}>
                <TextInput 
                    placeholder='评论一下吧' 
                    style={{height:height*0.04,width:width*0.6,margin:'auto',borderRadius:width*0.01,backgroundColor:'#D6EBD5',borderColor:'#61B15A'}}
                    value={addComment}
                    onChange={(e)=>{
                        setAddComment(e.nativeEvent.text)
                    }}
                >
                </TextInput>
                <Pressable onPress={()=>pickImage('评论')}>
                    <Image source={require('../图片/发布图片.png')} style={{height:height*0.02,width:width*0.05}}></Image>
                </Pressable>
                <Pressable style={{marginRight:width*0.02,lineHeight:height*0.04,marginLeft:width*0.02}} onPress={handleSubmit}>
                    <Text>发布</Text>
                </Pressable>
            </View>
        </View>
    )
}