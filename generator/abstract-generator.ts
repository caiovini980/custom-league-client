export interface GeneratorOptions {
  name: string;
  title: string;
}

export abstract class AbstractGenerator {
  abstract options(): GeneratorOptions;
  abstract generate(): Promise<void>;

  protected getBackendRootPath() {
    return 'src/main';
  }

  protected replaceSpecialChar(text: string, charSeparator = '-') {
    const regRule = '[^a-zA-Z0-9]';
    const regReplaceBetween = new RegExp(`${regRule}+`, 'g');
    const regReplaceStart = new RegExp(`^${regRule}`, 'g');
    const regReplaceEnd = new RegExp(`${regRule}$`, 'g');

    return text
      .replace(/\s+/, ' ')
      .replace(regReplaceBetween, charSeparator)
      .replace(regReplaceStart, '')
      .replace(regReplaceEnd, '')
      .toLowerCase();
  }
}
