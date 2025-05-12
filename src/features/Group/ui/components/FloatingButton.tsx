import React from 'react';
import {View, Image, TouchableOpacity} from 'react-native';
import {navigationStyles} from '../styles/groupStyles';
import {Text} from '../../../../shared/ui/typography/Text';

interface FloatingButtonProps {
  onPress: () => void;
  label: string;
}

/**
 * 플로팅 액션 버튼 컴포넌트
 */
export const FloatingButton: React.FC<FloatingButtonProps> = ({
  onPress,
  label,
}) => {
  return (
    <TouchableOpacity style={navigationStyles.floatingButton} onPress={onPress}>
      <Image
        source={{
          uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/ybc61c3r_expires_30_days.png',
        }}
        resizeMode={'stretch'}
        style={navigationStyles.floatingButtonIcon}
      />
      <View style={navigationStyles.floatingButtonTextContainer}>
        <Text
          variant="button"
          weight="medium"
          style={navigationStyles.floatingButtonText}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};
