// flow-typed signature: 089e9076007074011e0be31287fe2488
// flow-typed version: 6eda30e263/deepmerge_v4.x.x/flow_>=v0.201.x

declare module 'deepmerge' {
  declare type Options = {
    clone?: boolean,
    arrayMerge?: (destination: any[], source: any[], options?: Options) => Array<any>,
    isMergeableObject?: (value: { ... }) => boolean,
    customMerge?: (key: string, options?: Options) => ((x: any, y: any) => any) | void,
    ...
  }

  declare module.exports: {
    <A, B>(a: A, b: B, options?: Options): A & B,
    all<T>(objects: Array<Partial<T>>, options?: Options): T,
    ...
  };
}
