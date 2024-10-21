interface ResponsiveConfig {
    [key: string]: number;
}
interface ResponsiveInfo {
    [key: string]: boolean;
}
export declare function configResponsive(config: ResponsiveConfig): void;
export declare function useResponsive(): ResponsiveInfo;
export {};
