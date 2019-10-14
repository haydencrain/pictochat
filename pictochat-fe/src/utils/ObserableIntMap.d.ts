import { ObservableMap } from 'mobx';
interface IObservableIntMap<T> {
    has(key: any): boolean;
    set(key: any, value: T): this;
    delete(key: any): boolean;
    get(key: any): T | undefined;
    clear(): void;
    replace(values: any): void;
    keys(): IterableIterator<number>;
    values(): IterableIterator<T>;
    entries(): any;
}
export default class ObservableIntMap<T = any> implements IObservableIntMap<T> {
    private map;
    constructor(map: ObservableMap<number, T>);
    has(key: any): boolean;
    set(key: any, value: T): this;
    delete(key: any): boolean;
    get(key: any): T | undefined;
    clear(): void;
    replace(values: any): ObservableMap<number, T>;
    keys(): IterableIterator<number>;
    values(): IterableIterator<T>;
    entries(): any;
}
export {};
