
export async function GET(request: Request) {

  function convertToLastDateOfMonth(dates) {
    const convertedDates = [];
  
    for (let i = 0; i < dates.length; i++) {
      const date = new Date(dates[i]);
      const year = date.getFullYear();
      const month = date.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
      const lastDay = new Date(year, month, 0).getDate();
      const convertedDate = `${year}-${month.toString().padStart(2, '0')}-${lastDay.toString().padStart(2, '0')}`;
      convertedDates.push(convertedDate);
    }
  
    return convertedDates;
  }

  const res = convertToLastDateOfMonth(['2022-12-29', '2023-03-29', '2023-06-29'])

  return new Response(JSON.stringify(res), {
    status: 200,
    headers: {
      'content-type': 'application/json',
    },
  });
}

function processDate(startDate: string) {
  const currentDate = new Date(startDate);
  let previousDate = new Date(currentDate);
  previousDate.setDate(currentDate.getDate() - 1);

  const result = callback(currentDate);

  if (result) {
    return result;
  } else {
    return processDate(previousDate.toISOString().split('T')[0], callback);
  }
}
