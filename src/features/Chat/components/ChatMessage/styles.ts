import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    marginLeft: 19,
    marginRight: 19,
  },
  myContainer: {
    justifyContent: 'flex-end',
  },
  otherContainer: {
    justifyContent: 'flex-start',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 8,
  },
  contentContainer: {
    alignItems: 'flex-start',
    marginRight: 8,
    maxWidth: '70%',
  },
  myContentContainer: {
    alignItems: 'flex-end',
    marginLeft: 8,
    marginRight: 0,
  },
  senderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  senderName: {
    color: '#303030',
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 5,
  },
  hostIcon: {
    width: 16,
    height: 16,
  },
  bubble: {
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    paddingVertical: 11,
    paddingHorizontal: 14,
    minWidth: 80,
  },
  myBubble: {
    backgroundColor: '#1CBFDC',
  },
  messageText: {
    color: '#303030',
    fontSize: 14,
  },
  myMessageText: {
    color: '#FFFFFF',
  },
  timestampContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    marginTop: 4,
  },
  myTimestampContainer: {
    marginRight: 8,
    paddingRight: 0,
    marginLeft: 3,
  },
  timestamp: {
    color: '#303030',
    fontSize: 10,
    marginRight: 6,
  },
  readCount: {
    color: '#9DA2AF',
    fontSize: 10,
  },
});
