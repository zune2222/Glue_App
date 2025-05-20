import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {groupDetailStyles} from '../styles/groupDetailStyles';
import {ChevronLeft, Menu, Share} from '@shared/assets/images';

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
        <ChevronLeft style={groupDetailStyles.subHeaderIcon} />
      </TouchableOpacity>
      <View style={{flex: 1}} />
      <Share style={groupDetailStyles.subHeaderIconWithMargin} />
      <Menu style={groupDetailStyles.subHeaderIcon} />
    </View>
  );
};

export default GroupHeader;
