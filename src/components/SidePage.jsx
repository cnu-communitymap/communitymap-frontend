import React from 'react';
import '@/styles/SidePage.css';
import WritePostForm from '@/components/WritePostForm';
import ReadPostForm from '@/components/ReadPostForm';

function SidePage({ sidePage, closeSidePage }) {
  const handleSidebarBackgroundClick = (e) => {
    if (e.target.className === 'sidepage-background') {
      closeSidePage();
    }
  };

  return (
    <>
      {sidePage.isOpen && (
        <div className="sidepage-background" onClick={handleSidebarBackgroundClick}>
          <div className="sidepage" style={{ width: '500px', left: '70px' }}>
            {sidePage.content === 'write' && (
              <div>
                <WritePostForm closeSidePage={closeSidePage} />
              </div>
            )}
            {sidePage.content === 'read' &&  (
              <div>
                <ReadPostForm post={sidePage.post} closeSidePage={closeSidePage}/>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default SidePage;