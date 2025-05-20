import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 100,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#9DA2AF',
    textAlign: 'center',
  },
  directMessagesContainer: {
    paddingBottom: 108,
    marginHorizontal: 19,
  },
  directMessageItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 3,
    paddingHorizontal: 1,
    marginBottom: 12,
  },
  profileImage: {
    width: 51,
    height: 51,
    marginRight: 22,
  },
  messageContent: {
    flex: 1,
    marginRight: 2,
  },
  senderName: {
    color: '#384050',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  messagePreview: {
    color: '#384050',
    fontSize: 12,
  },
  messageTimeContainer: {
    alignItems: 'flex-end',
    marginBottom: 10,
  },
  messageTime: {
    color: '#9DA2AF',
    fontSize: 12,
    marginBottom: 14,
  },
  unreadIndicator: {
    width: 9,
    height: 9,
    backgroundColor: '#1DBFDC',
    borderRadius: 100,
  },
});
