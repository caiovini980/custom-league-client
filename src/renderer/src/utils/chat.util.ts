export const getChatAvailabilityColor = (availability: string) => {
  if (availability === 'chat') {
    return '#71ff89';
  }
  if (availability === 'away') {
    return '#ff6464';
  }
  if (availability === 'dnd') {
    return '#61a5ff';
  }
  return undefined;
};
