# GlueApp: 커뮤니티 앱

## 프로젝트 소개

GlueApp은 FSD(Feature-Sliced Design) 구조를 기반으로 하는 React Native 커뮤니티 앱입니다. 이 앱은 로그인, 회원가입, 메시징, 채팅, 게시판, 프로필 등 다양한 기능을 제공합니다.

## 기술 스택

- **React Native**: 크로스 플랫폼 모바일 앱 개발
- **TypeScript**: 타입 안정성 확보
- **React Navigation**: 앱 내 화면 전환 관리
- **React Query**: 서버 상태 관리
- **i18next**: 다국어 지원
- **FSD(Feature-Sliced Design)**: 코드 구조화 방법론
- **RxJS**: 비동기 이벤트 스트림 처리

## 개발 환경 설정

### 필수 요구사항

- Node.js 18 이상
- Yarn 또는 npm
- Xcode (iOS 개발용)
- Android Studio (Android 개발용)
- React Native CLI

### 프로젝트 설정

1. 저장소 클론하기

   ```bash
   git clone https://github.com/your-username/GlueApp.git
   cd GlueApp
   ```

2. 의존성 설치

   ```bash
   npm install
   # 또는
   yarn install
   ```

3. iOS 설정

   ```bash
   cd ios && pod install && cd ..
   ```

4. 앱 실행

   ```bash
   # iOS
   npm run ios
   # 또는
   yarn ios

   # Android
   npm run android
   # 또는
   yarn android
   ```

### TypeScript 및 Babel 설정

프로젝트는 TypeScript와 절대 경로 임포트를 지원하기 위해 특별히 구성되어 있습니다.

#### TypeScript 설정 (tsconfig.json)

