import React from 'react';
import {View, Text, Image} from 'react-native';
import {styles} from './styles';

interface TabHeaderProps {
  activeTab: 'chat' | 'message';
  onTabChange?: (tab: 'chat' | 'message') => void;
}

const TabHeader: React.FC<TabHeaderProps> = ({activeTab}) => {
  return (
    <>
      <View style={styles.container}>
        <Text
          style={activeTab === 'chat' ? styles.activeTab : styles.inactiveTab}>
          모임톡
        </Text>
        <Text
          style={
            activeTab === 'message' ? styles.activeTab : styles.inactiveTab
          }>
          쪽지
        </Text>
      </View>

      <Image
        source={{
          uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/cdl4n6ra_expires_30_days.png',
        }}
        resizeMode="stretch"
        style={[styles.indicator, {marginLeft: activeTab === 'chat' ? 20 : 88}]}
      />
    </>
  );
};

export default TabHeader;
