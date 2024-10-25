
type DeepMindLanguage = {
  language: string;
  name: string;
};

type VoiceLanguage = {
  id: string;
  name: string;
};

 const voiceToDeepMindMap: { [key: string]: string } = {
  'af-ZA': 'af',
  'sq-AL': 'sq',
  'am-ET': 'am',
  'ar-AE': 'ar',
  'ar-BH': 'ar',
  'ar-DZ': 'ar',
  'ar-EG': 'ar',
  'ar-IQ': 'ar',
  'ar-JO': 'ar',
  'ar-KW': 'ar',
  'ar-LB': 'ar',
  'ar-LY': 'ar',
  'ar-MA': 'ar',
  'ar-OM': 'ar',
  'ar-QA': 'ar',
  'ar-SA': 'ar',
  'ar-SD': 'ar',
  'ar-SY': 'ar',
  'ar-TN': 'ar',
  'ar-YE': 'ar',
  'hy-AM': 'hy',
  'as-IN': 'as',
  'az-AZ': 'az',
  'eu-ES': 'eu',
  'be-BY': 'be',
  'bn-BD': 'bn',
  'bn-IN': 'bn',
  'bs-BA': 'bs',
  'bg-BG': 'bg',
  'my-MM': 'my',
  'ca-ES': 'ca',
  'ceb-PH': 'ceb',
  'ny-MW': 'ny',
  'zh-CN': 'zh-CN',
  'zh-TW': 'zh-TW',
  'co-FR': 'co',
  'hr-HR': 'hr',
  'cs-CZ': 'cs',
  'da-DK': 'da',
  'nl-NL': 'nl',
  'en-AU': 'en',
  'en-CA': 'en',
  'en-GB': 'en',
  'en-IN': 'en',
  'en-US': 'en',
  'eo': 'eo',
  'et-EE': 'et',
  'fil-PH': 'fil',
  'fi-FI': 'fi',
  'fr-BE': 'fr',
  'fr-FR': 'fr',
  'fy-NL': 'fy',
  'gl-ES': 'gl',
  'ka-GE': 'ka',
  'de-AT': 'de',
  'de-DE': 'de',
  'de-CH': 'de',
  'el-GR': 'el',
  'gn-PY': 'gn',
  'gu-IN': 'gu',
  'ht-HT': 'ht',
  'ha-LATN-NG': 'ha',
  'haw-US': 'haw',
  'he-IL': 'iw',
  'hi-IN': 'hi',
  'hmn': 'hmn',
  'hu-HU': 'hu',
  'is-IS': 'is',
  'ig-NG': 'ig',
  'id-ID': 'id',
  'ga-IE': 'ga',
  'it-IT': 'it',
  'ja-JP': 'ja',
  'jw': 'jv',
  'kn-IN': 'kn',
  'kk-KZ': 'kk',
  'km-KH': 'km',
  'rw-RW': 'rw',
  'ko-KR': 'ko',
  'ku-TR': 'ku',
  'ckb-IQ': 'ckb',
  'ky-KG': 'ky',
  'lo-LA': 'lo',
  'la-LA': 'la',
  'lv-LV': 'lv',
  'lt-LT': 'lt',
  'lb-LU': 'lb',
  'mk-MK': 'mk',
  'mg-MG': 'mg',
  'ms-MY': 'ms',
  'ml-IN': 'ml',
  'mt-MT': 'mt',
  'mi-NZ': 'mi',
  'mr-IN': 'mr',
  'mn-MN': 'mn',
  'ne-NP': 'ne',
  'no-NO': 'no',
  'or-IN': 'or',
  'ps-AF': 'ps',
  'fa-IR': 'fa',
  'pl-PL': 'pl',
  'pt-BR': 'pt',
  'pt-PT': 'pt',
  'pa-IN': 'pa',
  'ro-RO': 'ro',
  'rm-CH': 'rm',
  'ru-RU': 'ru',
  'sm-WS': 'sm',
  'gd-GB': 'gd',
  'sr-RS': 'sr',
  'ser': 'ser',
  'st-ZA': 'st',
  'sn-ZW': 'sn',
  'scn': 'scn',
  'sd-IN': 'sd',
  'si-LK': 'si',
  'sk-SK': 'sk',
  'sl-SI': 'sl',
  'so-SO': 'so',
  'es-AR': 'es',
  'es-CL': 'es',
  'es-CO': 'es',
  'es-MX': 'es',
  'es-ES': 'es',
  'su-ID': 'su',
  'sw-TZ': 'sw',
  'sv-SE': 'sv',
  'tg-TJ': 'tg',
  'ber': 'ber',
  'ta-IN': 'ta',
  'tt-RU': 'tt',
  'te-IN': 'te',
  'th-TH': 'th',
  'bo-CN': 'bo',
  'tr-TR': 'tr',
  'tk-TM': 'tk',
  'uk-UA': 'uk',
  'ur-PK': 'ur',
  'ug-CN': 'ug',
  'uz-UZ': 'uz',
  'vi-VN': 'vi',
  'cy-GB': 'cy',
  'wo-SN': 'wo',
  'xh-ZA': 'xh',
  'yi': 'yi',
  'yo-NG': 'yo',
  'zu-ZA': 'zu'
};

