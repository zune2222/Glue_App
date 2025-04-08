module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@app': './src/app',
          '@features': './src/features',
          '@entities': './src/entities',
          '@widgets': './src/widgets',
          '@shared': './src/shared',
          '@processes': './src/processes',
          '@': './src',
        },
      },
    ],
  ],
};
