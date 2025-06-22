import React from 'react';
import ChatBox from './ChatBox';

const App: React.FC = () => {
  return (
    <div className="app-container">
      <header>
        <h1>Frontend Dev Best Practices Chat</h1>
      </header>
      <ChatBox />
    </div>
  );
};

export default App;