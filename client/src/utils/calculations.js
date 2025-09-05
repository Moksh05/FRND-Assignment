// Calculate utilization percentage
export const calculateUtilization = (loadAssigned, totalCapacity) => {
  if (totalCapacity === 0) return 0;
  return Math.round((loadAssigned / totalCapacity) * 100);
};

// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format percentage
export const formatPercentage = (percentage) => {
  return `${percentage}%`;
};

// Calculate company utilization
export const calculateCompanyUtilization = (trucks) => {
  if (!trucks || trucks.length === 0) return 0;
  
  const totalCapacity = trucks.reduce((sum, truck) => sum + truck.totalCapacity, 0);
  const totalLoad = trucks.reduce((sum, truck) => sum + truck.loadAssigned, 0);
  
  return calculateUtilization(totalLoad, totalCapacity);
};