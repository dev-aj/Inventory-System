var whitebutton = document.getElementsByClassName('div1');
var brownbutton = document.getElementsByClassName('div2');
var display = document.getElementsByClassName('div0');
//let all = whitebutton.concat(brownbutton);
console.log(whitebutton[0]);
var operand1 = 0;
var operand2 = null;
var operator = null;
let temp = [];
console.log('hello here');
for (var i = 0; i < whitebutton.length; i++) {
  // whitebutton[i].addEventListener('click', function () {
  //   console.log('Hello');
  // });
  temp[i] = whitebutton[i];
}
let temp2 = [];
for (var i = 0; i < brownbutton.length; i++) {
  temp2[i] = whitebutton[i];
}
