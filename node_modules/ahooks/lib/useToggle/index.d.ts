declare type IState = string | number | boolean | undefined;
export interface Actions<T = IState> {
    setLeft: () => void;
    setRight: () => void;
    toggle: (value?: T) => void;
}
declare function useToggle<T = boolean | undefined>(): [boolean, Actions<T>];
declare function useToggle<T = IState>(defaultValue: T): [T, Actions<T>];
declare function useToggle<T = IState, U = IState>(defaultValue: T, reverseValue: U): [T | U, Actions<T | U>];
export default useToggle;
