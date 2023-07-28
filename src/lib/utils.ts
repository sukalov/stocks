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

export function findUnique(array1: any[], array2: any[]): [string[], string[]]  {
  const uniqueInArray1 = [];
  const uniqueInArray2 = [];

  for (let i = 0; i < array1.length; i++) {
    if (!array2.includes(array1[i])) {
      uniqueInArray1.push(String(array1[i]));
    }
  }

  for (let i = 0; i < array2.length; i++) {
    if (!array1.includes(array2[i])) {
      uniqueInArray2.push(String(array2[i]));
    }
  }

return [uniqueInArray1, uniqueInArray2]
}

export function getQuarterlyStartDates(start_date: string) {
  const quarterlyStartDates = [start_date];
  const today = new Date()
  
  const addDate = (arr: string[]) => {
    const lastDate = new Date(arr[arr.length-1]!) 
    if (lastDate < today) {
      lastDate.setMonth(lastDate.getMonth() + 3);
      arr.push(lastDate.toISOString().split('T')[0] ?? '');
      addDate(arr)
    }
  }
  addDate(quarterlyStartDates)
  quarterlyStartDates.pop()
  console.log(quarterlyStartDates)
  
  return quarterlyStartDates
}
