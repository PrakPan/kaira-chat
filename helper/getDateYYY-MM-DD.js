import React from "react";

export function convertDate(dateStr){
    console.log("day is:",dateStr)
    const [day,year,month]=dateStr.split("-");
    return `${month}-${year}-${day}`
  }