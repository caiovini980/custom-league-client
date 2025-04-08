// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export type ClassType<C, P = any> = new (...args: P[]) => C;
export type AbstractClassType<C> = abstract new (...args: unknown[]) => C;
export type MultiClassType<C> = ClassType<C> | AbstractClassType<C>;
