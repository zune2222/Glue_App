import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity, Image} from 'react-native';
import {styles} from './styles';

interface ChatInputProps {
  onSend: (message: string) => void;
}

const ChatInput: React.FC<ChatInputProps> = ({onSend}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim()) {
      onSend(message.trim());
      setMessage('');
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.textInput}
        value={message}
        onChangeText={setMessage}
        placeholder="메시지를 입력하세요"
        placeholderTextColor="#9DA2AF"
        multiline
        maxLength={1000}
      />
      <TouchableOpacity
        style={[styles.sendButton, !message.trim() && styles.disabled]}
        onPress={handleSend}
        disabled={!message.trim()}>
        <Image
          source={{
            uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/lxrs4xgg_expires_30_days.png',
          }}
          resizeMode="contain"
          style={styles.sendIcon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
