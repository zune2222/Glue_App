import React from 'react';
import Svg, {Path} from 'react-native-svg';

type PlusIconProps = {
  width?: number;
  height?: number;
  color?: string;
};

const PlusIcon = ({
  width = 24,
  height = 25,
  color = '#F9FAFB',
}: PlusIconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 25" fill="none">
      <Path
        d="M12 5.25684V19.2568"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5 12.2568H19"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default PlusIcon;
