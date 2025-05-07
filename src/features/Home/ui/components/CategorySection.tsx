import React from 'react';
import {Text, ScrollView, StyleSheet} from 'react-native';
import {CategorySectionProps} from '../../model/types';
import MeetingCard from './MeetingCard';

const CategorySection = ({title, cards}: CategorySectionProps) => {
  return (
    <>
      <Text style={styles.sectionTitle}>{title}</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.horizontalScrollContent}
        style={styles.horizontalScroll}>
        {cards.map((card, index) => (
          <MeetingCard key={index} {...card} />
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    color: '#384050',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 13,
    marginLeft: 19,
  },
  horizontalScroll: {
    marginBottom: 32,
  },
  horizontalScrollContent: {
    paddingLeft: 19,
    paddingRight: 10,
  },
});

export default CategorySection;