export class LanguageUtils {
  private static deepMindLanguages: DeepMindLanguage[];
  private static voiceLanguages: VoiceLanguage[];


  static initialize(deepMindLangs: DeepMindLanguage[], voiceLangs: VoiceLanguage[]) {
    this.deepMindLanguages = deepMindLangs;
    this.voiceLanguages = voiceLangs;
  }

   static getDeepMindCode(voiceCode: string): string | null {
    return voiceToDeepMindMap[voiceCode] || null;
  }

   static getDeepMindCodeByName(languageName: string): string | null {
    const lang = this.deepMindLanguages.find(l =>
      l.name.toLowerCase() === languageName.toLowerCase()
    );
    return lang ? lang.language : null;
  }

   static getVoiceCodeByName(languageName: string): string | null {
    const lang = this.voiceLanguages.find(l =>
      l.name.toLowerCase().includes(languageName.toLowerCase())
    );
    return lang ? lang.id : null;
  }

   static getSupportedVoiceCodes(deepMindCode: string): string[] {
    return Object.entries(voiceToDeepMindMap)
      .filter(([_, dmCode]) => dmCode === deepMindCode)
      .map(([voiceCode]) => voiceCode);
  }

   static isSupported(voiceCode: string): boolean {
    return voiceCode in voiceToDeepMindMap;
  }

   static getDeepMindLanguageName(code: string): string | null {
    const lang = this.deepMindLanguages.find(l => l.language === code);
    return lang ? lang.name : null;
  }

   static getVoiceLanguageName(code: string): string | null {
    const lang = this.voiceLanguages.find(l => l.id === code);
    return lang ? lang.name : null;
  }

   static getSupportedLanguages(): Array<{
    voiceCode: string,
    deepMindCode: string,
    name: string,
    region?: string
  }> {
    return Object.entries(voiceToDeepMindMap)
      .map(([voiceCode, deepMindCode]) => {
        const voiceName = this.getVoiceLanguageName(voiceCode);
        const deepMindName = this.getDeepMindLanguageName(deepMindCode);


        const nameParts = voiceName?.match(/^(.*?)(?:\s*\((.*?)\))?$/);

        return {
          voiceCode,
          deepMindCode,
          name: nameParts?.[1] || deepMindName || '',
          region: nameParts?.[2] || undefined
        };
      })
      .filter(lang => lang.name);
  }

   static getAllDeepMindLanguages(): DeepMindLanguage[] {
    return this.deepMindLanguages;
  }

   static getAllVoiceLanguages(): VoiceLanguage[] {
    return this.voiceLanguages;
  }

   static searchLanguages(query: string): Array<{
    voiceCode?: string,
    deepMindCode: string,
    name: string
  }> {
    const normalizedQuery = query.toLowerCase();

    return this.deepMindLanguages
      .filter(lang => lang.name.toLowerCase().includes(normalizedQuery))
      .map(lang => ({
        deepMindCode: lang.language,
        voiceCode: Object.keys(voiceToDeepMindMap).find(
          vCode => voiceToDeepMindMap[vCode] === lang.language
        ),
        name: lang.name
      }));
  }
}