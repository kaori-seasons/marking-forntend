// @ts-nocheck
import {
    createIntl,
    IntlShape,
    MessageDescriptor,
} from '/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/node_modules/react-intl';
import {ApplyPluginsType} from 'umi';
import {event, LANG_CHANGE_EVENT} from './locale';
// @ts-ignore
import warning
    from '/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/node_modules/@umijs/plugin-locale/node_modules/warning/warning.js';

import {plugin} from '../core/plugin';

export {
    createIntl,
};
export {
    FormattedDate,
    FormattedDateParts,
    FormattedDisplayName,
    FormattedHTMLMessage,
    FormattedList,
    FormattedMessage,
    FormattedNumber,
    FormattedNumberParts,
    FormattedPlural,
    FormattedRelativeTime,
    FormattedTime,
    FormattedTimeParts,
    IntlContext,
    IntlProvider,
    RawIntlProvider,
    createIntlCache,
    defineMessages,
    injectIntl,
    useIntl,
} from '/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/node_modules/react-intl';

let g_intl: IntlShape;

const useLocalStorage = true;

import enUS0 from 'antd/es/locale/en_US';
import lang_enUS0 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/locales/en-US.ts";
import lang_enUS1 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/account/settings/locales/en-US.ts";
import lang_enUS2 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/dashboard/analysis/locales/en-US.ts";
import lang_enUS3 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/dashboard/monitor/locales/en-US.ts";
import lang_enUS4 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/editor/flow/locales/en-US.ts";
import lang_enUS5 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/editor/koni/locales/en-US.ts";
import lang_enUS6 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/editor/mind/locales/en-US.ts";
import lang_enUS7 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/exception/500/locales/en-US.ts";
import lang_enUS8 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/form/basic-form/locales/en-US.ts";
import lang_enUS9 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/form/step-form/locales/en-US.ts";
import lang_enUS10 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/result/fail/locales/en-US.ts";
import lang_enUS11 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/result/success/locales/en-US.ts";
import lang_enUS12
    from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/rulemarketing/rulemonitoring/locales/en-US.ts";
import lang_enUS13
    from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/user/register-result/locales/en-US.ts";
import lang_enUS14 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/user/register/locales/en-US.ts";
import idID0 from 'antd/es/locale/id_ID';
import lang_idID0 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/locales/id-ID.ts";
import jaJP0 from 'antd/es/locale/ja_JP';
import lang_jaJP0 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/locales/ja-JP.ts";
import ptBR0 from 'antd/es/locale/pt_BR';
import lang_ptBR0 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/locales/pt-BR.ts";
import lang_ptBR1 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/dashboard/analysis/locales/pt-BR.ts";
import lang_ptBR2 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/dashboard/monitor/locales/pt-BR.ts";
import lang_ptBR3 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/exception/500/locales/pt-BR.ts";
import lang_ptBR4 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/form/basic-form/locales/pt-BR.ts";
import lang_ptBR5 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/form/step-form/locales/pt-BR.ts";
import lang_ptBR6
    from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/rulemarketing/rulemonitoring/locales/pt-BR.ts";
import zhCN0 from 'antd/es/locale/zh_CN';
import lang_zhCN0 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/locales/zh-CN.ts";
import lang_zhCN1 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/account/settings/locales/zh-CN.ts";
import lang_zhCN2 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/dashboard/analysis/locales/zh-CN.ts";
import lang_zhCN3 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/dashboard/monitor/locales/zh-CN.ts";
import lang_zhCN4 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/editor/flow/locales/zh-CN.ts";
import lang_zhCN5 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/editor/koni/locales/zh-CN.ts";
import lang_zhCN6 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/editor/mind/locales/zh-CN.ts";
import lang_zhCN7 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/exception/500/locales/zh-CN.ts";
import lang_zhCN8 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/form/basic-form/locales/zh-CN.ts";
import lang_zhCN9 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/form/step-form/locales/zh-CN.ts";
import lang_zhCN10 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/result/fail/locales/zh-CN.ts";
import lang_zhCN11 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/result/success/locales/zh-CN.ts";
import lang_zhCN12
    from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/rulemarketing/rulemonitoring/locales/zh-CN.ts";
import lang_zhCN13
    from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/user/register-result/locales/zh-CN.ts";
