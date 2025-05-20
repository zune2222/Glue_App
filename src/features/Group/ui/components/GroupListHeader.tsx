import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Text} from '@shared/ui/typography/Text';
import {ChevronDown, Search, Bell} from '@shared/assets/images';
import {commonStyles} from '../styles/groupStyles';

interface GroupListHeaderProps {
  categoryText: string;
  onCategoryPress: () => void;
}

const GroupListHeader: React.FC<GroupListHeaderProps> = ({
  categoryText,
  onCategoryPress,
}) => {
  const navigation = useNavigation<any>();

  // 터치 영역 확장 설정
  const touchHitSlop = {top: 20, right: 20, bottom: 20, left: 20};

  const handleSearchPress = () => {
    navigation.navigate('GroupSearch');
  };

  const handleBellPress = () => {
    // @ts-ignore - NotificationsScreen은 메인 네비게이션에 있음
    navigation.navigate('NotificationsScreen');
  };

  return (
    <>
      <View style={commonStyles.subHeader}>
        <TouchableOpacity
          style={commonStyles.categorySelector}
          onPress={onCategoryPress}
          hitSlop={touchHitSlop}>
          <Text
            variant="subtitle1"
            weight="medium"
            style={commonStyles.subHeaderTitle}>
            {categoryText}
          </Text>
          <ChevronDown style={commonStyles.iconSmall} />
        </TouchableOpacity>
        <View style={commonStyles.flexFill} />
        <TouchableOpacity onPress={handleSearchPress} hitSlop={touchHitSlop}>
          <Search style={[commonStyles.iconSmall, commonStyles.iconRight]} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleBellPress} hitSlop={touchHitSlop}>
          <Bell style={commonStyles.iconSmall} />
        </TouchableOpacity>
      </View>
      <View style={commonStyles.divider} />
    </>
  );
};

export default GroupListHeader;