```json
{
  "extends": "@react-native/typescript-config/tsconfig.json",
  "compilerOptions": {
    "jsx": "react",
    "esModuleInterop": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

#### Babel 설정 (babel.config.js)

```javascript
module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ios.js', '.android.js', '.js', '.ts', '.tsx', '.json'],
        alias: {
          '@': './src',
        },
      },
    ],
  ],
};
```

### 주요 개발 이슈 해결

#### JSX 관련 오류

타입스크립트에서 JSX를 사용할 때 다음과 같은 오류가 발생할 수 있습니다:

- `Cannot use JSX unless the '--jsx' flag is provided.`

이 문제를 해결하려면 `tsconfig.json`에 다음 설정을 확인하세요:

```json
{
  "compilerOptions": {
    "jsx": "react"
  }
}
```

#### 모듈 임포트 관련 오류

절대 경로 임포트 오류:

- `Cannot find module '@/shared/lib/notifications' or its corresponding type declarations.`

이 문제는 다음 두 파일을 확인하세요:

1. `tsconfig.json`의 경로 매핑 설정
2. `babel.config.js`의 모듈 리졸버 설정

#### `esModuleInterop` 오류

다음과 같은 오류가 발생할 수 있습니다:

- `Module can only be default-imported using the 'esModuleInterop' flag`

`tsconfig.json`에 다음 설정을 추가하세요:

```json
{
  "compilerOptions": {
    "esModuleInterop": true
  }
}
```

## 앱 구조 (FSD)

이 프로젝트는 FSD(Feature-Sliced Design) 구조를 따릅니다. FSD는 다음과 같은 계층으로 구성됩니다:

```
src/
├── app/            # 앱 전역 설정, 스타일, 프로바이더
├── processes/      # 비즈니스 프로세스 (여러 기능에 걸친 로직)
├── pages/          # 페이지 컴포넌트
├── widgets/        # 복합 UI 블록 (여러 피처 결합)
├── features/       # 사용자 상호작용 기능
├── entities/       # 비즈니스 엔티티
└── shared/         # 공유 유틸리티, UI 컴포넌트, API
```

### 각 레이어 설명

1. **app**: 애플리케이션의 진입점, 전역 설정 및 설정입니다.

   - 전역 프로바이더(테마, 국제화, 상태 관리)
   - 앱 스타일, 테마, 라우팅

2. **processes**: 여러 기능과 엔티티에 걸친 비즈니스 프로세스입니다.

   - 인증 프로세스(로그인, 등록, 로그아웃)
   - 복잡한 결제 흐름

3. **pages**: 라우팅 가능한 화면입니다.

   - 로그인 페이지, 홈 페이지, 프로필 페이지
   - 각 페이지는 위젯, 기능 및 엔티티의 조합

4. **widgets**: 여러 엔티티 및 기능을 결합하는 복합 UI 블록입니다.

   - 헤더, 푸터, 사이드바
   - 피드, 게시판, 채팅 창

5. **features**: 사용자 상호작용 및 작업 관련 기능입니다.

   - 게시글 작성, 게시글 수정, 게시글 삭제
   - 메시지 보내기, 좋아요, 댓글 작성

6. **entities**: 비즈니스 엔티티 및 관련 로직입니다.

   - 사용자, 게시물, 댓글, 메시지 등의 모델
   - 각 엔티티에 대한 CRUD 작업

7. **shared**: 기술 유틸리티와 재사용 가능한 요소입니다.
   - UI 키트(버튼, 입력, 카드 등)
   - API 클라이언트, 유틸리티 함수, 알림 서비스

## 중요 개념 및 가이드라인

### 1. 계층 간 의존성 규칙

FSD에서 가장 중요한 규칙은 계층 간 의존성 방향입니다:

```
app → processes → pages → widgets → features → entities → shared
```

- 각 계층은 자신보다 낮은 계층에만 의존할 수 있습니다.
- 낮은 계층은 높은 계층에 의존할 수 없습니다.
- 같은 계층의 다른 슬라이스에 직접 의존할 수 없습니다.

예시:

- ✅ `features`는 `entities`와 `shared`를 가져올 수 있습니다.
- ❌ `entities`는 `features`나 `widgets`를 가져올 수 없습니다.
- ❌ `features/auth`는 `features/profile`을 직접 가져올 수 없습니다.

### 2. 슬라이스 구조

각 슬라이스(기능, 엔티티 등)는 다음 패턴을 따릅니다:

```
feature/
├── ui/          # 컴포넌트
├── model/       # 상태 관리, 비즈니스 로직
├── api/         # API 호출
└── lib/         # 유틸리티, 헬퍼 함수
```

이 분리는 관심사 분리를 유지하는 데 도움이 됩니다:

- `ui`: 컴포넌트 렌더링 및 상호작용
- `model`: 비즈니스 로직 및 상태 관리
- `api`: 외부 서비스와의 통신
- `lib`: 슬라이스별 유틸리티

### 3. 공유 리소스

`shared` 계층은 다음을 포함합니다:

```
shared/
├── api/         # API 클라이언트, 인터셉터
├── config/      # 환경 설정, 상수
├── lib/         # 유틸리티, 훅, 헬퍼
└── ui/          # UI 컴포넌트
```

## 알림 시스템 아키텍처

GlueApp의 알림 시스템은 토스트 알림과 모달 알림을 중심으로 설계되었습니다. 이는 FSD 원칙에 따라 `shared` 레이어에 위치하며 다음과 같은 구조를 가집니다:

### 1. 파일 구조

```
src/shared/
├── lib/
│   └── notifications/
│       ├── index.ts      # 통합 알림 서비스
│       ├── toast.ts      # 토스트 알림 서비스
│       └── modal.ts      # 모달 알림 서비스
└── ui/
    ├── Modal/
    │   └── index.tsx     # 모달 UI 컴포넌트
    └── Toast/
        └── index.tsx     # 토스트 UI 컴포넌트
```

### 2. 아키텍처 설계 원칙

1. **서비스/UI 분리**:

   - `lib/notifications/`: 알림 로직 및 상태 관리 (서비스 계층)
   - `ui/Modal/` 및 `ui/Toast/`: 알림 시각적 표현 (UI 계층)

2. **RxJS를 활용한 상태 관리**:

   - 모달 상태는 `Subject`를 통해 관리되며, 컴포넌트는 이 스트림을 구독
   - 비동기 이벤트 스트림을 통한 느슨한 결합 구현

3. **통합 인터페이스**:
   - `notificationService`가 토스트와 모달 서비스를 통합하여 일관된 API 제공

### 3. 토스트 알림 구현 세부사항

- **타입**: `success`, `error`, `info`, `warning`
- **설정 가능한 옵션**: 표시 시간, 위치, 콜백 함수
- **테마 통합**: 현재 앱 테마에 따라 스타일 자동 조정

### 4. 모달 알림 구현 세부사항

- **타입**: `alert`, `confirm`, `custom`
- **반응형 디자인**: 다양한 화면 크기에 맞게 조정
- **커스텀 콘텐츠**: React 노드를 모달 내부에 주입 가능
- **버튼 스타일 옵션**: `default`, `cancel`, `destructive`

### 5. 알림 서비스 사용 원칙

1. **중앙집중식 접근 방식**:

   - 어디서나 `notificationService`를 import하여 알림 호출 가능
   - 일관된 알림 경험 제공

2. **로깅 연동**:

   - 모든 알림은 자동으로 로그 시스템에 기록됨
   - 디버깅 및 사용자 행동 분석에 유용

3. **i18n 통합**:
   - 알림 텍스트는 언어 키를 통해 국제화 가능
   - 다국어 지원에 최적화된 설계

## 주요 서비스 및 유틸리티

### 환경 설정 관리

환경 설정은 `src/shared/config/env.ts`에서 관리됩니다. 여러 환경(개발, 테스트, 프로덕션)에 대한 설정이 포함되어 있습니다.

```typescript
// 환경 설정 사용 방법
import {config} from '@/shared/config/env';

