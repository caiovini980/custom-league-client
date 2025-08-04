export const regexMapToLeagueClient = {
  '{id}': '.+',
  '{digits}': '[0-9]+',
  '{string}': '[a-zA-Z_]+',
  '{uuid}':
    '[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}',
};

export const buildRegexFromEvent = (event: string) => {
  if (event === 'all') {
    return /.*/;
  }
  const eventParsed = Object.keys(regexMapToLeagueClient).reduce(
    (prev, curr) => {
      return prev.replaceAll(curr, regexMapToLeagueClient[curr]);
    },
    event,
  );

  return new RegExp(`^${eventParsed}$`);
};

export const hasKeyRegex = (event: string) =>
  Object.keys(regexMapToLeagueClient).some((key) => event.includes(key));
