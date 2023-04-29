import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom'; // useNavigate를 import함.
import '@/styles/Sidebar.css';
import { homeIcon, profileIcon, settingIcon } from '@/assets/images';
import AccessTokenContext from '@/components/AccessTokenContext';


function Sidebar() {
  const navigate = useNavigate(); // useNavigate를 사용하여 navigate 객체를 생성함.
  const { accessToken } = useContext(AccessTokenContext); // useContext를 사용하여 accessToken에 접근함.

  const handleMapButtonClick = () => {
    navigate('/'); // navigate 함수를 사용하여 지도 화면으로 이동합니다.
  };

  const handleProfileClick = () => {
    if ( accessToken ) {
      navigate('/mypage'); // 로그인이 되어있으면 사용자의 마이페이지로 이동
    } else {
      navigate('/login'); // 로그인이 되어 있지 않으면 로그인 페이지로 이동
    }
  };

  return (
    <div className="sidebar">
      <img src={homeIcon} alt="menuIcon" onClick={handleMapButtonClick}></img>
      <img src={profileIcon} alt="profileIcon" onClick={handleProfileClick}></img>
      <img src={settingIcon} alt="settingIcon"></img>
    </div>
  );
}

export default Sidebar;
