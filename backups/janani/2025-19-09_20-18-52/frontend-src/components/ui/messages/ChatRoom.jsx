// frontend/src/components/ui/dashboards/student/ChatRoom.jsx
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';

const ChatRoom = () => {
  const { convId } = useParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef(null);
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('user_id');
  const messagesEndRef = useRef(null);

  console.log('Current userId from localStorage:', userId);

  // Fetch existing messages
  useEffect(() => {
    if (!token || !convId) return;

    fetch(`http://10.231.41.76:5000/api/messages/${convId}/messages`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => {
        if (data.messages) {
          console.log('Fetched messages:', data.messages);
          // Ensure all message content is properly handled as strings
          const processedMessages = data.messages.map(msg => ({
            ...msg,
            content: typeof msg.content === 'string' ? msg.content : String(msg.content || '')
          }));
          setMessages(processedMessages);
        }
      })
      .catch(err => {
        console.error('Error fetching messages:', err);
      });
  }, [convId, token]);

  // Socket.IO connection
  useEffect(() => {
    if (!token || !convId) return;

    socketRef.current = io('http://10.231.41.76:5000', {
      auth: { token },
    });

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
      setIsConnected(true);
      socketRef.current.emit('join_conversation', { conversation_id: convId });
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
      setIsConnected(false);
    });

    socketRef.current.on('new_message', msg => {
      console.log('New message received:', msg);
      if (msg.conversation_id === convId) {
        // Ensure content is properly handled as string
        const processedMessage = {
          ...msg,
          content: typeof msg.content === 'string' ? msg.content : String(msg.content || '')
        };
        setMessages(prev => [...prev, processedMessage]);
      }
    });

    socketRef.current.on('error', err => {
      console.error('Socket error:', err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.emit('leave_conversation', { conversation_id: convId });
        socketRef.current.disconnect();
      }
    };
  }, [convId, token]);

  // Auto scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = () => {
    const messageText = text.trim();
    if (!messageText || !socketRef.current) return;
    
    console.log('Sending message:', messageText);
    
    // Send the message via socket
    socketRef.current.emit('send_message', {
      conversation_id: convId,
      content: messageText, // Ensure this is sent as a complete string
      token,
    });
    
    setText('');
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="chat-room p-6 flex flex-col h-full bg-gray-900">
      <div className="chat-header mb-4">
        <h3 className="text-xl text-white">Chat</h3>
        <div className="text-sm text-gray-400">
          Status: {isConnected ? 'Connected' : 'Disconnected'}
        </div>
      </div>

      <div className="chat-body flex-1 overflow-auto p-4 bg-gray-800 rounded-lg">
        {messages.length === 0 ? (
          <div className="text-gray-400 text-center">No messages yet. Start the conversation!</div>
        ) : (
          messages.map(m => {
            const isMyMessage = String(m.sender_id) === String(userId);
            console.log(`Message ${m.message_id}: sender_id=${m.sender_id}, userId=${userId}, isMyMessage=${isMyMessage}`);
            
            return (
              <div
                key={m.message_id}
                className={`mb-4 flex w-full ${
                  isMyMessage ? "justify-end" : "justify-start"
                }`}
              >
                <div className={`flex flex-col ${isMyMessage ? "items-end" : "items-start"}`}>
                  {/* Show sender name for other people's messages */}
                  {!isMyMessage && (
                    <div className="text-xs text-gray-400 mb-1">
                      {m.sender_name}
                    </div>
                  )}
                  <div
                    className={`p-3 rounded-lg max-w-[70%] shadow-md break-words ${
                      isMyMessage
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-gray-600 text-white rounded-bl-sm"
                    }`}
                  >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap">
                      {/* Ensure content is displayed as a complete string */}
                      {typeof m.content === 'string' ? m.content : String(m.content || '')}
                    </div>
                  </div>
                  <div className={`text-xs text-gray-400 mt-1 ${isMyMessage ? "text-right" : "text-left"}`}>
                    {formatTimestamp(m.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="chat-input mt-4 flex gap-2">
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          className="flex-1 p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          disabled={!isConnected}
        />
        <button
          onClick={sendMessage}
          disabled={!text.trim() || !isConnected}
          className="px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatRoom;