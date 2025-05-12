import React from 'react';
import Svg, {Path} from 'react-native-svg';

type SearchIconProps = {
  width?: number;
  height?: number;
  color?: string;
};

const SearchIcon = ({
  width = 24,
  height = 25,
  color = '#9DA2AF',
}: SearchIconProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 25" fill="none">
      <Path
        d="M11 19.2568C15.4183 19.2568 19 15.6751 19 11.2568C19 6.83856 15.4183 3.25684 11 3.25684C6.58172 3.25684 3 6.83856 3 11.2568C3 15.6751 6.58172 19.2568 11 19.2568Z"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.9992 21.257L16.6992 16.957"
        stroke={color}
        strokeWidth="2.66667"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default SearchIcon;
