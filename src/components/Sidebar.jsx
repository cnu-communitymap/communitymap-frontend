import React from "react";
import '@/styles/Sidebar.css';
import { menuIcon, profileIcon, settingIcon } from '@/assets/images';

function Sidebar({ handleMenuClick }) {
  return (
    <div className="sidebar">
      <img src={menuIcon} alt="menuIcon" onClick={handleMenuClick}></img>
      <img src={profileIcon} alt="profileIcon"></img>
      <img src={settingIcon} alt="settingIcon"></img>
    </div>
  );
}

export default Sidebar;
