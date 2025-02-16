import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
async function uploadQiniu(file,setImageUrl){
    console.log('running')
    const tokenData=await AsyncStorage.getItem('token');
    try{
        const uploadToken=await axios.get('http://8.152.214.138:8080/api/getToken',{
            headers:{
                'Authorization':`Bearer ${tokenData}`
            }
        });
        // console.log(uploadToken.data.token);
        const formData=new FormData();
        formData.append('file',{
            uri: file.uri,
            type: file.type,
            name: file.name
        });
        formData.append('token',uploadToken.data.token);
        // console.log('sending')
        axios.post('https://up-z2.qiniup.com',formData,{
            headers:{
                'Content-Type':'multipart/form-data'
            }
        })
        .then(response=>{
            // console.log(response.data);
            const data=response.data;
            if(data.key){
                console.log('上传成功',data);
                setImageUrl('https://mini-project.muxixyz.com/'+data.key);
                // console.log(imageUrl);
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
export default uploadQiniu;