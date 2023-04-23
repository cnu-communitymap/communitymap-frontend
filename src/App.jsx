import React, { useState } from 'react';
import Map from '@/components/Map';
import Sidebar from '@/components/Sidebar';
import SidePage from '@/components/SidePage';
function App() {
  const [isSidePageOpen, setIsSidePageOpen] = useState(false);

  const handleMenuClick = () => {
    setIsSidePageOpen(!isSidePageOpen);
  }
  return (
    <div className="app">
      <Sidebar handleMenuClick={handleMenuClick}/>
      <Map />
      <SidePage isOpen={isSidePageOpen} />
    </div>
  );
}

export default App;