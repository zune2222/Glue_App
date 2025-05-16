import React from 'react';
import {
  SafeAreaView,
  View,
  ScrollView,
  Image,
  Text,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');
const LEFT_PADDING = width * 0.1; // 왼쪽 10% 만큼 패딩 추가

interface ChatRoomInfoProps {
  roomName: string;
  roomIcon?: string;
  memberCount: number;
  members: Array<{
    id: string;
    name: string;
    profileImage: string;
    isHost?: boolean;
    isOnline?: boolean;
  }>;
  onClose?: () => void;
  onLeaveRoom: () => void;
}

const DEFAULT_ROOM_ICON =
  'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/g0egrre1_expires_30_days.png';

const ChatRoomInfo: React.FC<ChatRoomInfoProps> = ({
  roomName,
  roomIcon,
  memberCount,
  members,
  onClose: _onClose,
  onLeaveRoom,
}) => {
  const handleLeaveRoom = () => {
    Alert.alert(
      '모임톡 나가기',
      '정말로 이 모임톡방을 나가시겠습니까?',
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '나가기',
          onPress: onLeaveRoom,
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: '#FFFFFF',
      }}>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: '#FFFFFF',
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: 70,
            marginBottom: 15,
            marginLeft: 25 + LEFT_PADDING, // 왼쪽 패딩 추가
          }}>
          <Image
            source={{uri: roomIcon || DEFAULT_ROOM_ICON}}
            resizeMode={'stretch'}
            style={{
              width: 62,
              height: 62,
              marginRight: 17,
            }}
          />
          <Text
            style={{
              color: '#303030',
              fontSize: 16,
              fontWeight: 'bold',
            }}>
            {roomName}
          </Text>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: '#D2D5DB',
            marginBottom: 17,
            marginHorizontal: 25,
            marginLeft: 25 + LEFT_PADDING, // 왼쪽 패딩 추가
            marginRight: 25,
          }}></View>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 18,
            marginHorizontal: 25,
            marginLeft: 25 + LEFT_PADDING, // 왼쪽 패딩 추가
            marginRight: 25,
          }}>
          <Image
            source={{
              uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/5km9sg0f_expires_30_days.png',
            }}
            resizeMode={'stretch'}
            style={{
              width: 24,
              height: 24,
              marginRight: 14,
            }}
          />
          <Text
            style={{
              color: '#303030',
              fontSize: 14,
              flex: 1,
            }}>
            {'모임톡 알림'}
          </Text>
          <View
            style={{
              backgroundColor: '#1CBFDC',
              borderRadius: 999,
              paddingVertical: 2,
              paddingLeft: 21,
              paddingRight: 3,
            }}>
            <Image
              source={{
                uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/z9x3jhes_expires_30_days.png',
              }}
              resizeMode={'stretch'}
              style={{
                width: 20,
                height: 20,
              }}
            />
          </View>
        </View>
        <View
          style={{
            height: 1,
            backgroundColor: '#D2D5DB',
            marginBottom: 17,
            marginHorizontal: 25,
            marginLeft: 25 + LEFT_PADDING, // 왼쪽 패딩 추가
            marginRight: 25,
          }}></View>
        <Text
          style={{
            color: '#303030',
            fontSize: 16,
            fontWeight: 'bold',
            marginBottom: 20,
            marginLeft: 27 + LEFT_PADDING, // 왼쪽 패딩 추가
          }}>
          {`모임 참여자 ${memberCount}`}
        </Text>
        <View
          style={{
            alignItems: 'flex-start',
            marginBottom: 68,
            marginHorizontal: 25,
            marginLeft: 25 + LEFT_PADDING, // 왼쪽 패딩 추가
            marginRight: 25,
          }}>
          {members.map(member => (
            <View
              key={member.id}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingRight: 4,
                  marginRight: 4,
                }}>
                <Image
                  source={{uri: member.profileImage}}
                  resizeMode={'stretch'}
                  style={{
                    width: 44,
                    height: 44,
                    marginRight: 15,
                  }}
                />
                <Text
                  style={{
                    color: '#303030',
                    fontSize: 14,
                    fontWeight: 'bold',
                  }}>
                  {member.name}
                </Text>
              </View>
              {member.isHost && (
                <Image
                  source={{
                    uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/errvmxs9_expires_30_days.png',
                  }}
                  resizeMode={'stretch'}
                  style={{
                    width: 14,
                    height: 14,
                  }}
                />
              )}
              {member.isOnline && (
                <Image
                  source={{
                    uri: 'https://storage.googleapis.com/tagjs-prod.appspot.com/v1/ClJObT75BN/hmd54r24_expires_30_days.png',
                  }}
                  resizeMode={'stretch'}
                  style={{
                    width: 13,
                    height: 13,
                  }}
                />
              )}
            </View>
          ))}
        </View>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            paddingVertical: 15,
            backgroundColor: '#FFFFFF',
            borderWidth: 1,
            borderColor: '#E5E5EA',
            borderRadius: 8,
            marginHorizontal: 25,
            marginLeft: 25 + LEFT_PADDING, // 왼쪽 패딩 추가
            marginRight: 25,
            marginBottom: 30,
          }}
          onPress={handleLeaveRoom}>
          <Text
            style={{
              fontSize: 16,
              fontWeight: '500',
              color: '#333',
            }}>
            {'모임톡 나가기'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ChatRoomInfo;
