export default function(){

  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];

  let date = new Date();

  let day = date.getDate();
  let month = months[date.getMonth()];
  let year = date.getFullYear();

  return '' + month + ' ' + day + ', ' + year;
}
