import React from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {styles} from './styles';

interface EmptyChatScreenProps {
  onExplorePress: () => void;
}

const EmptyChatScreen: React.FC<EmptyChatScreenProps> = ({onExplorePress}) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabContainer}>
        <Text style={styles.activeTab}>모임톡</Text>
        <Text style={styles.inactiveTab}>쪽지</Text>
      </View>

      <View style={styles.indicatorContainer}>
        <Image
          source={{
            uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/x0o26hjs_expires_30_days.png',
          }}
          resizeMode="stretch"
          style={styles.tabIndicator}
        />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Image
              source={{
                uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/y0az5lef_expires_30_days.png',
              }}
              resizeMode="contain"
              style={styles.emptyIcon}
            />
          </View>

          <Text style={styles.emptyText}>참여하고 있는 모임톡이 없습니다.</Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              onPress={onExplorePress}
              activeOpacity={0.8}>
              <Text style={styles.buttonText}>모임 둘러보기</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EmptyChatScreen;
