import React from 'react';
import Svg, {Path} from 'react-native-svg';

type CameraIconProps = {
  width?: number;
  height?: number;
  color?: string;
};

const CameraIcon = ({
  width = 40,
  height = 41,
  color = '#6C7180',
}: CameraIconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 40 41" fill="none">
      <Path
        d="M38.3346 31.9235C38.3346 32.8076 37.9834 33.6554 37.3583 34.2805C36.7332 34.9056 35.8854 35.2568 35.0013 35.2568H5.0013C4.11725 35.2568 3.2694 34.9056 2.64428 34.2805C2.01916 33.6554 1.66797 32.8076 1.66797 31.9235V13.5902C1.66797 12.7061 2.01916 11.8583 2.64428 11.2331C3.2694 10.608 4.11725 10.2568 5.0013 10.2568H11.668L15.0013 5.25684H25.0013L28.3346 10.2568H35.0013C35.8854 10.2568 36.7332 10.608 37.3583 11.2331C37.9834 11.8583 38.3346 12.7061 38.3346 13.5902V31.9235Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M19.9987 28.5902C23.6806 28.5902 26.6654 25.6054 26.6654 21.9235C26.6654 18.2416 23.6806 15.2568 19.9987 15.2568C16.3168 15.2568 13.332 18.2416 13.332 21.9235C13.332 25.6054 16.3168 28.5902 19.9987 28.5902Z"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default CameraIcon;
