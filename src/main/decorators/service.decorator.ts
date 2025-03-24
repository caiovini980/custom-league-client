import { ServiceAbstract } from '@main/abstracts/service.abstract';
import { ContextService } from '@main/context/context.service';
import { Logger } from '@main/decorators/logger.decorator';
import { BrowserWindowRegisterService } from '@main/integrations/browser-window-register/browser-window-register.service';
import { Window } from '@main/ipc';
import { ClassType } from '@main/typings/generic.typing';
import {
  addClassInConstructor,
  extendsConstructor,
} from '@main/utils/reflect.util';
import { Injectable, ScopeOptions } from '@nestjs/common';
import { BrowserWindow } from 'electron';

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/no-unused-vars
type ServiceClassDecorator<C extends ServiceAbstract> = (
  constructor: ClassType<ServiceAbstract>,
) => any;

const ServiceDecorator = <C extends ServiceAbstract>(
  options?: ScopeOptions,
): ServiceClassDecorator<C> => {
  return (constructor) => {
    Injectable(options)(constructor);
    constructor = extendsConstructor(constructor, Logger);
    addClassInConstructor(
      constructor,
      ContextService,
      BrowserWindowRegisterService,
      {
        class: BrowserWindow,
        inject: Window(),
      },
    );

    return <ClassType<C>>class extends constructor {
      constructor(
        ctx: ContextService,
        browserWindowRegisterService: BrowserWindowRegisterService,
        win: BrowserWindow,
        ...args: any[]
      ) {
        super(...args);
        this.ctx = ctx;
        this.mainWin = win;
        this.browserWindowRegisterService = browserWindowRegisterService;
      }
    };
  };
};

export const Service = ServiceDecorator;
