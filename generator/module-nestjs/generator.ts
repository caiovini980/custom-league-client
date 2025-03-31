import * as fs from 'node:fs';
import * as path from 'node:path';
import { join } from 'node:path';
import { checkbox, input } from '@inquirer/prompts';
import { AbstractGenerator, GeneratorOptions } from '../abstract-generator';

type Suffix =
  | 'controller'
  | 'service'
  | 'repository'
  | 'entity'
  | 'module'
  | 'none';
type NameSuffixed = {
  [key in Suffix]: {
    camelCase: string;
    pascalCase: string;
    snakeCase: string;
  };
};

export class Generator extends AbstractGenerator {
  options(): GeneratorOptions {
    return {
      name: 'module-nestjs',
      title: 'Create Module NestJS',
    };
  }

  async generate(): Promise<void> {
    const moduleName = await input({
      message: 'What is module name?',
      required: true,
      validate: (input: string) => {
        const pass = !!input;
        if (pass) return true;
        return 'Enter a name';
      },
    });

    const moduleToCreate = await checkbox({
      message: 'What are the modules?',
      choices: [
        {
          name: 'Controller',
          value: 'controller',
        },
        {
          name: 'Entity',
          value: 'entity',
          description: 'This will generate a repository',
        },
      ],
      required: false,
    });

    this.createFiles(this.replaceSpecialChar(moduleName), moduleToCreate);
  }

  private createFiles(moduleName: string, modulesToCreate: string[]) {
    const moduleRootPath = path.join(
      this.getBackendRootPath(),
      'modules',
      moduleName,
    );

    fs.mkdirSync(moduleRootPath);

    if (modulesToCreate.includes('controller')) {
      this.createController(moduleName, moduleRootPath);
    }

    if (modulesToCreate.includes('entity')) {
      this.createEntity(moduleName, moduleRootPath);
      this.createRepository(moduleName, moduleRootPath);
      this.createServiceRepo(moduleName, moduleRootPath);
    } else {
      this.createService(moduleName, moduleRootPath);
    }

    this.createModule(moduleName, moduleRootPath, modulesToCreate);
  }

  private createService(moduleName: string, moduleRootPath: string) {
    const template = this.getTemplate('service');

    const names = this.getNames(moduleName);
    const file = template.replace(
      /{{service-pascal-case}}/g,
      names.service.pascalCase,
    );

    fs.writeFileSync(
      path.join(moduleRootPath, `${moduleName}.service.ts`),
      file,
      { encoding: 'utf-8' },
    );
  }

  private createServiceRepo(moduleName: string, moduleRootPath: string) {
    const template = this.getTemplate('service-repo');

    const names = this.getNames(moduleName);
    const file = template
      .replace(/{{module-name}}/g, moduleName)
      .replace(/{{service-pascal-case}}/g, names.service.pascalCase)
      .replace(/{{repository-pascal-case}}/g, names.repository.pascalCase);

    fs.writeFileSync(
      path.join(moduleRootPath, `${moduleName}.service.ts`),
      file,
      { encoding: 'utf-8' },
    );
  }

  private createRepository(moduleName: string, moduleRootPath: string) {
    const template = this.getTemplate('repository');

    const names = this.getNames(moduleName);
    const file = template
      .replace(/{{module-name}}/g, moduleName)
      .replace(/{{repository-pascal-case}}/g, names.repository.pascalCase)
      .replace(/{{entity-pascal-case}}/g, names.entity.pascalCase);

    fs.writeFileSync(
      path.join(moduleRootPath, `${moduleName}.repository.ts`),
      file,
      { encoding: 'utf-8' },
    );
  }

