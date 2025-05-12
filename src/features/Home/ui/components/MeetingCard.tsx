import React from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {MeetingCardProps} from '../../model/types';

const MeetingCard = ({
  category,
  categoryColor,
  categoryBgColor,
  date,
  author,
  authorImage,
  viewCount,
  title,
  description,
  likeCount,
  memberCount,
}: MeetingCardProps) => {
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={[styles.categoryTag, {backgroundColor: categoryBgColor}]}>
          <Text style={[styles.categoryText, {color: categoryColor}]}>
            {category}
          </Text>
        </View>
        <View style={styles.flex1}></View>
        <Text style={styles.dateText}>{date}</Text>
      </View>
      <View style={styles.authorRow}>
        <View style={styles.authorInfo}>
          <Image
            source={{uri: authorImage}}
            resizeMode={'stretch'}
            style={styles.authorImage}
          />
          <Text style={styles.authorName}>{author}</Text>
        </View>
        <View style={styles.flex1}></View>
        <View style={styles.viewCountContainer}>
          <Image
            source={{
              uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/7fndag3l_expires_30_days.png',
            }}
            resizeMode={'stretch'}
            style={styles.smallIcon}
          />
          <Text style={styles.metaText}>{viewCount}</Text>
        </View>
      </View>
      <View style={styles.cardContent}>
        <View style={styles.cardTextContainer}>
          <Text style={styles.cardTitle}>{title}</Text>
          <Text style={styles.cardDescription}>{description}</Text>
        </View>
        <View style={styles.cardFooter}>
          <View style={styles.footerItem}>
            <Image
              source={{
                uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/4hkcj7y0_expires_30_days.png',
              }}
              resizeMode={'stretch'}
              style={styles.smallIcon}
            />
            <Text style={styles.metaInfoText}>{likeCount}</Text>
          </View>
          <View style={styles.footerItem}>
            <Image
              source={{
                uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/ba28r6db_expires_30_days.png',
              }}
              resizeMode={'stretch'}
              style={styles.smallIcon}
            />
            <Text style={styles.metaInfoText}>{memberCount}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginRight: 8,
    shadowColor: '#0000000D',
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 4,
    elevation: 4,
    width: 280,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    width: '100%',
  },
  categoryTag: {
    borderRadius: 4,
    paddingHorizontal: 5,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  dateText: {
    color: '#9DA2AF',
    fontSize: 12,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  authorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  authorImage: {
    width: 24,
    height: 24,
    marginRight: 6,
  },
  authorName: {
    color: '#384050',
    fontSize: 12,
    fontWeight: 'bold',
  },
  viewCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallIcon: {
    width: 14,
    height: 14,
    marginRight: 4,
  },
  metaText: {
    color: '#9DA2AF',
    fontSize: 12,
  },
  cardContent: {
    alignItems: 'flex-start',
    width: '100%',
  },
  cardTextContainer: {
    marginBottom: 11,
    width: '100%',
  },
  cardTitle: {
    color: '#303030',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardDescription: {
    color: '#303030',
    fontSize: 14,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
    width: '100%',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  metaInfoText: {
    color: '#384050',
    fontSize: 12,
  },
  flex1: {
    flex: 1,
  },
});

export default MeetingCard;
