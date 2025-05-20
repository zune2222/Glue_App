import React from 'react';
import {ScrollView, StyleSheet, TouchableOpacity, View} from 'react-native';
import {useTranslation} from 'react-i18next';
import {CategorySectionProps} from '../../model/types';
import MeetingCard from './MeetingCard';
import {Text} from '../../../../shared/ui/typography/Text';

const CategorySection = ({title, cards}: CategorySectionProps) => {
  const {t} = useTranslation();

  return (
    <>
      <View style={styles.titleContainer}>
        <Text
          variant="subtitle1"
          weight="bold"
          color="#384050"
          style={styles.sectionTitle}>
          {title}
        </Text>
        <TouchableOpacity>
          <Text variant="body2" color="#9DA2AF" style={styles.seeAllText}>
            {t('home.seeAll')}
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContent}
        style={styles.horizontalScroll}>
        {cards.length > 0 ? (
          cards.map((card, index) => <MeetingCard key={index} {...card} />)
        ) : (
          <View style={styles.emptyContainer}>
            <Text variant="body2" color="#9DA2AF" style={styles.emptyText}>
              {t('home.emptyState')}
            </Text>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 13,
    marginHorizontal: 19,
  },
  sectionTitle: {
    fontSize: 18,
  },
  seeAllText: {
    fontSize: 14,
  },
  horizontalScroll: {
    marginBottom: 32,
  },
  horizontalScrollContent: {
    paddingLeft: 19,
    paddingRight: 10,
  },
  emptyContainer: {
    width: 280,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginRight: 8,
  },
  emptyText: {
    fontSize: 14,
  },
});

export default CategorySection;
