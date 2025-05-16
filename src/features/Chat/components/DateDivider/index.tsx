import React from 'react';
import {View, Text} from 'react-native';
import {styles} from './styles';

interface DateDividerProps {
  date: string;
}

const DateDivider: React.FC<DateDividerProps> = ({date}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{date}</Text>
    </View>
  );
};

export default DateDivider;
