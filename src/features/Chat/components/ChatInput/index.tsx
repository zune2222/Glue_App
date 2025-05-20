import React, {useState} from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import {styles} from './styles';
import {MessageSend} from '@shared/assets/images';

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
        <MessageSend style={styles.sendIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default ChatInput;
