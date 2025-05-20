import React from 'react';
import {View, Image} from 'react-native';
import {groupDetailStyles} from '../styles/groupDetailStyles';
import {Text} from '../../../../shared/ui/typography/Text';
import {Calendar, Exchange, Global, Users} from '@shared/assets/images';

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
          <Users style={groupDetailStyles.infoIcon} />
          <Text variant="body2" style={groupDetailStyles.infoText}>
            {capacity}
          </Text>
        </View>
        <View style={groupDetailStyles.infoItem}>
          <Global style={groupDetailStyles.infoIconWide} />
          <Text variant="body2" style={groupDetailStyles.infoText}>
            {language}
          </Text>
        </View>
        <View style={groupDetailStyles.infoItem}>
          <Exchange style={groupDetailStyles.infoIconWide} />
          <Text variant="body2" style={groupDetailStyles.infoText}>
            {minForeigners}
          </Text>
        </View>
        <View style={groupDetailStyles.infoItemLast}>
          <Calendar style={groupDetailStyles.infoIconWide} />
          <Text variant="body2" style={groupDetailStyles.infoText}>
            {meetingDate}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default GroupInfo;
