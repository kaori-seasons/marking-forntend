declare type Dispatch<A> = (value: A) => void;
declare function useMountMergeState<S>(initialState: S | (() => S), option?: {
    defaultValue?: S;
    value?: S;
    onChange?: (value: S, prevValue: S) => void;
    postState?: (value: S) => S;
}): [S, Dispatch<S>];
export default useMountMergeState;
