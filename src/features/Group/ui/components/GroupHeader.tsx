import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {groupDetailStyles} from '../styles/groupDetailStyles';

/**
 * 모임 상세 페이지의 헤더 컴포넌트
 */
const GroupHeader: React.FC = () => {
  const navigation = useNavigation();

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={groupDetailStyles.subHeaderContainer}>
      <TouchableOpacity onPress={handleGoBack}>
        <Image
          source={{
            uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/ke46mcdy_expires_30_days.png',
          }}
          resizeMode={'stretch'}
          style={groupDetailStyles.subHeaderIcon}
        />
      </TouchableOpacity>
      <View style={{flex: 1}} />
      <Image
        source={{
          uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/rob8rusa_expires_30_days.png',
        }}
        resizeMode={'stretch'}
        style={groupDetailStyles.subHeaderIconWithMargin}
      />
      <Image
        source={{
          uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/jkjqp0iu_expires_30_days.png',
        }}
        resizeMode={'stretch'}
        style={groupDetailStyles.subHeaderIconWithMargin}
      />
      <Image
        source={{
          uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/dx4thg4q_expires_30_days.png',
        }}
        resizeMode={'stretch'}
        style={groupDetailStyles.subHeaderIcon}
      />
    </View>
  );
};

export default GroupHeader;
