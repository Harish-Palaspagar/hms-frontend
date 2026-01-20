const addZeroMonth = (
  data: any[] = [],      // ✅ default empty array
  monthKey: string,
  valueKey: string
) => {
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return months.map((month) => {
    const item = data.find((item) => item?.[monthKey] === month);
    return item ?? { [monthKey]: month, [valueKey]: 0 };
  });
};


const convertToReasonChart = (data: any[]) => {
  const colors = [
    'blue.6',
    'red.6',
    'cyan.6',
    'pink.6',
    'orange.6',
    'teal.6',
    'gray.6',
  ];

  return data.map((item, index) => ({
    ...item,
    color: colors[index % colors.length],
    name: item?.reason,
    value: item?.count,
  }));

  

}

const formatBloodGroup = (bg: string) => {
  if (!bg) return "Unknown";

  const mapping: Record<string, string> = {
    "A_POSITIVE": "A+",
    "A_NEGATIVE": "A-",
    "B_POSITIVE": "B+",
    "B_NEGATIVE": "B-",
    "AB_POSITIVE": "AB+",
    "AB_NEGATIVE": "AB-",
    "O_POSITIVE": "O+",
    "O_NEGATIVE": "O-",
  };

  return mapping[bg] || bg;
};


export { addZeroMonth, convertToReasonChart, formatBloodGroup };
