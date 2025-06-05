const statusOptions = ["active", "pending", "inactive", "completed", "error"];

const getRandomFloat = (min = 0, max = 1000, decimals = 2) => {
  const value = Math.random() * (max - min) + min;
  return parseFloat(value.toFixed(decimals));
};

const getRandomDate = (daysBack = 30) => {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * daysBack);
  const randomDate = new Date(today.getTime() - (randomDays * 24 * 60 * 60 * 1000));
  
  return randomDate.toISOString().split('T')[0];
};

const getRandomStatus = () => {
  return statusOptions[Math.floor(Math.random() * statusOptions.length)];
};

export const generateSampleData = () => {
  const date = getRandomDate();
  const value1 = getRandomFloat(10, 500, 2);
  const value2 = getRandomFloat(1, 100, 2);
  const status = getRandomStatus();

  return {
    date,
    value1,
    value2,
    status
  };
};

export const generateBulkData = (count = 10) => {
  const data = [];
  const usedDates = new Set();
  
  for (let i = 0; i < count; i++) {
    let sampleData;
    let attempts = 0;
    
    do {
      sampleData = generateSampleData();
      attempts++;
    } while (usedDates.has(sampleData.date) && attempts < 50);
    
    if (!usedDates.has(sampleData.date)) {
      usedDates.add(sampleData.date);
      data.push(sampleData);
    } else {
      sampleData.date = getRandomDate(60);
      data.push(sampleData);
    }
  }
  
  return data.sort((a, b) => new Date(b.date) - new Date(a.date));
};