import { dateIsValid } from "./isDateDDMMYYY";
export const getHumanDate = (dateString) => {
    //check if dateString is valied
    // var m = dateString.match(/^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/);
 //   return (m) ? new Date(m[3], m[2]-1, m[1]) : null;
    if(!dateIsValid(dateString)) return dateString;
    else {
        // datestring is date of the format dd/mm/yyyy
        let d = dateString.split("/");

        // month is 0-based, that's why we need d[1] - 1
        let date = new Date(d[2], d[1] - 1, d[0]);
        const months = ["Jan", "Feb", "March", "April", "May", "June", "July", "Aug", "Sept", "Oct", "Nov", "Dec"];
        let day = date.getDate();
        if(day === 11) day ='11th';
        else if(day === 12) day ='12th';
        else if(day === 13) day ='13th';

        else if (day % 10 === 1)
            day = day + 'st';
        else if (day % 10 === 2)
            day = day + 'nd';
        else if (day % 10 === 3)
            day = day + 'rd';
        else
            day = day + 'th';
        let month =  months[date.getMonth()];
        return day + ' ' + month;
    }
}