  private createModule(
    moduleName: string,
    moduleRootPath: string,
    modulesToCreate: string[],
  ) {
    const template = this.getTemplate('module');
    const names = this.getNames(moduleName);

    const importFiles = [];
    const importModules = [];
    const providerModules = [];
    const controllerModules = [];

    providerModules.push(names.service.pascalCase);
    importFiles.push(
      `import { ${names.service.pascalCase} } from './${moduleName}.service';`,
    );

    if (modulesToCreate.includes('controller')) {
      importFiles.push(
        `import { ${names.controller.pascalCase} } from './${moduleName}.controller';`,
      );
      controllerModules.push(names.controller.pascalCase);
    }

    if (modulesToCreate.includes('entity')) {
      importFiles.push("import { TypeOrmModule } from '@nestjs/typeorm';");
      importFiles.push(
        `import { ${names.entity.pascalCase} } from './${moduleName}.entity';`,
      );
      importFiles.push(
        `import { ${names.repository.pascalCase} } from './${moduleName}.repository';`,
      );
      importModules.push(
        `TypeOrmModule.forFeature([${names.entity.pascalCase}])`,
      );
      providerModules.push(names.repository.pascalCase);
    }

    const file = template
      .replace(/{{module-imports}}/g, importFiles.join('\n'))
      .replace(/{{imports}}/g, importModules.join(', '))
      .replace(/{{providers}}/g, providerModules.join(', '))
      .replace(/{{controllers}}/g, controllerModules.join(', '))
      .replace(/{{module-pascal-case}}/g, names.module.pascalCase);

    fs.writeFileSync(
      path.join(moduleRootPath, `${moduleName}.module.ts`),
      file,
      { encoding: 'utf-8' },
    );

    const appModulePath = join(this.getBackendRootPath(), 'app.module.ts');
    const newImport = `import { ${names.module.pascalCase} } from '@main/modules/${moduleName}/${moduleName}.module';`;
    const newModule = `    ${names.module.pascalCase}`;
    const appModuleFile = fs.readFileSync(appModulePath, { encoding: 'utf-8' });
    const moduleConfigUpdated = appModuleFile
      .replace(/(Modules\r?\n)/g, `$1\n${newImport}`)
      .replace(
        // @ts-ignore
        /(\s*imports:\s*\[.*?)(\n\s*\],)/s,
        `$1\n${newModule},$2`,
      );
    fs.writeFileSync(appModulePath, moduleConfigUpdated, 'utf-8');
  }

  private createEntity(moduleName: string, moduleRootPath: string) {
    const template = this.getTemplate('entity');

    const names = this.getNames(moduleName);
    const file = template
      .replace(/{{table-name}}/g, names.none.snakeCase)
      .replace(/{{entity-pascal-case}}/g, names.entity.pascalCase);

    fs.writeFileSync(
      path.join(moduleRootPath, `${moduleName}.entity.ts`),
      file,
      { encoding: 'utf-8' },
    );

    console.log('Files created successfully.');
  }

  private createController(moduleName: string, moduleRootPath: string) {
    const template = this.getTemplate('controller');

    const names = this.getNames(moduleName);
    const file = template
      .replace(/{{module-name}}/g, moduleName)
      .replace(/{{controller-camel-case}}/g, names.module.camelCase)
      .replace(/{{controller-pascal-case}}/g, names.controller.pascalCase)
      .replace(/{{service-camel-case}}/g, names.service.camelCase)
      .replace(/{{service-pascal-case}}/g, names.service.pascalCase);

    fs.writeFileSync(
      path.join(moduleRootPath, `${moduleName}.controller.ts`),
      file,
      { encoding: 'utf-8' },
    );
  }

  private getNames(moduleName: string): NameSuffixed {
    const splitNames = (suffix: Suffix) => {
      const sp = moduleName.split('-');
      if (suffix === 'none') return sp;
      return [...sp, suffix];
    };

    const snakeCase = (suffix: Suffix) => {
      return splitNames(suffix)
        .map((n) => n.toLowerCase())
        .join('_');
    };

    const pascalCase = (suffix: Suffix) => {
      return splitNames(suffix)
        .map((n) => {
          return `${n[0].toUpperCase()}${n.substring(1)}`;
        })
        .join('');
    };

    const camelCase = (suffix: Suffix) => {
      const pc = pascalCase(suffix);
      return `${pc[0].toLowerCase()}${pc.substring(1)}`;
    };

    const suffixName: Suffix[] = [
      'controller',
      'service',
      'repository',
      'entity',
      'module',
      'none',
    ];

    return suffixName.reduce((obj, suffix) => {
      return Object.assign(obj, {
        [suffix]: {
          pascalCase: `${pascalCase(suffix)}`,
          camelCase: `${camelCase(suffix)}`,
          snakeCase: `${snakeCase(suffix)}`,
        },
      });
    }, {}) as NameSuffixed;
  }

  private getTemplate(
    templateName:
      | 'controller'
      | 'service'
      | 'entity'
      | 'repository'
      | 'module'
      | 'service-repo'
      | 'test',
  ) {
    const templatePath = path.join(
      __dirname,
      `${templateName}-ts-template.txt`,
    );
    return fs.readFileSync(templatePath, { encoding: 'utf-8' });
  }
}
