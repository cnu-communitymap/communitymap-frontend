// fetch api를 사용해서 innerHTML을 넣어줄 div 요소 꺼내기
const myDiv = document.querySelector("#sidePage");


// 버튼을 눌렀을때, innerPage 요소의 위치를 바꿔줘야 

const sideButton = document.querySelector('#menuicon');

const writeButton = document.querySelector('#writeBTN');

const sidePage = document.querySelector('#SidePage');


// 메뉴 버튼 클릭 했을 때 동작
function clickSideBtn() {
  sidePage.classList.toggle('clicked');
}
sideButton.addEventListener('click',clickSideBtn);


// 글쓰기 버튼 클릭 했을 때 동작
function writeBTN() {
  sidePage.classList.toggle('clicked');
}
writeButton.addEventListener('click',writeBTN);
