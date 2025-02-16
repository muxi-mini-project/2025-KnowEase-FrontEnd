import React, { useState } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import EventSource from 'react-native-event-source';

const ChatScreen = () => {
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  const handleChat = () => {
    console.log('send')
    // 清空之前的响应
    setResponse('');
    console.log(question)
    // 创建一个新的 EventSource 实例
    const eventSource = new EventSource(
      `http://192.168.0.111:3000/api/deepseek/chat?question=${encodeURIComponent(question)}`
    );

    // 监听消息事件
    eventSource.addEventListener('message', (event) => {
        console.log('hi')
      const data = event.data;
      if (data === 'END') {
        eventSource.close(); // 关闭连接
      } else {
        setResponse((prevResponse) => prevResponse + data); // 更新响应内容
      }
    });

    // 处理错误
    eventSource.addEventListener('error', (error) => {
      console.error('EventSource failed:', error);
      eventSource.close();
    });
  };

  return (
    <View style={{padding:100}}>
        <Text>请输入问题</Text>
      <TextInput
        placeholder="Enter your question"
        value={question}
        onChangeText={setQuestion}
      />
      <Button title="Send" onPress={handleChat} />
      <Text>{response}</Text>
    </View>
  );
};

export default ChatScreen;