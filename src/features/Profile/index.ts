// src/features/Profile/index.ts

// 화면 컴포넌트 직접 re-export
export { default as ProfileMainScreen } from './ui/ProfileMainScreen';
export { default as ProfileEditScreen } from './ui/ProfileEditScreen';
export { MyPageScreen }                   from './ui/MyPageScreen';            // ← 여기 추가
export { MyProfileDetailScreen }          from './ui/MyProfileDetailScreen';
export { GroupHistoryScreen }             from './ui/GroupHistoryScreen';
export { LikedGroupsScreen }              from './ui/LikedGroupsScreen';

// 모델 훅 & 타입도 한 번에
export * from './model/useProfile';
export * from './model/types';