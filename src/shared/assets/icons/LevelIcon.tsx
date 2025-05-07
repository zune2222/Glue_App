import React from 'react';
import Svg, {Circle} from 'react-native-svg';

type LevelIconProps = {
  level: 1 | 2 | 3 | 4 | 5;
  width?: number;
  height?: number;
  activeColor?: string;
  inactiveColor?: string;
};

const LevelIcon = ({
  level,
  width = 52,
  height = 9,
  activeColor = '#384050',
  inactiveColor = '#D2D5DB',
}: LevelIconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 52 9" fill="none">
      <Circle
        cx="4"
        cy="4.25684"
        r="4"
        fill={level >= 1 ? activeColor : inactiveColor}
      />
      <Circle
        cx="15"
        cy="4.25684"
        r="4"
        fill={level >= 2 ? activeColor : inactiveColor}
      />
      <Circle
        cx="26"
        cy="4.25684"
        r="4"
        fill={level >= 3 ? activeColor : inactiveColor}
      />
      <Circle
        cx="37"
        cy="4.25684"
        r="4"
        fill={level >= 4 ? activeColor : inactiveColor}
      />
      <Circle
        cx="48"
        cy="4.25684"
        r="4"
        fill={level >= 5 ? activeColor : inactiveColor}
      />
    </Svg>
  );
};

export default LevelIcon;
