import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';

const BannerSection = () => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.bannerScrollContent}
      style={styles.bannerScroll}>
      <View style={styles.bannerContainer}>
        <View style={[styles.banner, styles.bannerMarginLeft]}></View>
        <View style={[styles.banner, styles.bannerMarginLeft]}></View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bannerScroll: {
    marginBottom: 31,
  },
  bannerScrollContent: {
    paddingHorizontal: 19,
  },
  bannerContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginRight: 8,
    flexDirection: 'row',
  },
  banner: {
    width: 355,
    height: 173,
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
  },
  bannerMarginLeft: {
    marginTop: 10,
    marginRight: 10,
  },
});

export default BannerSection;
