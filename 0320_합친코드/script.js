// 버튼을 눌렀을때,  innerPage 요소의 위치를 바꿔줘야 

const sideButton = document.querySelector('#menuicon');
const sidePage = document.querySelector('#SidePage');

function clickSideBtn() {
  sidePage.classList.toggle('clicked');
}

sideButton.addEventListener('click',clickSideBtn);



// 사이드 페이지 이미지에 커서 올렸을때 이미지가 조금 커지는 동작

/*
const feed_Img_hover = document.querySelector('.feed-img-container img');

function hoverImg() {
  
}
*/