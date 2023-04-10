export function convertDateFormat(dateString) {
    const months = [
      'Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July',
      'Aug', 'Sept', 'Oct', 'Nov', 'Dec'
    ];
  
    const [day, monthIndex, year] = dateString.split('/');
  
    if (!day || !monthIndex || !year) {
        return dateString
    //   throw new Error('Invalid date format');
    }
  
    const monthName = months[Number(monthIndex) - 1];
  
    return `${monthName} ${Number(day)}`;
  }
  