
import { useEffect } from "react";
import { initClaritySession } from "../utils/claritySession";


export default function ClarityInit() {
  useEffect(() => {
    initClaritySession();
  }, []); 

  return null; 
}