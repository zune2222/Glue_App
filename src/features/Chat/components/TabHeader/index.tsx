import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {styles} from './styles';

interface TabHeaderProps {
  activeTab: 'chat' | 'message';
  onTabChange?: (tab: 'chat' | 'message') => void;
}

const TabHeader: React.FC<TabHeaderProps> = ({activeTab, onTabChange}) => {
  return (
    <View>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => onTabChange && onTabChange('chat')}
          style={styles.tabButton}>
          <Text
            style={
              activeTab === 'chat' ? styles.activeTab : styles.inactiveTab
            }>
            모임톡
          </Text>
          {activeTab === 'chat' && <View style={styles.indicator} />}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onTabChange && onTabChange('message')}
          style={styles.tabButton}>
          <Text
            style={
              activeTab === 'message' ? styles.activeTab : styles.inactiveTab
            }>
            쪽지
          </Text>
          {activeTab === 'message' && <View style={styles.indicator} />}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TabHeader;
