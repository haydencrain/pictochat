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
  private map: ObservableMap<number, T>;

  constructor(map: ObservableMap<number, T>) {
    this.map = map;
  }

  has(key: any): boolean {
    return this.map.has(parseInt(key));
  }

  set(key: any, value: T): this {
    this.map.set(parseInt(key), value);
    return this;
  }

  delete(key: any): boolean {
    return this.map.delete(parseInt(key));
  }

  get(key: any): T | undefined {
    return this.map.get(parseInt(key));
  }

  clear() {
    this.map.clear();
  }

  replace(values: any) {
    return this.map.replace(values);
  }

  keys(): IterableIterator<number> {
    return this.map.keys();
  }

  values(): IterableIterator<T> {
    return this.map.values();
  }

  entries(): any {
    return this.map.entries();
  }
}
