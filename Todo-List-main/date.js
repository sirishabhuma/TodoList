module.exports=dateFun

function dateFun(){
    const date=new Date();
    const options={
        day:"numeric",
        month:"long",
        weekday:"long"      
    }
    const today=date.toLocaleDateString("en-us",options);
    return today;
}