import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 19,
  },
  activeTab: {
    color: '#303030',
    fontSize: 20,
    fontWeight: 'bold',
    marginRight: 22,
  },
  inactiveTab: {
    color: '#D2D5DB',
    fontSize: 20,
    fontWeight: 'bold',
  },
  indicatorContainer: {
    paddingHorizontal: 20,
    marginBottom: 40,
  },
  tabIndicator: {
    width: 52,
    height: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 80,
  },
  emptyIconContainer: {
    marginBottom: 16,
  },
  emptyIcon: {
    width: 24,
    height: 24,
  },
  emptyText: {
    color: '#6C7180',
    fontSize: 14,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    marginBottom: 40,
  },
  button: {
    backgroundColor: '#1CBFDC',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 28,
  },
  buttonText: {
    color: '#F9FAFB',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 35,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F2',
    shadowColor: '#000000',
    shadowOpacity: 0.1,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowRadius: 10,
    elevation: 10,
  },
  footerTabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  footerTabContainer: {
    alignItems: 'center',
  },
  footerTabIcon: {
    width: 24,
    height: 24,
    marginBottom: 5,
  },
  footerTabText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  inactiveFooterTabText: {
    color: '#9DA2AF',
  },
  activeFooterTabText: {
    color: '#1CBFDC',
  },
});
