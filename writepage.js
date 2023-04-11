// 글 쓰기 페이지 렌더링
const write_test_Button = document.querySelector("#writeBTN");

const page_div = document.querySelector("#SidePage");

write_test_Button.addEventListener("click", function(event) {
  event.preventDefault();
  page_div.innerHTML = `<div class="close_side" onclick="closeSidepage()" title="닫기"></div>
  <input class="side_title" type="text" placeholder="제목">
  <textarea class="side_body" contenteditable="true" placeholder="내용을 입력하세요"></textarea>
  <div class="submit">
      <button>Add</button>
  </div>`
});
