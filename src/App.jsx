import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AccessTokenContext from '@/components/AccessTokenContext';
import Map from '@/components/Map';
import Sidebar from '@/components/Sidebar';
import SidePage from '@/components/SidePage';
import LoginPage from '@/components/LoginPage'; // 로그인 페이지 컴포넌트를 가져옵니다.
import SignUpPage from '@/components/SignUpPage';
import Mypage from '@/components/MyPage'; // Mypage 컴포넌트 가져오기
import { storeAccessToken, getAccessToken, removeAccessToken } from '@/components/utils';
import '@/styles/App.css';


function App() {
  const [sidePage, setSidePage] = useState({
    isOpen: false,
    content: null,
    position: -500
  });

  const [accessToken, setAccessToken] = useState(null);
  

  // useEffect 추가함.
  useEffect( () => {
    const storeAccessToken = getAccessToken();
    if ( storeAccessToken ) {
      setAccessToken(storeAccessToken);
    }
  }, []);

  const handleLogout = () => {
    setAccessToken(null);
    removeAccessToken(); // 로그아웃 시 토큰을 삭제 함.
  };
  const handleLogin = (token) => {
    setAccessToken(token);
    storeAccessToken(token); // 로그인 시 토큰을 저장함.
  }

  const openSidePage = (content, post = null ) => {
    setSidePage({ 
      isOpen: true,
      content: content,
      position: window.innerWidth-500,
      post: post,
    });
  };

  const closeSidePage = () => {
    setSidePage({ isOpen: false, content: null, position: -500 });
  };

  return (
    <AccessTokenContext.Provider value={{ accessToken, setAccessToken: handleLogin }}>
      <div className="app">
        <Router>
          <Sidebar />
          <Routes>
            <Route path="/" element={<Map openSidePage={openSidePage} />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/mypage" element={<Mypage accessToken={accessToken} onLogout={handleLogout}/>} />
          </Routes>
          <SidePage sidePage={sidePage} closeSidePage={closeSidePage} />
        </Router>
      </div>
    </AccessTokenContext.Provider>
  );
}

export default App;
