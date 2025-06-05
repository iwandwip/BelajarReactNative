const sampleNames = [
  "John Doe", "Jane Smith", "Michael Brown", "Emily Davis", 
  "David Wilson", "Sarah Johnson", "Chris Lee", "Amanda Taylor",
  "Robert Garcia", "Lisa Martinez", "Kevin Anderson", "Maria Rodriguez",
  "James Thompson", "Jennifer White", "Daniel Moore", "Jessica Harris"
];

const sampleEmails = [
  "john.doe@email.com", "jane.smith@email.com", "michael.brown@email.com",
  "emily.davis@email.com", "david.wilson@email.com", "sarah.johnson@email.com",
  "chris.lee@email.com", "amanda.taylor@email.com", "robert.garcia@email.com",
  "lisa.martinez@email.com", "kevin.anderson@email.com", "maria.rodriguez@email.com",
  "james.thompson@email.com", "jennifer.white@email.com", "daniel.moore@email.com",
  "jessica.harris@email.com"
];

const statusOptions = ["active", "pending", "inactive", "verified"];

const getRandomElement = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomDate = (daysBack = 30) => {
  const today = new Date();
  const randomDays = Math.floor(Math.random() * daysBack);
  const randomDate = new Date(today.getTime() - (randomDays * 24 * 60 * 60 * 1000));
  
  return randomDate.toISOString().split('T')[0];
};

export const generateSampleData = () => {
  const id = Math.random().toString(36).substr(2, 9);
  const name = getRandomElement(sampleNames);
  const email = getRandomElement(sampleEmails);
  const date = getRandomDate();
  const status = getRandomElement(statusOptions);

  return {
    id,
    name,
    email,
    date,
    status
  };
};

export const generateBulkData = (count = 5) => {
  const data = [];
  const usedNames = new Set();
  
  for (let i = 0; i < count; i++) {
    let sampleData;
    let attempts = 0;
    
    do {
      sampleData = generateSampleData();
      attempts++;
    } while (usedNames.has(sampleData.name) && attempts < 20);
    
    if (!usedNames.has(sampleData.name)) {
      usedNames.add(sampleData.name);
      data.push(sampleData);
    }
  }
  
  return data.sort((a, b) => new Date(b.date) - new Date(a.date));
};