import React from "react";

export function convertDate(dateStr){
    console.log("day is:",dateStr)
    const [day,month,year]=dateStr.split("-");
    return `${year}-${month}-${day}`
  }