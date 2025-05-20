import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 3,
    marginLeft: 20,
    marginTop: 19,
  },
  activeTab: {
    color: '#303030',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 1,
  },
  inactiveTab: {
    color: '#D2D5DB',
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabButton: {
    alignItems: 'center',
    marginRight: 19,
  },
  indicator: {
    width: 48,
    height: 2,
    backgroundColor: '#394050',
    marginTop: 5,
    borderRadius: 10,
  },
});
