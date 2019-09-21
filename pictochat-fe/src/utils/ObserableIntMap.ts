import { ObservableMap } from 'mobx';

export default class ObservableIntMap<V = any> {
  private map: ObservableMap<number, V>;

  constructor(map: ObservableMap<number, V>) {
    this.map = map;
  }

  has(key: any): boolean {
    return this.map.has(parseInt(key));
  }

  set(key: any, value: V): this {
    this.map.set(parseInt(key), value);
    return this;
  }

  delete(key: any): boolean {
    return this.map.delete(parseInt(key));
  }

  get(key: any): V | undefined {
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

  values(): IterableIterator<V> {
    return this.map.values();
  }

  entries(): any {
    return this.map.entries();
  }
}
