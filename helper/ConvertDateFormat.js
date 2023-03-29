export function convertDateFormat(dateString) {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June', 'July',
      'August', 'September', 'October', 'November', 'December'
    ];
  
    const [day, monthIndex, year] = dateString.split('/');
  
    if (!day || !monthIndex || !year) {
        return dateString
    //   throw new Error('Invalid date format');
    }
  
    const monthName = months[Number(monthIndex) - 1];
  
    return `${monthName} ${Number(day)}`;
  }
  