console.log(config.API_URL); // 현재 환경의 API URL
```

### API 클라이언트

API 클라이언트는 `src/shared/api/client.ts`에서 관리됩니다. Axios 인스턴스가 구성되어 있으며 요청/응답 인터셉터가 포함되어 있습니다.

```typescript
// API 클라이언트 사용 방법
import apiClient from '@/shared/api/client';

const fetchData = async () => {
  const response = await apiClient.get('/endpoint');
  return response.data;
};
```

### 커스텀 훅

API 호출을 위한 커스텀 훅은 `src/shared/lib/api/hooks.ts`에서 제공됩니다.

```typescript
// 커스텀 훅 사용 방법
import {useApiQuery, useApiMutation} from '@/shared/lib/api/hooks';

// 데이터 조회
const {data, isLoading, error} = useApiQuery('posts', () => fetchPosts());

// 데이터 변경
const {mutate, isLoading} = useApiMutation(createPost);
```

### 인증 프로세스

인증 흐름은 `src/processes/auth/model/index.ts`에서 관리됩니다.

```typescript
// 인증 프로세스 사용 방법
import {useAuth} from '@/processes/auth/model';

const {login, logout, register, user, isAuthenticated} = useAuth();

// 로그인
const handleLogin = async () => {
  const success = await login(email, password);
  if (success) {
    // 로그인 성공 처리
  }
};
```

### 알림 서비스

애플리케이션은 토스트 및 모달 알림을 위한 통합 서비스를 제공합니다.

```typescript
// 알림 서비스 사용 방법
import {notificationService} from '@/shared/lib/notifications';

// 토스트 알림
notificationService.showSuccess('작업이 완료되었습니다.');
notificationService.showError('오류가 발생했습니다.');
notificationService.showInfo('참고하세요.');
notificationService.showWarning('주의하세요.');

// 모달 알림
notificationService.modal.alert('제목', '메시지');
notificationService.modal.confirm(
  '제목',
  '정말 삭제하시겠습니까?',
  () => {
    // 확인 시 실행될 코드
  },
  () => {
    // 취소 시 실행될 코드
  },
);
```

### 국제화(i18n)

다국어 지원은 `i18next`를 사용하며 `src/shared/lib/i18n/index.ts`에서 설정됩니다.

```typescript
// i18n 사용 방법
import {useTranslation} from 'react-i18next';

const MyComponent = () => {
  const {t} = useTranslation();

  return <Text>{t('common.ok')}</Text>;
};
```

### 테마

앱은 라이트/다크 모드를 지원하며 `src/app/providers/theme/index.tsx`에서 설정됩니다.

```typescript
// 테마 사용 방법
import {useTheme} from '@/app/providers/theme';

