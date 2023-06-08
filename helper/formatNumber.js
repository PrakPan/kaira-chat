export function formatNumber(num) {
    if (isNaN(num)) {
      return "Invalid input";
    }
    let formattedNum = new Intl.NumberFormat('en-IN').format(num);
    return formattedNum;
  }