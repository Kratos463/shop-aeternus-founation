// Function to convert INR price to the selected currency and round it up to the nearest whole number
export const convertPrice = (price, selectedCurr) => {
  let convertedPrice = price / selectedCurr?.value;
  convertedPrice = parseFloat(convertedPrice.toFixed(2));
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

export const extractDateFromISO = (isoString) => {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export function calculateBusinessVolume(priceStr) {
  // Convert the string to a number
  const price = parseFloat(priceStr);
  if (isNaN(price)) {
      throw new Error("Invalid price. Please provide a valid number as a string.");
  }

  // Calculate the 20% business volume
  const businessVolume = price * 0.20;
  return businessVolume;
}

export function generate15DigitNumber() {
  let randomNumber = '';
  for (let i = 0; i < 15; i++) {
    randomNumber += Math.floor(Math.random() * 10);
  }
  return randomNumber;
}

export function formatDate(dateString) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}



