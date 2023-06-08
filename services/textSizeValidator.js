const validateTextSize = (text,requiredWords,altText)=>{
    const textWords = text.split(' ').length
    if(textWords>requiredWords) return altText
    return text
}


export default validateTextSize