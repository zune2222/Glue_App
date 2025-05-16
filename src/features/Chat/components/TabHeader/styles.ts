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
    marginRight: 19,
  },
  inactiveTab: {
    color: '#D2D5DB',
    fontSize: 20,
    fontWeight: 'bold',
  },
  indicator: {
    width: 52,
    height: 1,
    marginBottom: 22,
  },
});
