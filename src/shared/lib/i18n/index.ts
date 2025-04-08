import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as RNLocalize from 'react-native-localize';
import {logger} from '@shared/lib/logger';

// 번역 파일 가져오기
import ko from './translations/ko.json';
import en from './translations/en.json';

// 사용 가능한 언어 목록
export enum Language {
  KOREAN = 'ko',
  ENGLISH = 'en',
}

export const LANGUAGE_NAMES = {
  [Language.KOREAN]: '한국어',
  [Language.ENGLISH]: 'English',
};

// 번역 리소스
const resources = {
  [Language.KOREAN]: {translation: ko},
  [Language.ENGLISH]: {translation: en},
};

// 언어 감지기
const LANGUAGE_DETECTOR = {
  type: 'languageDetector',
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      // 1. 사용자 저장 언어 확인
      const savedLanguage = await AsyncStorage.getItem('user-language');
      if (
        savedLanguage &&
        Object.values(Language).includes(savedLanguage as Language)
      ) {
        logger.debug(`언어 감지: 저장된 언어 사용 (${savedLanguage})`);
        return callback(savedLanguage);
      }

      // 2. 기기 언어 확인
      const locales = RNLocalize.getLocales();
      if (locales.length > 0) {
        const deviceLanguage = locales[0].languageCode;
        const supportedLanguage = Object.values(Language).includes(
          deviceLanguage as Language,
        )
          ? deviceLanguage
          : Language.KOREAN; // 기본 언어

        logger.debug(`언어 감지: 기기 언어 사용 (${supportedLanguage})`);
        return callback(supportedLanguage);
      }

      // 3. 기본 언어 사용
      logger.debug(`언어 감지: 기본 언어 사용 (${Language.KOREAN})`);
      return callback(Language.KOREAN);
    } catch (error) {
      logger.error('언어 감지 오류', error);
      return callback(Language.KOREAN);
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem('user-language', language);
      logger.debug(`언어 캐시: ${language}`);
    } catch (error) {
      logger.error('언어 캐시 저장 오류', error);
    }
  },
};

// i18n 초기화
i18n
  .use(LANGUAGE_DETECTOR as any)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: Language.KOREAN,
    interpolation: {
      escapeValue: false, // React에서는 이스케이프 처리 안 함
    },
    compatibilityJSON: 'v3',
  });

// 언어 변경 함수
export const changeLanguage = async (language: Language) => {
  try {
    await i18n.changeLanguage(language);
    logger.info(`언어 변경됨: ${language}`);
    return true;
  } catch (error) {
    logger.error('언어 변경 오류', error);
    return false;
  }
};

export default i18n;
