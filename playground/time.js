var moment = require('moment');
// var date = new Date();

var date = moment();
console.log(date.format('h:mm a'));

console.log(moment().valueOf());