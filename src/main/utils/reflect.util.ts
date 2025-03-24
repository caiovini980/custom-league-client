import { ClassType, MultiClassType } from '@main/typings/generic.typing'
import { Inject } from '@nestjs/common/decorators/core/inject.decorator'

const DESIGN_PARAMTYPES = 'design:paramtypes'
const SELF_PARAMTYPES = 'self:paramtypes'

interface SelfParamTypes {
  index: number
  param: string
}

type ClassToAdd =
  | MultiClassType<unknown>
  | { class: MultiClassType<unknown>; inject: ReturnType<typeof Inject> }

export const addClassInConstructor = (
  targetClass: MultiClassType<unknown>,
  ...classToAdd: ClassToAdd[]
) => {
  const previousDesignMetadata: MultiClassType<unknown>[] =
    Reflect.getMetadata(DESIGN_PARAMTYPES, targetClass) ?? []
  const previousSelfMetadata: SelfParamTypes[] =
    Reflect.getMetadata(SELF_PARAMTYPES, targetClass) ?? []

  previousSelfMetadata.forEach((d) => {
    d.index = classToAdd.length + d.index
  })

  classToAdd.reverse().forEach((c, i) => {
    if ('class' in c) {
      const Anno = c.inject
      class FakeClass {
        // @ts-ignore
        constructor(@Anno fake: unknown) {
          // fake
        }
      }
      previousDesignMetadata.unshift(c.class)
      previousSelfMetadata.push({
        index: classToAdd.length - (i + 1),
        param: Reflect.getMetadata(SELF_PARAMTYPES, FakeClass)[0].param
      })
    } else {
      previousDesignMetadata.unshift(c)
    }
  })

  //console.log(`${targetClass.name}:design`, previousDesignMetadata)
  //console.log(`${targetClass.name}:self`, previousSelfMetadata)
  //console.log('')

  Reflect.defineMetadata(DESIGN_PARAMTYPES, previousDesignMetadata, targetClass)
  Reflect.defineMetadata(SELF_PARAMTYPES, previousSelfMetadata, targetClass)
}

type ExtendConstructor<T> = () => (constructor: ClassType<any>) => ClassType<T>

export const extendsConstructor = <T>(
  targetConstructor: ClassType<T>,
  ...clazz: ExtendConstructor<any>[]
): ClassType<T> => {
  return clazz.reduce((target, classToExtend) => {
    const newClass = classToExtend()(target)
    Object.defineProperty(newClass, 'name', {
      value: target.name,
      writable: false
    })
    return newClass
  }, targetConstructor)
}
