import { Theme } from '@mui/material';
import { SystemStyleObject } from '@mui/system/styleFunctionSx/styleFunctionSx';

type FuncSx<O> = (p: O) => SystemStyleObject<Theme>;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type makeSxObject<T extends string, O = any> = Record<
  T,
  SystemStyleObject<Theme> | FuncSx<O>
>;

type makeSxFuncWithProps<T extends string, P> = (
  theme: Theme,
  props: P,
) => makeSxObject<T>;

type makeSxFuncWithoutProps<T extends string> = (
  theme: Theme,
) => makeSxObject<T>;

type makeSxFuncKeyWithProps<T extends string, P> = keyof ReturnType<
  makeSxFuncWithProps<T, P>
>;

type makeSxFuncKeyWithoutProps<T extends string> = keyof ReturnType<
  makeSxFuncWithoutProps<T>
>;

type makeSxReturnWithProps<T extends string, P> = (
  props: P,
) => <O>(
  key: makeSxFuncKeyWithProps<T, P>,
  owerProps?: O,
) => (theme: Theme) => SystemStyleObject<Theme>;

type makeSxReturnWithoutProps<T extends string> = () => <O>(
  key: makeSxFuncKeyWithoutProps<T>,
  owerProps?: O,
) => (theme: Theme) => SystemStyleObject<Theme>;

export function makeSx<T extends string>(
  sx: makeSxFuncWithoutProps<T>,
): makeSxReturnWithoutProps<T>;

export function makeSx<T extends string, P>(
  sx: makeSxFuncWithProps<T, P>,
): makeSxReturnWithProps<T, P>;

export function makeSx<T extends string, P>(sx: unknown): unknown {
  return (props?: P) =>
    <O>(key: T, owerProps?: O) =>
    (theme: Theme) => {
      if (props) {
        const f = sx as makeSxFuncWithProps<T, P>;
        if (typeof f(theme, props)[key] === 'function') {
          if (owerProps === undefined)
            return throwMakeSxError(key, f.toString());
          return (f(theme, props)[key] as FuncSx<O>)(owerProps);
        }
        return f(theme, props)[key];
      }
      const f = sx as makeSxFuncWithoutProps<T>;
      if (typeof f(theme)[key] === 'function') {
        if (owerProps === undefined) return throwMakeSxError(key, f.toString());
        return (f(theme)[key] as FuncSx<O>)(owerProps);
      }
      return f(theme)[key];
    };
}

function throwMakeSxError(sxKey: string, fn: string) {
  throw new Error(`Without props in function: ${sxKey} => ${fn}`);
}
