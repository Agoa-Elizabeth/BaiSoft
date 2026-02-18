'use client';

import { useState, useEffect } from 'react';
import { sendChatMessage, getChatHistory, clearChatHistory } from '@/lib/api';
import Link from 'next/link';

export default function Chatbot() {
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await getChatHistory();
      setMessages(history);
    } catch (error) {
      console.error('Error loading chat history:', error);
    }
  };

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input;
    setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessage(userMessage);
      setMessages([response, ...messages]);
    } catch (error) {
      console.error('Error sending message:', error);
      // Show a more user-friendly error message
      const errorMessage = {
        id: Date.now(),
        user_message: userMessage,
        ai_response: "Sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date().toISOString()
      };
      setMessages([errorMessage, ...messages]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = async () => {
    if (clearing) return;

    if (confirm('Are you sure you want to clear all chat history? This cannot be undone.')) {
      setClearing(true);
      try {
        await clearChatHistory();
        setMessages([]);
      } catch (error) {
        console.error('Error clearing chat history:', error);
        alert('Failed to clear chat history. Please try again.');
      } finally {
        setClearing(false);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div>
      <nav className="nav">
        <h1>🤖 Zuri AI Assistant</h1>
        <div className="nav-links">
          <Link href="/"><button className="btn btn-secondary">Back to Home</button></Link>
        </div>
      </nav>

      <div className="chat-container">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ margin: 0 }}>Chat with Zuri AI</h2>
            {messages.length > 0 && (
              <button
                onClick={handleClearHistory}
                className="btn btn-danger btn-sm"
                disabled={clearing}
                style={{ fontSize: '0.875rem', padding: '0.375rem 0.75rem' }}
              >
                {clearing ? 'Clearing...' : 'Clear History'}
              </button>
            )}
          </div>

          <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
            Hi! I'm Zuri, your AI shopping assistant. Ask me about our products!
          </p>

          <div className="chat-messages">
            {messages.length === 0 ? (
              <p style={{ textAlign: 'center', color: '#9ca3af' }}>No messages yet. Start a conversation!</p>
            ) : (
              messages.map((msg, idx) => (
                <div key={msg.id || idx}>
                  <div className="chat-message user">
                    <strong>You:</strong> {msg.user_message}
                  </div>
                  <div className="chat-message ai">
                    <strong>Zuri AI:</strong> {msg.ai_response}
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="chat-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              disabled={loading}
              style={{ flex: 1 }}
            />
            <button
              onClick={handleSend}
              className="btn btn-primary"
              disabled={loading || !input.trim()}
            >
              {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
