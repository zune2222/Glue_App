import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 100,
  },
  overlayTouchable: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  sidePanel: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: width * 1, // 화면 너비의 80%로 조금 늘림
    height: '100%',
    backgroundColor: '#FFFFFF',
    zIndex: 101,
    shadowColor: '#000',
    shadowOffset: {
      width: -2,
      height: 0,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },
});
