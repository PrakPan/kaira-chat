import React from "react";

export function convertDate(dateStr){
    const [day,month,year]=dateStr.split("-");
    return `${year}-${month}-${day}`
  }