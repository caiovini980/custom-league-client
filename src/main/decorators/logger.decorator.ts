import { LoggerAbstract } from '@main/abstracts/logger.abstract';
import { CommonLogger } from '@main/logger/common-logger.abstract';
import { ClassType } from '@main/typings/generic.typing';
import { addClassInConstructor } from '@main/utils/reflect.util';

type LoggerClassDecorator<C extends LoggerAbstract> = (
  constructor: ClassType<LoggerAbstract>,
) => ClassType<C>;

export const Logger = <C extends LoggerAbstract>(): LoggerClassDecorator<C> => {
  return (constructor) => {
    addClassInConstructor(constructor, CommonLogger);

    return <ClassType<C>>class extends constructor {
      constructor(logger: CommonLogger, ...args: unknown[]) {
        super(...args);
        this.logger = logger;
        this.logger.setContext(constructor.name);
      }
    };
  };
};
