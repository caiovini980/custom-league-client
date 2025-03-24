import { Theme } from '@mui/material'
import { SystemStyleObject } from '@mui/system/styleFunctionSx/styleFunctionSx'

type FuncSx<O> = (p: O) => SystemStyleObject<Theme>

type makeSxObject<T extends string, O> = Record<T, SystemStyleObject<Theme> | FuncSx<O>>

type makeSxFuncWithProps<T extends string, P, O> = (theme: Theme, props: P) => makeSxObject<T, O>

type makeSxFuncWithoutProps<T extends string, O> = (theme: Theme) => makeSxObject<T, O>

type makeSxFuncKeyWithProps<T extends string, P, O> = keyof ReturnType<makeSxFuncWithProps<T, P, O>>

type makeSxFuncKeyWithoutProps<T extends string, O> = keyof ReturnType<makeSxFuncWithoutProps<T, O>>

type makeSxReturnWithProps<T extends string, P, O> = (
  props: P
) => (
  key: makeSxFuncKeyWithProps<T, P, O>,
  owerProps?: O
) => (theme: Theme) => SystemStyleObject<Theme>

type makeSxReturnWithoutProps<T extends string, O> = () => (
  key: makeSxFuncKeyWithoutProps<T, O>,
  owerProps?: O
) => (theme: Theme) => SystemStyleObject<Theme>

export function makeSx<T extends string, O>(
  sx: makeSxFuncWithoutProps<T, O>
): makeSxReturnWithoutProps<T, O>

export function makeSx<T extends string, P, O>(
  sx: makeSxFuncWithProps<T, P, O>
): makeSxReturnWithProps<T, P, O>

export function makeSx<T extends string, P, O>(sx: unknown): unknown {
  return (props?: P) => (key: T, owerProps?: O) => (theme: Theme) => {
    if (props) {
      const f = sx as makeSxFuncWithProps<T, P, O>
      if (typeof f(theme, props)[key] === 'function') {
        if (owerProps === undefined) return throwMakeSxError(key, f.toString())
        return (f(theme, props)[key] as FuncSx<O>)(owerProps)
      }
      return f(theme, props)[key]
    }
    const f = sx as makeSxFuncWithoutProps<T, O>
    if (typeof f(theme)[key] === 'function') {
      if (owerProps === undefined) return throwMakeSxError(key, f.toString())
      return (f(theme)[key] as FuncSx<O>)(owerProps)
    }
    return f(theme)[key]
  }
}

function throwMakeSxError(sxKey: string, fn: string) {
  throw new Error(`Without props in function: ${sxKey} => ${fn}`)
}
