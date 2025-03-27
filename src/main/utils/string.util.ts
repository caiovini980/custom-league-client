export const strToFloat = (text: string | undefined): number => {
  try {
    if (text) {
      const formatText = text.trim().match(/[+-]?\d+(\.\d+)?/g);
      if (formatText) {
        return Number.parseFloat(formatText.join(''));
      }
    }
  } catch (e) {
    console.log('StrToIntFltError', e, text);
  }
  return 0;
};

export const strTimeToSecond = (time: string): number => {
  const mapKey = {
    S: 604800,
    D: 86400,
    h: 3600,
    m: 60,
    s: 1,
  };

  let second = 0;

  const keys = time.split(' ');
  keys.map((key) => {
    const [number, letter] = key.split(/(\D+)/g);
    second += mapKey[<keyof typeof mapKey>letter] * Number.parseInt(number);
  });

  return second;
};

export const getStringBeforeRegex = (
  text: string,
  match: string,
  regex = '.+?',
): string => {
  const reg = new RegExp(`${regex}(?=${match})`, 'g');
  return applyRegex(text, reg);
};

export const applyRegex = (text: string, regex: RegExp): string => {
  const temp = text.match(regex);
  if (temp) {
    return temp[0].trim();
  }
  return text;
};
