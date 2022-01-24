// flow-typed signature: 6bc7d0348ecf36bcc0e75e7b5bb185a8
// flow-typed version: c9eab29316/app-root-path_v3.x.x/flow_>=v0.142.x

declare module 'app-root-path' {
  declare type RootPath = string & {|
    /**
     * Application root directory absolute path
     */
    path: string,
    /**
     * Resolves relative path from root to absolute path
     */
    resolve(pathToModule: string): string,
    /**
     * Resolve module by relative addressing from root
     */
    require(pathToModule: string): any,
    /**
     * Explicitly set root path
     */
    setPath(explicitlySetPath: string): void,
    toString(): string,
  |};

  declare module.exports: RootPath;
}
