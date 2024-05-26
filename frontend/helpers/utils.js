// Function to convert INR price to the selected currency and round it up to the nearest whole number
export const convertPrice = (price, selectedCurr) => {
  let convertedPrice = price / selectedCurr?.value;
  convertedPrice = Math.ceil(convertedPrice) + 1;
  return convertedPrice;
};


// function for truncate the title
export const truncateTitle = (title, maxLength) => {
  if (title.length > maxLength) {
    return title.slice(0, maxLength) + '...';
  }
  return title;
};


export const getConfig = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return {
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.API_KEY,
      'Authorization': token ? `Bearer ${token}` : ''
    }
  };
};

export function formatCustomTimestamp(isoTimestamp) {
  const date = new Date(isoTimestamp);

  const year = date.getUTCFullYear();
  const monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];
  const month = monthNames[date.getUTCMonth()];
  const day = date.getUTCDate();

  let hours = date.getUTCHours();
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'P:M' : 'A:M';
  hours = hours % 12;
  hours = hours ? hours : 12;
  const formattedDate = `${month} ${day}, ${year} At ${hours}:${minutes}${ampm}`;

  return formattedDate;
}


