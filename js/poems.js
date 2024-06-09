// js/main.js
var wiiuiiYiYan = [
  '休对故人思故国，且将新火试新茶。诗酒趁年华。——宋苏轼《望江南》',
  '山中何事？松花酿酒，春水煎茶。——元张可久《人月圆》'
];
var wiiuiiYiYanBg = [
  'https://img.wiiuii.cn/yiyin/1.png',
  'https://img.wiiuii.cn/yiyin/2.png'
];
var wiiuiiYiMain = document.querySelector(".wiiuii-suiji-main"),
    wiuiSjMain = wiiuiiYiMain.parentNode.parentNode,
    date = new Date(),
    wiiuiiMonth = date.getMonth() + 1,
    wiiuiiDay = date.getDate();

document.querySelector(".wiiuiiYear").innerHTML = date.getFullYear() + "年";
if (wiiuiiMonth < 10) {
  document.querySelector(".wiiuiiMonth").innerHTML = "0" + wiiuiiMonth + "月";
} else {
  document.querySelector(".wiiuiiMonth").innerHTML = wiiuiiMonth + "月";
}
if (wiiuiiDay < 10) {
  document.querySelector(".wiiuiiDay").innerHTML = "0" + wiiuiiDay;
} else {
  document.querySelector(".wiiuiiDay").innerHTML = wiiuiiDay;
}
wiuiSjMain.style.padding = "0";

var wiiuiiYyRanBtn = document.querySelector("#xingyu-qh-btn"),
    wiiuiiYiYinTextBox = document.querySelector(".xingyu-yiyin");

function wiiuiiRanYiYin() {
  var a = Math.floor(Math.random() * wiiuiiYiYanBg.length);
  wiiuiiYiYinTextBox.innerHTML = wiiuiiYiYan[Math.floor(Math.random() * wiiuiiYiYan.length)];
  wiiuiiYiMain.style.backgroundImage = "url(" + wiiuiiYiYanBg[a] + ")";
}

wiiuiiRanYiYin();
wiiuiiYyRanBtn.onclick = function () {
  wiiuiiRanYiYin();
};
wiiuiiYiYinTextBox.onclick = function () {
  var a = document.querySelector(".xingyu-yiyin").textContent.split("。")[0];
  open("https://so.gushiwen.cn/search.aspx?value=" + a);
};
