import { format, parseISO } from 'date-fns';

export const formatOnlyDate = (date: Date | number | string) => {
  if (typeof date === 'string') date = parseISO(date);
  return format(date, 'dd/MM/yyyy');
};

export const formatDateTime = (date: Date | number | string) => {
  if (typeof date === 'string') date = parseISO(date);
  return format(date, 'dd/MM/yyyy - HH:mm');
};

export const formatOnlyTime = (date: Date | number | string) => {
  if (typeof date === 'string') date = parseISO(date);
  return format(date, 'HH:mm');
};

export const secondsToDisplayTime = (seconds: number, addDays = false) => {
  const days = Math.floor(seconds / 86400);
  const hours = addDays
    ? Math.floor((seconds % 86400) / 3600)
    : Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const display: number[] = [];

  if (addDays) display.push(days);
  if (hours) display.push(hours);
  display.push(minutes);
  display.push(Math.floor(seconds % 60));
  return display.map((d) => `${String(d).padStart(2, '0')}`).join(':');
};
