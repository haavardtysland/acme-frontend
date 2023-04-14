import { registerLocaleData } from '@angular/common';
import { APP_INITIALIZER, Injectable, LOCALE_ID } from '@angular/core';
import { loadTranslations } from '@angular/localize';

@Injectable({
  providedIn: 'root',
})
export class I18n {
  locale = 'en';

  async setLocale() {
    const userLocale = localStorage.getItem('locale');

    if (userLocale) {
      this.locale = userLocale;
    }

    const localeModule = await import(
      `/node_modules/@angular/common/locales/${this.locale}.mjs`
    );

    registerLocaleData(localeModule.default);

    const localeTranslationModule = await import(
      `src/assets/i18n/messages_${this.locale}.json`
    );

    loadTranslations(localeTranslationModule.default.translations);
  }
}

function setLocaleId() {
  return {
    provide: LOCALE_ID,
    useFactory: (i18n: I18n) => () => i18n.locale,
    deps: [I18n],
  };
}

function setLocale() {
  return {
    provide: APP_INITIALIZER,
    useFactory: (i18n: I18n) => () => i18n.setLocale(),
    deps: [I18n],
    multi: true,
  };
}

export const I18nModule = {
  setLocale: setLocale,
  setLocaleId: setLocaleId,
};
