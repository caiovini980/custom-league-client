export type Undefined<T> = T | undefined;
export type Null<T> = T | null;
export type NullOrUndefined<T> = T | null | undefined;
export type KebabToCamelCase<S extends string> =
  S extends `${infer Head}-${infer Tail}`
    ? `${Head}${Capitalize<KebabToCamelCase<Tail>>}`
    : S;