import lang_zhCN14 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/user/register/locales/zh-CN.ts";
import zhTW0 from 'antd/es/locale/zh_TW';
import lang_zhTW0 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/locales/zh-TW.ts";
import lang_zhTW1 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/account/settings/locales/zh-TW.ts";
import lang_zhTW2 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/dashboard/analysis/locales/zh-TW.ts";
import lang_zhTW3 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/dashboard/monitor/locales/zh-TW.ts";
import lang_zhTW4 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/exception/500/locales/zh-TW.ts";
import lang_zhTW5 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/form/basic-form/locales/zh-TW.ts";
import lang_zhTW6 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/form/step-form/locales/zh-TW.ts";
import lang_zhTW7 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/result/fail/locales/zh-TW.ts";
import lang_zhTW8 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/result/success/locales/zh-TW.ts";
import lang_zhTW9
    from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/rulemarketing/rulemonitoring/locales/zh-TW.ts";
import lang_zhTW10
    from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/user/register-result/locales/zh-TW.ts";
import lang_zhTW11 from "/Users/windwheel/Documents/gitrepo/DOIT-WEBAPP/src/pages/user/register/locales/zh-TW.ts";

export const localeInfo: { [key: string]: any } = {
    'en-US': {
        messages: {
            ...lang_enUS0, ...lang_enUS1, ...lang_enUS2, ...lang_enUS3, ...lang_enUS4, ...lang_enUS5, ...lang_enUS6, ...lang_enUS7, ...lang_enUS8, ...lang_enUS9, ...lang_enUS10, ...lang_enUS11, ...lang_enUS12, ...lang_enUS13, ...lang_enUS14,
        },
        locale: 'en-US',
        antd: {
            ...enUS0,
        },
        momentLocale: '',
    },
    'id-ID': {
        messages: {
            ...lang_idID0,
        },
        locale: 'id-ID',
        antd: {
            ...idID0,
        },
        momentLocale: 'id',
    },
    'ja-JP': {
        messages: {
            ...lang_jaJP0,
        },
        locale: 'ja-JP',
        antd: {
            ...jaJP0,
        },
        momentLocale: 'ja',
    },
    'pt-BR': {
        messages: {
            ...lang_ptBR0, ...lang_ptBR1, ...lang_ptBR2, ...lang_ptBR3, ...lang_ptBR4, ...lang_ptBR5, ...lang_ptBR6,
        },
        locale: 'pt-BR',
        antd: {
            ...ptBR0,
        },
        momentLocale: 'pt-br',
    },
    'zh-CN': {
        messages: {
            ...lang_zhCN0, ...lang_zhCN1, ...lang_zhCN2, ...lang_zhCN3, ...lang_zhCN4, ...lang_zhCN5, ...lang_zhCN6, ...lang_zhCN7, ...lang_zhCN8, ...lang_zhCN9, ...lang_zhCN10, ...lang_zhCN11, ...lang_zhCN12, ...lang_zhCN13, ...lang_zhCN14,
        },
        locale: 'zh-CN',
        antd: {
            ...zhCN0,
        },
        momentLocale: 'zh-cn',
    },
    'zh-TW': {
        messages: {
            ...lang_zhTW0, ...lang_zhTW1, ...lang_zhTW2, ...lang_zhTW3, ...lang_zhTW4, ...lang_zhTW5, ...lang_zhTW6, ...lang_zhTW7, ...lang_zhTW8, ...lang_zhTW9, ...lang_zhTW10, ...lang_zhTW11,
        },
        locale: 'zh-TW',
        antd: {
            ...zhTW0,
        },
        momentLocale: 'zh-tw',
    },
};

/**
 * 增加一个新的国际化语言
 * @param name 语言的 key
 * @param messages 对应的枚举对象
 * @param extraLocale momentLocale, antd 国际化
 */
export const addLocale = (
    name: string,
    messages: Object,
    extraLocales: {
        momentLocale: string;
        antd: string
    },
) => {
    if (!name) {
        return;
    }
    // 可以合并
    const mergeMessages = localeInfo[name]?.messages
        ? Object.assign({}, localeInfo[name].messages, messages)
        : messages;


    const {momentLocale, antd} = extraLocales || {};
    const locale = name.split('-')?.join('-')
    localeInfo[name] = {
        messages: mergeMessages,
        locale,
        momentLocale: momentLocale,
        antd,
    };
    // 如果这是的 name 和当前的locale 相同需要重新设置一下，不然更新不了
    if (locale === getLocale()) {
        event.emit(LANG_CHANGE_EVENT, locale);
    }
};

/**
 * 获取当前的 intl 对象，可以在 node 中使用
 * @param locale 需要切换的语言类型
 * @param changeIntl 是否不使用 g_intl
 * @returns IntlShape
 */
