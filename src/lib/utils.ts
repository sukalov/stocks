import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitialIndexDates(startDate: string) {
  const getDaysArray = (start: string) => {
    let dates = [];
    for (let dt = new Date(start); dt <= new Date(); dt.setDate(dt.getDate() + 1)) {
      dates.push(new Date(dt).toISOString().slice(0, 10));
    }

    return dates;
  };
  const dayList = getDaysArray(startDate).map((dat) => {
    return { date: dat };
  });
  return dayList;
}

export function addMissingValues(data: any) {
  const keys = Object.keys(data[0]);

  let newData: any[] = [];
  data.forEach((obj: any, i: number) => {
    const newObj = {} as any[];
    keys.forEach((key: any) => {
      const prevDay = newData[i - 1];
      if (prevDay !== undefined) {
        newObj[key] = obj[key] || newData[i - 1]![key];
      } else if (obj[key] != null){
        newObj[key] = obj[key] || 0;
      } else {
        newObj[key] = 0;
      }
    });
    newData.push(newObj);
  });
  return newData;
}

export function findUnique(array1: any[], array2: any[]): [string[], string[]] {
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

  return [uniqueInArray1, uniqueInArray2];
}

export function getQuarterlyStartDates(start_date: string) {
  const quarterlyStartDates = [start_date];
  const today = new Date();

  const addDate = (arr: string[]) => {
    const lastDate = new Date(arr[arr.length - 1]!);
    if (lastDate < today) {
      lastDate.setMonth(lastDate.getMonth() + 3);
      arr.push(lastDate.toISOString().split('T')[0] ?? '');
      addDate(arr);
    }
  };
  addDate(quarterlyStartDates);
  quarterlyStartDates.pop();

  const convertedDates = [];

  for (let i = 0; i < quarterlyStartDates.length; i++) {
    const date = new Date(quarterlyStartDates[i]!);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
    const lastDay = new Date(year, month, 0).getDate();
    const convertedDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;
    convertedDates.push(convertedDate);
  }
  return convertedDates;
}

export function compareDates(date1: Date, date2: Date) {
  const d1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  const d2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());

  if (d1 < d2) {
    return -1;
  } else if (d1 > d2) {
    return 1;
  } else {
    return 0;
  }
}
