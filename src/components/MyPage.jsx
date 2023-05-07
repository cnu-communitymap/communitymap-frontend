import React, { useState, useEffect } from 'react';
import { fetchUserData } from '@/components/utils';
import { useNavigate } from 'react-router-dom';
import '@/styles/MyPage.css';

const MyPage = ({ accessToken, onLogout }) => {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchUserData(accessToken);
        setUserData(data);
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    }

    if (accessToken) {
      loadData();
    }
  }, [accessToken]);

  const handleLogout = () => {
    onLogout();
    navigate('/'); // 로그 아웃 후 홈 화면으로 리디렉션함.
  }
  return (
    <div className="mypage-container">
      <div className="mypage">
        {userData ? (
          <div className="info-container">
            <h1>{userData.nickname}</h1>
            <p>Email: {userData.email}</p>
            <p>Gender: {userData.gender}</p>
            <p>Birth: {userData.birth}</p>
          </div>
        ) : (
          <p>Loading...</p>
        )}
        <button className="edit-button">정보 수정</button>
        <button className="logout-button" onClick={handleLogout}>로그아웃</button>
      </div>
    </div>
  );
};

export default MyPage;