export const getIntl = (locale?: string, changeIntl?: boolean) => {
    // 如果全局的 g_intl 存在，且不是 setIntl 调用
    if (g_intl && !changeIntl && !locale) {
        return g_intl;
    }
    // 如果存在于 localeInfo 中
    if (locale && localeInfo[locale]) {
        return createIntl(localeInfo[locale]);
    }
    // 不存在需要一个报错提醒
    warning(
        !locale || !!localeInfo[locale],
        `The current popular language does not exist, please check the locales folder!`,
    );
    // 使用 zh-CN
    if (localeInfo["zh-CN"]) return createIntl(localeInfo["zh-CN"]);

    // 如果还没有，返回一个空的
    return createIntl({
        locale: "zh-CN",
        messages: {},
    });
};

/**
 * 切换全局的 intl 的设置
 * @param locale 语言的key
 */
export const setIntl = (locale: string) => {
    g_intl = getIntl(locale, true);
};

/**
 * 获取当前选择的语言
 * @returns string
 */
export const getLocale = () => {
    const runtimeLocale = plugin.applyPlugins({
        key: 'locale',
        type: ApplyPluginsType.modify,
        initialValue: {},
    });
    // runtime getLocale for user define
    if (typeof runtimeLocale?.getLocale === 'function') {
        return runtimeLocale.getLocale();
    }
    // please clear localStorage if you change the baseSeparator config
    // because changing will break the app
    const lang =
        navigator.cookieEnabled && typeof localStorage !== 'undefined' && useLocalStorage
            ? window.localStorage.getItem('umi_locale')
            : '';
    // support baseNavigator, default true
    let browserLang;
    const isNavigatorLanguageValid =
        typeof navigator !== 'undefined' && typeof navigator.language === 'string';
    browserLang = isNavigatorLanguageValid
        ? navigator.language.split('-').join('-')
        : '';
    return lang || browserLang || "zh-CN";
};


/**
 * 获取当前选择的方向
 * @returns string
 */
export const getDirection = () => {
    const lang = getLocale();
    // array with all prefixs for rtl langueges ex: ar-EG , he-IL
    const rtlLangs = ['he', 'ar', 'fa', 'ku']
    const direction = rtlLangs.filter(lng => lang.startsWith(lng)).length ? 'rtl' : 'ltr';
    return direction;
};

/**
 * 切换语言
 * @param lang 语言的 key
 * @param realReload 是否刷新页面，默认刷新
 * @returns string
 */
export const setLocale = (lang: string, realReload: boolean = true) => {
    const runtimeLocale = plugin.applyPlugins({
        key: 'locale',
        type: ApplyPluginsType.modify,
        initialValue: {},
    });

    const updater = () => {
        if (getLocale() !== lang) {
            if (navigator.cookieEnabled && typeof window.localStorage !== 'undefined' && useLocalStorage) {
                window.localStorage.setItem('umi_locale', lang || '');
            }
            setIntl(lang);
            if (realReload) {
                window.location.reload();
            } else {
                event.emit(LANG_CHANGE_EVENT, lang);
                // chrome 不支持这个事件。所以人肉触发一下
                if (window.dispatchEvent) {
                    const event = new Event('languagechange');
                    window.dispatchEvent(event);
                }
            }
        }
    }

    if (typeof runtimeLocale?.setLocale === 'function') {
        runtimeLocale.setLocale({
            lang,
            realReload,
            updater: updater,
        });
        return;
    }

    updater();
};

let firstWaring = true;

/**
 * intl.formatMessage 的语法糖
 * @deprecated 使用此 api 会造成切换语言的时候无法自动刷新，请使用 useIntl 或 injectIntl
 * @param descriptor { id : string, defaultMessage : string }
 * @param values { [key:string] : string }
 * @returns string
 */
export const formatMessage: IntlShape['formatMessage'] = (
    descriptor: MessageDescriptor,
    values: any,
) => {
    if (firstWaring) {
        warning(
            false,
            `Using this API will cause automatic refresh when switching languages, please use useIntl or injectIntl.

使用此 api 会造成切换语言的时候无法自动刷新，请使用 useIntl 或 injectIntl。

http://j.mp/37Fkd5Q
      `,
        );
        firstWaring = false;
    }
    return g_intl.formatMessage(descriptor, values);
};

/**
 * 获取语言列表
 * @returns string[]
 */
export const getAllLocales = () => Object.keys(localeInfo);
