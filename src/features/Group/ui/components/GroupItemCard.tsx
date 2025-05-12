import React from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';
import {GroupItemProps} from '../../model/types';
import {commonStyles, groupListStyles} from '../styles/groupStyles';

/**
 * 모임 아이템 카드 컴포넌트
 * - 이미지가 있는 경우와 없는 경우 다른 레이아웃 사용
 */
export const GroupItemCard: React.FC<GroupItemProps> = ({item, onPress}) => {
  // 이미지가 있는 경우와 없는 경우 다른 레이아웃 사용
  if (item.image) {
    return (
      <TouchableOpacity onPress={() => onPress(item.id)} activeOpacity={0.7}>
        <View style={groupListStyles.itemContainer}>
          <View style={groupListStyles.itemHeader}>
            <View
              style={[
                groupListStyles.categoryBadge,
                {backgroundColor: item.categoryColor},
              ]}>
              <Text
                style={[
                  groupListStyles.categoryText,
                  {color: item.categoryTextColor},
                ]}>
                {item.category}
              </Text>
            </View>
            <View style={groupListStyles.likesContainer}>
              <Image
                source={{
                  uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/vdl01404_expires_30_days.png',
                }}
                resizeMode={'stretch'}
                style={groupListStyles.likeIcon}
              />
              <Text style={groupListStyles.likesText}>{item.likes}</Text>
            </View>
          </View>
          <View style={groupListStyles.itemContent}>
            <View style={groupListStyles.textContainer}>
              <Text style={groupListStyles.title}>{item.title}</Text>
              <Text style={groupListStyles.description}>
                {item.description}
              </Text>
              <View style={groupListStyles.metaContainer}>
                <View style={groupListStyles.metaItem}>
                  <Image
                    source={{
                      uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/mc8m30v3_expires_30_days.png',
                    }}
                    resizeMode={'stretch'}
                    style={groupListStyles.metaIcon}
                  />
                  <Text style={groupListStyles.metaText}>{item.comments}</Text>
                </View>
                <View style={groupListStyles.metaItem}>
                  <Image
                    source={{
                      uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/11326jg7_expires_30_days.png',
                    }}
                    resizeMode={'stretch'}
                    style={groupListStyles.metaIcon}
                  />
                  <Text style={groupListStyles.metaText}>
                    {item.participants}
                  </Text>
                </View>
                <Text style={groupListStyles.metaText}>{item.time}</Text>
              </View>
            </View>
            {item.image && (
              <Image
                source={{uri: item.image}}
                resizeMode={'stretch'}
                style={groupListStyles.itemImage}
              />
            )}
          </View>
        </View>
        <View style={commonStyles.divider} />
      </TouchableOpacity>
    );
  } else {
    // 이미지가 없는 레이아웃
    return (
      <TouchableOpacity onPress={() => onPress(item.id)} activeOpacity={0.7}>
        <View style={groupListStyles.itemContainerNoImage}>
          <View style={groupListStyles.itemHeader}>
            <View
              style={[
                groupListStyles.categoryBadge,
                {backgroundColor: item.categoryColor},
              ]}>
              <Text
                style={[
                  groupListStyles.categoryText,
                  {color: item.categoryTextColor},
                ]}>
                {item.category}
              </Text>
            </View>
            <View style={groupListStyles.likesContainer}>
              <Image
                source={{
                  uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/kmv9hhz2_expires_30_days.png',
                }}
                resizeMode={'stretch'}
                style={groupListStyles.likeIcon}
              />
              <Text style={groupListStyles.likesText}>{item.likes}</Text>
            </View>
          </View>
          <View style={groupListStyles.itemContentNoImage}>
            <Text style={groupListStyles.title}>{item.title}</Text>
            <Text style={groupListStyles.description}>{item.description}</Text>
            <View style={groupListStyles.metaContainer}>
              <View style={groupListStyles.metaItem}>
                <Image
                  source={{
                    uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/dt299qz0_expires_30_days.png',
                  }}
                  resizeMode={'stretch'}
                  style={groupListStyles.metaIcon}
                />
                <Text style={groupListStyles.metaText}>{item.comments}</Text>
              </View>
              <View style={groupListStyles.metaItem}>
                <Image
                  source={{
                    uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/428irf7x_expires_30_days.png',
                  }}
                  resizeMode={'stretch'}
                  style={groupListStyles.metaIcon}
                />
                <Text style={groupListStyles.metaText}>
                  {item.participants}
                </Text>
              </View>
              <Text style={groupListStyles.metaText}>{item.time}</Text>
            </View>
          </View>
        </View>
        <View style={commonStyles.divider} />
      </TouchableOpacity>
    );
  }
};