const MyComponent = () => {
  const {theme, toggleTheme} = useTheme();

  return (
    <View style={{backgroundColor: theme.colors.background}}>
      <Text style={{color: theme.colors.text}}>테마 예시</Text>
      <Button title="테마 전환" onPress={toggleTheme} />
    </View>
  );
};
```

## 팀 개발 가이드라인

### 코드 스타일 규칙

1. **컴포넌트 이름 지정**: 파스칼 케이스를 사용하세요 (예: `LoginScreen`, `ProfileCard`).
2. **파일 이름 지정**: 컴포넌트 파일은 파스칼 케이스로, 유틸리티와 훅은 카멜 케이스로 지정하세요.
3. **타입 정의**: 모든 함수, 컴포넌트, 상태에 명시적인 타입을 지정하세요.
4. **주석 작성**: 복잡한 로직이나 컴포넌트에는 JSDoc 형식의 주석을 추가하세요.

### 컴포넌트 개발 규칙

1. **관심사 분리**: UI, 로직, 스타일을 분리하세요.
2. **작은 컴포넌트**: 컴포넌트를 작고 집중된 책임을 가진 단위로 유지하세요.
3. **중복 제거**: 공통 UI 요소를 `shared/ui`에서 재사용하세요.
4. **컨텍스트 사용**: 전역 상태가 필요한 경우 `app/providers`에 컨텍스트를 추가하세요.

### 새 기능 개발 단계

1. 필요한 엔티티를 `entities/` 레이어에 정의하세요.
2. 사용자 동작을 `features/` 레이어에 구현하세요.
3. 필요한 경우 UI 요소를 `widgets/` 레이어에 조합하세요.
4. 최종 사용자 화면을 `pages/` 레이어에 통합하세요.
5. 여러 기능에 걸친 프로세스는 `processes/` 레이어에 구현하세요.

### 테스트 가이드라인

1. 비즈니스 로직 테스트에 집중하세요.
2. 각 계층과 슬라이스에 대한 별도의 테스트를 작성하세요.
3. UI 컴포넌트를 위한 스냅샷 테스트를 고려하세요.

## 기능별 사용 예시

### 토스트 알림 예시

```typescript
import {toastService} from '@/shared/lib/notifications/toast';

// 기본 사용법
toastService.success('성공!', '작업이 완료되었습니다.');
toastService.error('오류 발생', '작업 중 오류가 발생했습니다.');
toastService.info('알림', '새로운 정보가 있습니다.');
toastService.warning('주의', '이 작업은 되돌릴 수 없습니다.');

// 옵션 추가
toastService.success('성공!', '작업이 완료되었습니다.', {
  duration: 5000, // 5초 동안 표시
  position: 'top', // 상단에 표시
  onPress: () => console.log('토스트 클릭됨'),
});
```

### 모달 알림 예시

```typescript
import {modalService} from '@/shared/lib/notifications/modal';

// 알림 모달
modalService.alert('알림', '중요한 정보를 확인하세요.');

// 확인 모달
modalService.confirm(
  '확인',
  '정말로 이 작업을 수행하시겠습니까?',
  () => console.log('확인 버튼 눌림'),
  () => console.log('취소 버튼 눌림'),
);

// 커스텀 모달
import React from 'react';
import {View, Text, TextInput} from 'react-native';

const customContent = (
  <View>
    <Text>커스텀 콘텐츠</Text>
    <TextInput placeholder="입력하세요" />
  </View>
);

modalService.custom({
  title: '커스텀 모달',
  customContent,
  buttons: [
    {text: '닫기', style: 'cancel'},
    {text: '완료', style: 'default', onPress: () => console.log('완료')},
  ],
});
```

### 테마 사용 예시

```typescript
import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {useTheme} from '@/app/providers/theme';

const ThemeExample = () => {
  const {theme, toggleTheme, themeMode, setThemeMode} = useTheme();

  return (
    <View
      style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.title, {color: theme.colors.text}]}>
        현재 테마: {themeMode}
      </Text>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: theme.colors.primary}]}
        onPress={toggleTheme}>
        <Text style={[styles.buttonText, {color: '#FFFFFF'}]}>테마 전환</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: theme.colors.secondary}]}
        onPress={() => setThemeMode('light')}>
        <Text style={[styles.buttonText, {color: theme.colors.text}]}>
          라이트 모드
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: theme.colors.secondary}]}
        onPress={() => setThemeMode('dark')}>
        <Text style={[styles.buttonText, {color: theme.colors.text}]}>
          다크 모드
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, {backgroundColor: theme.colors.secondary}]}
        onPress={() => setThemeMode('system')}>
        <Text style={[styles.buttonText, {color: theme.colors.text}]}>
          시스템 설정
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 24,
  },
  button: {
    padding: 12,
    borderRadius: 8,
    width: '100%',
    alignItems: 'center',
    marginBottom: 12,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});
```

### API 및 React Query 사용 예시

```typescript
import React from 'react';
import {View, Text, FlatList, ActivityIndicator} from 'react-native';
import {useApiQuery} from '@/shared/lib/api/hooks';
import apiClient from '@/shared/api/client';

