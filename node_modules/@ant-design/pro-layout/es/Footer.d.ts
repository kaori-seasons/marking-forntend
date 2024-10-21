import type { CSSProperties } from 'react';
import React from 'react';
import type { WithFalse } from './typings';
export declare type FooterProps = {
    links?: WithFalse<{
        key?: string;
        title: React.ReactNode;
        href: string;
        blankTarget?: boolean;
    }[]>;
    copyright?: WithFalse<string>;
    style?: CSSProperties;
    className?: string;
    prefixCls?: string;
};
declare const FooterView: React.FC<FooterProps>;
export default FooterView;
