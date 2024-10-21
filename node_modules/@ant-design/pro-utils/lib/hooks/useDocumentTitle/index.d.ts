declare function useDocumentTitle(titleInfo: {
    title: string;
    id: string;
    pageName: string;
}, appDefaultTitle: string | false): void;
export default useDocumentTitle;
