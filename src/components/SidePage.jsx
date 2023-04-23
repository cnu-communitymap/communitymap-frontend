import React from 'react';
import "@/styles/SidePage.css";

function SidePage({ isOpen }) {
  return (
    <div className="side-page" style={{ transform: `translateX(${isOpen ? "70" : "-500"}px)` }}>
      <h1>Side Page</h1>
      <p>Here's some content for the side page.</p>
    </div>
  );
}

export default SidePage;