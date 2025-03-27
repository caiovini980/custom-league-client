import * as fs from 'node:fs';
import * as path from 'node:path';
import { input } from '@inquirer/prompts';
import { format } from 'date-fns';
import { AbstractGenerator, GeneratorOptions } from '../abstract-generator';

export class Generator extends AbstractGenerator {
  private readonly CHAR_SEPARATOR = '-';

  options(): GeneratorOptions {
    return {
      title: 'Create database migration',
      name: 'DB_MIGRATION_SEED',
    };
  }

  async generate() {
    const answer = await input({
      message: 'What is name of the file?',
      required: true,
      validate: (input: string) => {
        const pass = !!input;
        if (pass) return true;
        return 'Enter a file name';
      },
    });
    this.createMigrationFiles(
      this.replaceSpecialChar(answer, this.CHAR_SEPARATOR),
    );
  }

  private createMigrationFiles(migrationName: string) {
    const migrationNameParsed = this.replaceSpecialChar(migrationName);
    console.log(`Generating ${migrationNameParsed}...`);
    const typeOrmPath = 'integrations/typeorm';
    const typeOrmMigrationPath = `${typeOrmPath}/migrations`;
    const relativeTypeOrmMigrationPath = path.join(
      this.getBackendRootPath(),
      typeOrmMigrationPath,
    );

    const currentTime = format(new Date().toISOString(), 'yyyyMMddHHmmss');
    const folderName = [currentTime, migrationNameParsed].join(
      this.CHAR_SEPARATOR,
    );
    const sqlFilename = 'migration.sql';
    const migrationFilename = 'index.ts';
    const className = migrationNameParsed
      .split(this.CHAR_SEPARATOR)
      .map((c) => {
        return `${c[0].toUpperCase()}${c.substring(1)}`;
      })
      .join('')
      .concat(currentTime);

    let migrationTsFile = fs.readFileSync(
      path.join(__dirname, 'migrations-ts-template.txt'),
      { encoding: 'utf-8' },
    );
    migrationTsFile = migrationTsFile.replace(/{{FileName}}/g, className);

    const filesMigrationPath = path.join(
      relativeTypeOrmMigrationPath,
      folderName,
    );

    fs.mkdirSync(filesMigrationPath);

    fs.writeFileSync(
      path.join(filesMigrationPath, migrationFilename),
      migrationTsFile,
    );
    fs.writeFileSync(
      path.join(filesMigrationPath, sqlFilename),
      '-- create your sql here\n',
    );

    const migrationFilePath = path.join(
      this.getBackendRootPath(),
      typeOrmPath,
      'migrations.ts',
    );
    const newImport = `import { ${className} } from '@main/${typeOrmMigrationPath}/${folderName}';`;
    const newModule = `  ${className}`;
    const migrationFile = fs.readFileSync(migrationFilePath, {
      encoding: 'utf-8',
    });
    const moduleConfigUpdated = migrationFile
      .replace(/(\r?\nexport const)/g, `${newImport}\n$1`)
      .replace(
        // @ts-ignore
        /(export const migration =\s*\[.*?)(\n\s*\];)/s,
        `$1\n${newModule},$2`,
      );
    fs.writeFileSync(migrationFilePath, moduleConfigUpdated, 'utf-8');

    console.log(
      `Files with name [${migrationNameParsed}] successfully generated in ${filesMigrationPath}`,
    );
  }
}
