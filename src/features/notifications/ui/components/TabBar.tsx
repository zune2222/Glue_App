import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

interface TabBarProps {
  activeTab: 'news' | 'notice';
  onTabChange: (tab: 'news' | 'notice') => void;
}

const TabBar: React.FC<TabBarProps> = ({activeTab, onTabChange}) => {
  return (
    <View style={styles.container}>
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabChange('news')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'news'
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}>
            내 소식
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => onTabChange('notice')}>
          <Text
            style={[
              styles.tabText,
              activeTab === 'notice'
                ? styles.activeTabText
                : styles.inactiveTabText,
            ]}>
            공지사항
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.indicatorContainer}>
        <View
          style={[
            styles.indicator,
            {
              left: activeTab === 'news' ? 0 : '50%',
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingVertical: 9,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#303030',
  },
  inactiveTabText: {
    color: '#D2D5DB',
  },
  indicatorContainer: {
    height: 2,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    width: '50%',
    height: 2,
    backgroundColor: '#1CBFDC',
  },
});

export default TabBar;
