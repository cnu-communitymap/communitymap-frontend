import React, {useState,  useEffect, useContext } from "react"; 
import "@/styles/ReadPostForm.css";
import AccessTokenContext from '@/components/AccessTokenContext';
import defaultImg from "@/assets/images/defaultImg.svg";

function ReadPostForm({ post, onDelete, closeSidePage }) {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const { accessToken } = useContext(AccessTokenContext);

  if (!post){
    return <div>Loading...</div>; // post 객체가 undefined 인 경우 로딩 메세지 출력
  }

  const postedId = post.id;

  useEffect(() => {
    // 서버에서 댓글 목록 불러오기
    
    fetch(`http://118.67.154.247/mapcommu/post/comments?postId=${postedId}`)
      .then((response) => response.json())
      .then((data) => {
        setComments(data);
      });
  }, []);

  const handleCommentChange = (event) => {
    setComment(event.target.value);
  }

  const handleCommentSubmit = () => {
    const data = {
      content: comment,
      post: {
        id: postedId
      }
    };
    console.log("posted" + postedId);
    
    console.log("access_token" + accessToken);
    
    fetch('http://118.67.154.247/mapcommu/comment/write', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', 
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(data)
    })
    .then((response) => response.json())
    .then((data) => {
      // 댓글 목록 업데이트
      setComments([...comments, data]);
      setComment("");
    });
  };
  
  return (
    <div className='readTotal'>
      <div className="readClose" title="닫기" onClick={()=>{closeSidePage()}}></div>
      <div className="readBtns">
        <button className='readRevise'>수정</button>
        <button className='readDelete'>삭제</button>
      </div>
      <h2 className='readTitle'>{post.title}</h2>
      <img className='readImage' src={post.imageUrl ? post.imageUrl : defaultImg} alt='게시글 이미지' />
      <p className='readContent'>{post.content}</p>
      {/* <small className='readAuthor'>{post.author}</small> */}
      {/* <p className='readDate'>{post.date}</p> */}
      <hr></hr>
      <ul className="read_commentsUl">
        {comments.map((comment) => (
          <li key={comment.id} className="read_commentsLi">{comment.content}</li>
        ))}
      </ul>
      <div>
        <form className="pluscomment" onSubmit={handleCommentSubmit}>
          <div className="form-control">
            <label htmlFor="comment">댓글</label>
            <input
              type="text"
              id="comment"
              value={comment}
              onChange={handleCommentChange}
              required
            />
          </div>
          <button type="submit">등록</button>
        </form>
      </div>

    </div>
    
  );
}

export default ReadPostForm;