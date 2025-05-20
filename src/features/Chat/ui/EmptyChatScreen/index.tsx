import React from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import {styles} from './styles';
import TabHeader from '../../components/TabHeader';
import {Chat} from '@shared/assets/images';
interface EmptyChatScreenProps {
  onExplorePress: () => void;
}

const EmptyChatScreen: React.FC<EmptyChatScreenProps> = ({onExplorePress}) => {
  const {t} = useTranslation();

  return (
    <SafeAreaView style={styles.container}>
      <TabHeader activeTab="chat" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Chat style={styles.emptyIcon} />
          </View>

          <Text style={styles.emptyText}>{t('messages.noGroupChats')}</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={onExplorePress}
              activeOpacity={0.8}>
              <Text style={styles.buttonText}>
                {t('messages.browseGroups')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmptyChatScreen;
