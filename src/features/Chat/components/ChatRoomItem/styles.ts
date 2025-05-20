import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderColor: '#F3F4F6',
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    marginBottom: 8,
    marginHorizontal: 19,
  },
  image: {
    borderRadius: 8,
    width: 62,
    height: 62,
    marginRight: 16,
  },
  infoContainer: {
    alignItems: 'flex-start',
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
    justifyContent: 'space-between',
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  name: {
    color: '#384050',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  dot: {
    width: 3,
    height: 3,
    marginRight: 6,
    backgroundColor: '#384050',
    borderRadius: 1.5,
  },
  memberCount: {
    color: '#384050',
    fontSize: 12,
  },
  timestamp: {
    color: '#9DA2AF',
    fontSize: 12,
    textAlign: 'right',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
  },
  lastMessage: {
    color: '#384050',
    fontSize: 12,
    flex: 1,
    marginRight: 8,
  },
  unreadIndicator: {
    width: 9,
    height: 9,
  },
});
