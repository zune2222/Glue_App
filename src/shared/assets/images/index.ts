// 필요한 이미지들을 여기에서 내보냅니다.
// 실제 프로젝트에서는 이미지 파일들을 추가하고 적절히 내보내야 합니다.

// SVG 컴포넌트들
export {default as AppleSvg} from './social/appleLogo.svg';
export {default as GoogleSvg} from './social/googleLogo.svg';
export {default as KakaoSvg} from './social/kakaoLogo.svg';

// 이미지 파일들
export const logo = require('./logo.png');
export const welcomeBackground = require('./welcome-bg.jpg');

// 소셜 로그인 아이콘 (PNG 대체용)
export const socialIcons = {
  google: require('./social/google.png'),
  apple: require('./social/apple.png'),
  kakao: require('./social/kakao.png'),
};
