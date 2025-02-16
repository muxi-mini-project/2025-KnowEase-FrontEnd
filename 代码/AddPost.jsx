import { StyleSheet, Text, View,Image,Pressable,Dimensions,TextInput,Alert } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import DropDownPicker from 'react-native-dropdown-picker';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
const {width,height}=Dimensions.get('window')
const styles=StyleSheet.create({
    navigator:{
        borderColor:'grey',
        borderBottomWidth:1,
        marginTop:height*0.04,
        height:height*0.07,
        display:'flex',
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'
    },
    navigatorText:{
        lineHeight:height*0.035,
        marginRight:width*0.03,
        marginLeft:width*0.03,
        fontSize:width*0.04,
        color:'white'
    },
    postButton:{
        backgroundColor:'#61B15A',
        marginRight:width*0.01,
        width:width*0.15,
        height:height*0.035,
        borderRadius:width*0.03,
    },
    navigatorTitle:{
        fontSize:width*0.06,
        color:'#B1B1B9'
    },
    postPicture:{
        backgroundColor:'white',
        width:width*0.4,
        height:width*0.4,
        position:'absolute',
        left:width*0.3,
        top:height*0.2,
        borderRadius:width*0.04,
        display:'flex',
        justifyContent:'center',
        alignItems:'center'
    },
    addPicture:{
        width:width*0.08,
        height:width*0.08,
        marginBottom:height*0.01
    },
    pictureText:{
        color:'#626262',
        fontSize:width*0.043
    },
    addText:{
        position:'absolute',
        top:height*0.41,
        marginLeft:width*0.07
    },
    textInput:{
        width:width*0.8,
        height:height*0.05,
        backgroundColor:'white',
        borderRadius:width*0.02
    },
    inputText:{
        fontSize:width*0.045,
        marginBottom:height*0.01,
        marginTop:height*0.02
    },
    textInputContent:{
        width:width*0.8,
        height:height*0.1,
        backgroundColor:'white',
        borderRadius:width*0.02
    },
})
export default function AddPost(){
    const navigation=useNavigation();
    const [open,setOpen]=useState(false)
    const [imageUri,setImageUri]=useState(null);
    const [title,setTittle]=useState('');
    const [content,setContent]=useState('');
    const [tag,setTag]=useState('');
    const [imageUrl,setImageUrl]=useState('');
    const items=[
        {label:'校园',value:'校园'},
        {label:'美食',value:'美食'},
        {label:'绘画',value:'绘画'},
        {label:'生活',value:'生活'}
    ]
    async function uploadQiniu(file){
        const tokenData=await AsyncStorage.getItem('token');
        if(!tokenData){
            console.log('failed');
        }
        else{
            console.log('successful');
            console.log(tokenData)
            try{
                const uploadToken=await axios.get('http://8.152.214.138:8080/api/getToken',{
                    headers:{
                        'Authorization':`Bearer ${tokenData}`
                    }
                });
                console.log(uploadToken.data.token);
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
                .then(response=>{
                    console.log(response.data);
                    const data=response.data;
                    if(data.key){
                        console.log('上传成功',data);
                        setImageUrl('https://mini-project.muxixyz.com/'+data.key);
                        console.log(imageUrl);
                    }
                    else{
                        console.log('失败')
                    }
                })
                .catch(error=>{
                    console.log(error,'失败');
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
            catch(error){
                console.log(error)
            }
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
    const pickImage=async()=>{
        const permissionGranted=await requestPermission();
        if(!permissionGranted) return;
        const result=await ImagePicker.launchImageLibraryAsync({
            mediaTypes:'images',
            allowsEditing:true,
            aspect:[4,3],
            quality:1,
        });
        if(!result.canceled){
            setImageUri(result.assets[0].uri);
            console.log(result.assets[0].uri)
            const file={
                uri:result.assets[0].uri,
                type:result.assets[0].mimeType,
                name:result.assets[0].fileName
            }
            await uploadQiniu(file);
        }
    }
    async function handleSubmit(){
        const userId=await AsyncStorage.getItem('userId')
        const tokenData=await AsyncStorage.getItem('token')
        console.log('发布')
        axios.post(`http://8.152.214.138:8080/api/${userId}/post/publish`,{
            body:content,
            tag:tag,
            title:title,
            urls:imageUrl
        },{
            headers:{
                'Authorization':`Bearer ${tokenData}`
            }
        })
        .then(()=>{
            console.log('发布成功');
            console.log(title);
            console.log(imageUrl)
            navigation.navigate('LifeZone')
        }
        )
        .catch(error=>console.log(error))
    }
    return(
        <View>
            <View style={styles.navigator}>
                <Pressable style={{marginLeft:width*0.01}} onPress={()=>{navigation.navigate('LifeZone')}}>
                    <Image source={require('../图片/返回 (1)(1).png')}></Image>
                </Pressable>
                <Text style={styles.navigatorTitle}>生活</Text>
                <Pressable style={styles.postButton} onPress={handleSubmit}>
                    <Text style={styles.navigatorText}>发布</Text>
                </Pressable>
            </View>
            
            {imageUri?<Image source={{uri:imageUri}} style={styles.postPicture} />:<View style={styles.postPicture}>
                <Pressable onPress={pickImage}>
                    <Image source={require('../图片/添加图片.png')} style={styles.addPicture}></Image>
                </Pressable>
                <Text style={styles.pictureText}>照片</Text>
            </View>}
            <View style={styles.addText}>
                <View>
                    <Text style={styles.inputText}>标题</Text>
                    <TextInput 
                        style={styles.textInput} 
                        placeholder='填写标题更容易让其他人看见哦...'
                        value={title}
                        onChange={e=>{
                            setTittle(e.nativeEvent.text)
                        }}
                    ></TextInput>
                </View>
                <View>
                    <Text style={styles.inputText}>内容</Text>
                    <TextInput 
                        style={styles.textInputContent} 
                        placeholder='写下你的内容' 
                        multiline={true}
                        value={content}
                        onChange={e=>setContent(e.nativeEvent.text)}
                    ></TextInput>
                </View>
                <View>
                    <Text style={styles.inputText}>标签</Text>
                    <DropDownPicker
                        value={tag}
                        setValue={setTag}
                        open={open}
                        setOpen={setOpen}
                        placeholder='请选择一个标签'
                        items={items}
                        style={{width:width*0.8,borderColor:'white'}}
                        dropDownContainerStyle={{borderColor:'white'}}
                    />
                </View>
            </View>
        </View>
    )
}