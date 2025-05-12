import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import {useTranslation} from 'react-i18next';
import Header from './components/Header';
import BannerSection from './components/BannerSection';
import CategorySection from './components/CategorySection';
import {
  popularMeetings,
  koreanMeetings,
  englishMeetings,
} from '../model/dummyData';

const HomeScreen = () => {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header />
      <ScrollView style={styles.scrollContainer}>
        <BannerSection />
        <CategorySection title={t('home.popular')} cards={popularMeetings} />
        <CategorySection title={t('home.nearby')} cards={koreanMeetings} />
        <CategorySection title={t('home.recent')} cards={englishMeetings} />
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