// API 호출 함수
const fetchPosts = async () => {
  const response = await apiClient.get('/posts');
  return response.data;
};

// 커스텀 훅
const usePostList = () => {
  return useApiQuery('posts', fetchPosts);
};

// 컴포넌트
const PostListScreen = () => {
  const {data, isLoading, error, refetch} = usePostList();

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return (
      <View>
        <Text>오류가 발생했습니다</Text>
        <Button title="다시 시도" onPress={refetch} />
      </View>
    );
  }

  return (
    <FlatList
      data={data}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => (
        <View>
          <Text>{item.title}</Text>
          <Text>{item.body}</Text>
        </View>
      )}
    />
  );
};
```

## 의존성 및 설치

프로젝트에 필요한 주요 패키지:

```bash
# 핵심 패키지
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context
npm install @tanstack/react-query axios

# 로컬 스토리지 및 보안
npm install @react-native-async-storage/async-storage react-native-keychain

# 네트워크 감지
npm install @react-native-community/netinfo

# 국제화
npm install i18next react-i18next react-native-localize

# 알림
npm install react-native-toast-message react-native-modal rxjs

# 개발 환경 설정
npm install --save-dev babel-plugin-module-resolver
```

## 결론

FSD 기반의 이 프로젝트 구조는 확장성과 유지보수성을 염두에 두고 설계되었습니다. 계층 간 의존성 규칙을 엄격히 지키고, 컴포넌트와 로직을 적절히 분리함으로써 일관되고 관리하기 쉬운 코드베이스를 유지할 수 있습니다.

이 가이드라인을 따라 개발을 진행하면 기능 추가와 유지보수가 용이하며, 다른 개발자들과의 협업도 원활해질 것입니다.

## 알림 컴포넌트 통합 가이드

새 프로젝트에 알림 컴포넌트를 통합하는 방법은 다음과 같습니다:

### 1. 앱에 토스트와 모달 컴포넌트 마운트

`App.tsx` 파일에 `AppModal`과 `AppToast` 컴포넌트를 추가합니다:

```tsx
import React from 'react';
import {AppProvider} from './providers';
import {AppNavigator} from './providers/navigation';
import {AppModal} from '@/shared/ui/Modal';
import {AppToast} from '@/shared/ui/Toast';

export const App = () => {
  return (
    <AppProvider>
      <AppNavigator />
      <AppModal />
      <AppToast />
    </AppProvider>
  );
};
```

### 2. 알림 사용 시 규칙

- **토스트 알림**: 빠른 피드백이나 정보 표시에 사용 (짧은 시간 동안만 표시)
- **모달 알림**: 사용자의 주의를 요구하거나 확인이 필요한 중요한 내용에 사용

### 3. API 응답 처리 시 통합 예시

```tsx
import {notificationService} from '@/shared/lib/notifications';
import {useApiMutation} from '@/shared/lib/api/hooks';

export const useCreatePost = () => {
  return useApiMutation(
    async postData => {
      // API 호출 로직
      return await apiClient.post('/posts', postData);
    },
    {
      onSuccess: () => {
        notificationService.showSuccess('게시글이 성공적으로 작성되었습니다.');
      },
      onError: error => {
        notificationService.showError(error, '게시글 작성에 실패했습니다.');
      },
    },
  );
};
```

### 4. 작업 확인 시 통합 예시

```tsx
import {notificationService} from '@/shared/lib/notifications';

const handleDeletePost = postId => {
  notificationService.modal.confirm(
    '게시글 삭제',
    '정말로 이 게시글을 삭제하시겠습니까?',
    async () => {
      try {
        await deletePost(postId);
        notificationService.showSuccess('게시글이 삭제되었습니다.');
      } catch (error) {
        notificationService.showError(error, '게시글 삭제에 실패했습니다.');
      }
    },
  );
};
```

### 5. 권장 사용 패턴

- **성공 알림**: 작업 완료 후 성공 토스트를 표시합니다.
- **오류 알림**: API 오류 발생 시 오류 토스트를 표시합니다.
- **확인 모달**: 되돌릴 수 없는 작업 전 확인 모달을 표시합니다.
- **커스텀 모달**: 복잡한 입력이 필요한 경우 커스텀 모달을 사용합니다.

이 알림 시스템은 앱 전체에서 일관된 사용자 경험을 제공하기 위해 설계되었습니다. 모든 알림을 중앙에서 관리함으로써 일관성을 유지하고 유지보수를 용이하게 합니다.
