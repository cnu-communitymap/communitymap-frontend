// 버튼을 눌렀을때,  innerPage 요소의 위치를 바꿔줘야 

const sideButton = document.querySelector('a');
const sidePage = document.querySelector('#SidePage');

function clickSideBtn() {
  sidePage.classList.toggle('clicked');
}

sideButton.addEventListener('click',clickSideBtn);
