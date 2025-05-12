import React from 'react';
import {View, Image} from 'react-native';
import {groupDetailStyles} from '../styles/groupDetailStyles';
import {Text} from '../../../../shared/ui/typography/Text';

interface GroupInfoProps {
  capacity: string;
  language: string;
  minForeigners: string;
  meetingDate: string;
}

/**
 * 모임 정보 컴포넌트
 */
const GroupInfo: React.FC<GroupInfoProps> = ({
  capacity,
  language,
  minForeigners,
  meetingDate,
}) => {
  return (
    <View style={groupDetailStyles.infoContainer}>
      <Text
        variant="subtitle1"
        weight="medium"
        style={groupDetailStyles.infoTitle}>
        모임 정보
      </Text>
      <View style={groupDetailStyles.infoItemsContainer}>
        <View style={groupDetailStyles.infoItem}>
          <Image
            source={{
              uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/5z5t42cl_expires_30_days.png',
            }}
            resizeMode={'stretch'}
            style={groupDetailStyles.infoIcon}
          />
          <Text variant="body2" style={groupDetailStyles.infoText}>
            {capacity}
          </Text>
        </View>
        <View style={groupDetailStyles.infoItem}>
          <Image
            source={{
              uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/ss074bbg_expires_30_days.png',
            }}
            resizeMode={'stretch'}
            style={groupDetailStyles.infoIconWide}
          />
          <Text variant="body2" style={groupDetailStyles.infoText}>
            {language}
          </Text>
        </View>
        <View style={groupDetailStyles.infoItem}>
          <Image
            source={{
              uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/byietzeg_expires_30_days.png',
            }}
            resizeMode={'stretch'}
            style={groupDetailStyles.infoIconWide}
          />
          <Text variant="body2" style={groupDetailStyles.infoText}>
            {minForeigners}
          </Text>
        </View>
        <View style={groupDetailStyles.infoItemLast}>
          <Image
            source={{
              uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/fuu5pyvh_expires_30_days.png',
            }}
            resizeMode={'stretch'}
            style={groupDetailStyles.infoIconWide}
          />
          <Text variant="body2" style={groupDetailStyles.infoText}>
            {meetingDate}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default GroupInfo;
