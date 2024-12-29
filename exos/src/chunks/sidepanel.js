import React, { useState, useEffect } from 'react';
import { useAuth, useSettings } from './providers';
import { MessageCircle, Settings, LogOut } from 'lucide-react';

function Sidepanel() {
  const { user, login, logout } = useAuth();
  const { settings } = useSettings();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [port, setPort] = useState(null);

  useEffect(() => {
    // Connect to background script
    const port = chrome.runtime.connect({ name: 'sidebar' });
    setPort(port);

    port.onMessage.addListener((message) => {
      if (message.action === 'close') {
        window.close();
      } else if (message.action === 'request') {
        setInput(message.msg);
        // Process the command here
      }
    });

    return () => port.disconnect();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessage = {
      text: input,
      sender: 'user',
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMessage]);
    setInput('');
    
    // Process command here
    processCommand(input);
  };

  const processCommand = async (command) => {
    // Add your command processing logic here
    const response = {
      text: `Processing command: ${command}`,
      sender: 'system',
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, response]);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        <h1 className="text-xl font-bold">EXOS</h1>
        <div className="flex items-center gap-2">
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <Settings size={20} />
          </button>
          {user ? (
            <button 
              onClick={logout}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <LogOut size={20} />
            </button>
          ) : (
            <button 
              onClick={login}
              className="px-4 py-2 text-sm text-white bg-blue-500 rounded hover:bg-blue-600"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                msg.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a command..."
            className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
          >
            <MessageCircle size={20} />
          </button>
        </div>
      </form>
    </div>
  );
}

// Root component
function App() {
  return (
    <Providers>
      <Sidepanel />
    </Providers>
  );
}

export default App;
