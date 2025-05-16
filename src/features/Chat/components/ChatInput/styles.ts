import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 14,
    color: '#303030',
    minHeight: 40,
    maxHeight: 120,
  },
  sendButton: {
    marginLeft: 8,
    padding: 8,
  },
  sendIcon: {
    width: 24,
    height: 24,
  },
  disabled: {
    opacity: 0.5,
  },
});
