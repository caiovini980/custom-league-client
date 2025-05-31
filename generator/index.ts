import * as fs from 'node:fs';
import * as path from 'node:path';
import { select } from '@inquirer/prompts';
import { AbstractGenerator } from './abstract-generator';

const prompt = async () => {
  const generators = searchGenerator();
  const answer = await select<string>({
    message: 'What option do you want?',
    choices: generators.map((g) => ({
      name: g.options().title,
      value: g.options().name,
    })),
  });

  await generators.find((g) => g.options().name === answer)?.generate();
};

const searchGenerator = () => {
  const filename = 'generator.ts';
  const className = 'Generator';
  const generatorPath = path.join(__dirname);
  const nameChecker: { name: string; path: string }[] = [];

  return fs
    .readdirSync(generatorPath, { withFileTypes: true })
    .filter((file) => file.isDirectory())
    .reduce((prev, dir) => {
      const generatorFilePath = path.join(generatorPath, dir.name, filename);
      if (fs.existsSync(generatorFilePath)) {
        const genClass = require(generatorFilePath);
        if (genClass[className]) {
          const genInstance = new genClass[className]();
          const generatorName = genInstance.options().name;
          const generatorCheck = nameChecker.find(
            (c) => c.name === generatorName,
          );
          if (generatorCheck) {
            throw Error(
              `Name already exist: [${generatorName}]\n--> ${generatorCheck.path}\n--> ${generatorFilePath}`,
            );
          }
          prev.push(genInstance);
          nameChecker.push({ name: generatorName, path: generatorFilePath });
        } else {
          console.warn(
            `Class no export with name: Generator - in ${generatorFilePath}`,
          );
        }
      } else {
        console.warn(`Generator ${generatorFilePath} not found`);
      }
      return prev;
    }, [] as AbstractGenerator[]);
};

prompt().catch((err) => {
  if (err.name !== 'ExitPromptError') {
    console.error(err);
  }
  process.exit(1);
});
