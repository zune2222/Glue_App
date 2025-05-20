import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';

type FilterType = 'host' | 'guest' | 'all';

interface MessageFilterProps {
  onFilterChange?: (filter: FilterType) => void;
}

const MessageFilter: React.FC<MessageFilterProps> = ({onFilterChange}) => {
  const {t} = useTranslation();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const handleFilterPress = (filter: FilterType) => {
    setActiveFilter(filter);
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === 'host'
            ? styles.activeFilterButton
            : styles.inactiveFilterButton,
        ]}
        onPress={() => handleFilterPress('host')}>
        <Text
          style={[
            styles.filterText,
            activeFilter === 'host'
              ? styles.activeFilterText
              : styles.inactiveFilterText,
          ]}>
          {t('messages.host')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === 'guest'
            ? styles.activeFilterButton
            : styles.inactiveFilterButton,
        ]}
        onPress={() => handleFilterPress('guest')}>
        <Text
          style={[
            styles.filterText,
            activeFilter === 'guest'
              ? styles.activeFilterText
              : styles.inactiveFilterText,
          ]}>
          {t('messages.guest')}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          styles.filterButton,
          activeFilter === 'all'
            ? styles.activeFilterButton
            : styles.inactiveFilterButton,
        ]}
        onPress={() => handleFilterPress('all')}>
        <Text
          style={[
            styles.filterText,
            activeFilter === 'all'
              ? styles.activeFilterText
              : styles.inactiveFilterText,
          ]}>
          {t('messages.all')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 26,
    marginLeft: 20,
  },
  filterButton: {
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 19,
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: '#384050',
  },
  inactiveFilterButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#D2D5DB',
    borderWidth: 1,
  },
  filterText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  activeFilterText: {
    color: '#F9FAFB',
  },
  inactiveFilterText: {
    color: '#303030',
  },
});

export default MessageFilter;
