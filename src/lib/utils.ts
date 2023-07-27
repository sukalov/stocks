import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitialIndexDates(startDate: string = '2022-12-29') {
  const getDaysArray = (start: string) => {
    let arr = [];
    for (let dt = new Date(start); dt <= new Date(); dt.setDate(dt.getDate() + 1)) {
      arr.push(new Date(dt).toISOString().slice(0, 10));
    }
    return arr;
  };
  const dayList = getDaysArray(startDate).map((dat) => {
    return { date: dat };
  });
  return dayList;
}

export function addMissingValues(data: IndexDay[]) {
  const keys = Object.keys(data[0] as IndexDay);

  const newData = data.map((obj) => {
    const newObj = {} as IndexDay;
    keys.forEach((key) => {
      newObj[key] = obj[key] || null;
    });
    return newObj;
  });

  return newData;
}
