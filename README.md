# GLUE 앱

GLUE는 React Native로 개발된 모바일 앱으로, 사용자들이 손쉽게 연결되고 소통할 수 있는 플랫폼입니다.

## 기술 스택

- React Native
- TypeScript
- React Navigation
- i18next (다국어 지원)
- react-query (데이터 페칭)
- react-native-reanimated (애니메이션)
- react-native-svg (SVG 아이콘)

## 아키텍처

이 프로젝트는 **Feature-Sliced Design(FSD)** 아키텍처 패턴을 따릅니다. 이 아키텍처는 기능 중심의 구조를 제공하여 코드 관리와 확장성을 향상시킵니다.

### 주요 레이어 구조:

```
/src
 ├── app          // 앱 설정, 전역 상태, 프로바이더
 ├── entities     // 비즈니스 엔티티 (데이터 모델)
 ├── features     // 비즈니스 기능 단위
 ├── widgets      // 재사용 가능한 UI 블록
 ├── shared       // 공통 UI, 유틸리티, 훅, 라이브러리
 └── processes    // 복잡한 비즈니스 프로세스
```

## 경로 별칭 (Path Aliases)

코드 가독성과 유지보수성을 향상시키기 위해 다음과 같은 경로 별칭을 사용합니다:

```javascript
// 예시
import {HomeScreen} from '@features/Home';
import {Button} from '@shared/ui';
import {useTheme} from '@app/providers/theme';
```

사용 가능한 별칭:

- `@app/*` - 앱 레이어
- `@features/*` - 기능 레이어
- `@entities/*` - 엔티티 레이어
- `@widgets/*` - 위젯 레이어
- `@shared/*` - 공통 코드
- `@processes/*` - 프로세스 레이어

## 설치 및 실행

### 요구 사항

- Node.js 16.x 이상
- Yarn 1.22.x 이상
- iOS 개발: Xcode 13 이상, CocoaPods
- Android 개발: Android Studio, JDK 11

### 설치

```bash
# 의존성 설치
yarn

# iOS 빌드 준비
cd ios && pod install && cd ..
```

### 실행

```bash
# iOS 실행
yarn ios

# Android 실행
yarn android

# Metro 서버 시작
yarn start
```

### 유용한 스크립트

```bash
# 캐시 초기화하여 Metro 서버 시작
yarn reset

# 모든 캐시 정리 및 재설치
yarn clean:all

# iOS 캐시 정리
yarn clean:ios

# Android 캐시 정리
yarn clean:android
```

## 주요 기능

### 1. 내비게이션

- **스택 내비게이션**: 화면 간 이동
- **탭 내비게이션**: 메인 기능 탐색
- **모달**: 알림 패널 등

특징:

- Safe Area 적용을 통한 반응형 탭바 (노치 및 홈 인디케이터 대응)
- SVG 아이콘 사용으로 고품질 UI 구현

### 2. 인증

- 소셜 로그인 (카카오, 구글, 애플)
- 프로필 설정 (이름, 닉네임, 성별)

### 3. 홈 피드

- 게시글 목록
- 상세 보기
- 글 작성

### 4. 메시징

- 채팅방 목록
- 1:1 채팅

### 5. 프로필

- 사용자 정보 표시
- 프로필 편집

### 6. 국제화 (i18n)

- 한국어/영어 지원
- 시스템 언어 감지

## 개발 가이드라인

### 스타일 규칙

- 컴포넌트를 기능 단위로 구성
- 공통 UI 컴포넌트는 `shared/ui`에 배치
- 상태 관리 로직은 각 기능의 `model` 디렉토리에 배치

### 기능 추가 시

1. 해당 기능에 맞는 레이어 선택 (주로 `features`)
2. 레이어 내 기능별 디렉토리 생성
3. 내부 구조 생성:
   - `ui/` - 컴포넌트
   - `model/` - 상태와 로직
   - `api/` - API 요청
   - `index.ts` - 공개 API

## 트러블슈팅

### Metro 빌드 오류

```bash
yarn reset
```

### iOS 빌드 오류

```bash
yarn clean:ios
```

### Android 빌드 오류

```bash
yarn clean:android
```
