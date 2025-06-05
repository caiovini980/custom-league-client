const fs = require('node:fs');
const path = require('node:path');

const tempFile = fs.readFileSync(path.join(process.cwd(), '.temp'), {
  encoding: 'utf-8',
});

const baseDir = path.join(tempFile.trim(), 'plugins');
const searchWord = process.argv[2]; // palavra que você quer buscar
const fileRegex = /^(.*)\.json$/;

function findFilesWithWord(dir, word, results = []) {
  const items = fs.readdirSync(dir, { withFileTypes: true });
  const reg = new RegExp(word, 'i');

  for (const item of items) {
    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {
      findFilesWithWord(fullPath, word, results); // Recurse em subdiretórios
    } else if (fileRegex.test(item.name)) {
      let jsonString = fs.readFileSync(fullPath, 'utf8');
      if (jsonString.charCodeAt(0) === 0xfeff) {
        jsonString = jsonString.slice(1);
      }
      const content = JSON.stringify(JSON.parse(jsonString), null, 2);
      const lines = content.split(/\r?\n/);

      const matches = lines
        .map((line, index) => ({ line, lineNumber: index + 1 }))
        .filter(({ line }) => reg.test(line));

      if (matches.length > 0) {
        results.push({
          file: fullPath,
          matches: matches.reduce(
            (prev, curr) =>
              Object.assign(prev, {
                [curr.lineNumber]: curr.line,
              }),
            {},
          ),
        });
      }
    }
  }

  return results;
}

const result = findFilesWithWord(baseDir, searchWord);
console.log(`Arquivos que contêm "${searchWord}":`);
console.log(result.length ? result : 'Nenhum encontrado.');
