import * as fs from 'node:fs';
import * as path from 'node:path';
import { input } from '@inquirer/prompts';
import { AbstractGenerator, GeneratorOptions } from '../abstract-generator';

export class Generator extends AbstractGenerator {
  options(): GeneratorOptions {
    return {
      name: 'GENERATOR',
      title: 'Create Generator',
    };
  }

  async generate(): Promise<void> {
    const answer = await input({
      message: "What's your generator name?",
      required: true,
      transformer: (v) => this.replaceSpecialChar(v),
      validate: (input: string) => {
        const pass = !!input;
        if (pass) return true;
        return 'Please enter with generator name';
      },
    });

    const generatorNameParsed = this.replaceSpecialChar(answer);
    const generatorFileName = 'generator.ts';
    const generatorPath = path.join(process.cwd(), 'generator');

    let generatorTsFile = fs.readFileSync(
      path.join(__dirname, 'generator-template.txt'),
      { encoding: 'utf-8' },
    );
    generatorTsFile = generatorTsFile.replace('{{Title}}', generatorNameParsed);

    const generatorTsFilePath = path.join(generatorPath, generatorNameParsed);

    if (fs.existsSync(generatorTsFilePath)) {
      console.log(`Generator ${generatorNameParsed} already exists`);
      return;
    }
    fs.mkdirSync(generatorTsFilePath, { recursive: true });
    fs.writeFileSync(
      path.join(generatorTsFilePath, generatorFileName),
      generatorTsFile,
      {
        encoding: 'utf-8',
      },
    );
  }
}
