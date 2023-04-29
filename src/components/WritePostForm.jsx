import React, { useState, useEffect, useContext } from "react";
import AccessTokenContext from '@/components/AccessTokenContext';
import "@/styles/WritePostForm.css";

const getCurrentPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

function WritePostForm({ closeSidePage }) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("INFO");
  const [position, setPosition] = useState(null);
  const { accessToken } = useContext(AccessTokenContext);
  const [image, setImage] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const { coords } = await getCurrentPosition();
        setPosition({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      } catch (error) {
        console.error("Error getting user's current position:", error);
        setPosition({
          latitude: 36.364796492625,
          longitude: 127.3446474971166,
        });
      }
    })();
  }, []);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const post = {
      title,
      content,
      category,
      position,
    };

    console.log("Sending the following data to the server:", post);

    await addPost(post);
  };

  const addPost = async (post) => {
    try {

      const formData = new FormData();
      formData.append("post", new Blob([JSON.stringify(post)], { type: "application/json" }));

      if (image) {
        formData.append("image", image);
      }

      const response = await fetch("http://118.67.154.247/mapcommu/post/write", {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
        body: formData,
      });
  
      if (response.ok) {
        const result = await response.text();
        console.log("Post created successfully:", result);
      } else {
        throw new Error(`Server responded with status: ${response.status}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <form className="writePostForm" onSubmit={handleSubmit}>
      <div className="writeClose" title="닫기" onClick={closeSidePage}></div>
      <h2>게시글 작성</h2>
      <div className="form-control">
        <label htmlFor="category">Category </label>
        <select id="category" value={category} onChange={handleCategoryChange}>
          <option value="INFO">INFO</option>
          <option value="FOOD">FOOD</option>
          <option value="TALK">TALK</option>
        </select>
      </div>
      <div className="form-control">
        {/* <label htmlFor="title">제목</label> */}
        <input
          type="text"
          id="title"
          value={title}
          onChange={handleTitleChange}
          required
          maxLength = "20"
          placeholder="제목을 입력하세요"
        />
      </div>
      <div className="form-control">
        {/* <label htmlFor="content">내용</label> */}
        <textarea
          id="content"
          value={content}
          onChange={handleContentChange}
          required
          placeholder="내용을 입력하세요"
        ></textarea>
      </div>
      <div className="form-control">
        <input
          type="file"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
          required
        />
      </div>
      <button type="submit">작성하기</button>
    </form>
  );
}

export default WritePostForm;
