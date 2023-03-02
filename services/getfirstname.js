export const getFirstName = (name) => {
    let names=name.split(' ');
    let firstname="";
    if(names.length === 1) return name;
    else{
    for(var j = 0; j < names.length - 1 ; j++){
        firstname=firstname+" "+names[j];
    }
   return firstname;
    }
}