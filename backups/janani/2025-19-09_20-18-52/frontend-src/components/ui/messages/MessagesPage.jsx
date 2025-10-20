import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate();

  // Fetch conversations
  useEffect(() => {
    if (!token) return;
    fetch('http://10.231.41.76:5000/api/messages/conversations', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.conversations) setConversations(data.conversations);
      })
      .catch(console.error);
  }, [token]);

  // Fetch all users (except self)
  useEffect(() => {
    if (!token) return;
    fetch('http://10.231.41.76:5000/api/auth/users', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.users) setUsers(data.users);
      })
      .catch(console.error);
  }, [token]);

  // Start a conversation
  const startConversation = async (otherUserId) => {
    try {
      const res = await fetch('http://10.231.41.76:5000/api/messages/start', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ participants: [otherUserId] }),
      });

      const data = await res.json();
      if (res.ok) {
        navigate(`/messages/${data.conversation_id}`);
      } else {
        alert(data.error || 'Failed to start conversation');
      }
    } catch (err) {
      console.error('Error starting conversation:', err);
    }
  };

  return (
    <div className="messages-page p-6">
      <h2 className="text-2xl mb-4">Messages</h2>

      {/* Start new chat */}
      <div className="mb-6">
        <h3 className="text-lg mb-2">Start a new chat</h3>
        <div className="space-y-2">
          {users.map(user => (
            <button
              key={user.user_id}
              onClick={() => startConversation(user.user_id)}
              className="w-full flex justify-between items-center p-3 bg-white/5 hover:bg-white/10 rounded-md"
            >
              <span>{user.name} ({user.role})</span>
              <span className="text-sm text-gray-400">{user.email}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Existing conversations */}
      <div>
        <h3 className="text-lg mb-2">Your conversations</h3>
        {conversations.length === 0 ? (
          <p>No conversations yet.</p>
        ) : (
          <div className="space-y-2">
            {conversations.map(conv => (
              <Link
                key={conv.conversation_id}
                to={`/messages/${conv.conversation_id}`}
                className="block p-3 rounded-md bg-white/5 hover:bg-white/10"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-semibold">{conv.other_preview}</div>
                    <div className="text-sm text-muted">
                      {conv.last_message || 'No messages yet'}
                    </div>
                  </div>
                  <div className="text-xs text-muted">
                    {conv.last_updated
                      ? new Date(conv.last_updated).toLocaleString()
                      : ''}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessagesPage;
