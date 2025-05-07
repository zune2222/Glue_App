import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import Header from './components/Header';
import BannerSection from './components/BannerSection';
import CategorySection from './components/CategorySection';
import {
  popularMeetings,
  koreanMeetings,
  englishMeetings,
} from '../model/dummyData';

const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.scrollContainer}>
        <Header />
        <BannerSection />
        <CategorySection title="실시간 인기 모임글" cards={popularMeetings} />
        <CategorySection
          title="한국어 사용자를 찾는 모임"
          cards={koreanMeetings}
        />
        <CategorySection
          title="영어 사용자를 찾는 모임"
          cards={englishMeetings}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
});

export default HomeScreen;
