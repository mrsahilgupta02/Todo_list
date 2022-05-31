
exports.getDate  = function(){ //here exports work as it gives value of this function on mai page
var today = new Date();
const options ={
  weekday: "long",
  day: "numeric",
  month: "long"
};
let day  = today.toLocaleDateString("en-US",options);

return day;
}


exports.getDay = function(){
var today = new Date();
const options ={
  weekday: "long",
};
let day  = today.toLocaleDateString("en-US",options);

return day;
}
