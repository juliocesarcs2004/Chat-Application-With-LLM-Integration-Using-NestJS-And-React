import React, { useState, useEffect, useRef, FormEvent } from 'react';
import { Message, ChatResponse, ErrorResponse } from '@/types';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

const ChatBox: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    setMessages([
      {
        id: 'initial-bot-msg',
        text: 'Hello! I am an expert in Front-end Development Best Practices. Ask me anything on this topic!',
        sender: 'bot'
      }
    ]);
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!inputValue.trim()) {
      setError('Message cannot be empty.');
      inputRef.current?.focus();
      return;
    }
    setError(null);

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: inputValue,
      sender: 'user',
    };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    const botMessageId = `bot-${Date.now()}`;

    try {
      const response = await fetch(`${BACKEND_URL}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: currentInput }),
      });

      if (!response.ok) {
        let errorMessage = 'Failed to get a response. Please try again.';
        try {
          const errorData: ErrorResponse = await response.json();
          errorMessage = Array.isArray(errorData.message)
            ? errorData.message.join(', ')
            : errorData.message || errorData.error || `Server error: ${response.status}`;
        } catch {
          if (response.status === 429) {
            errorMessage = "Too many requests. Please try again later.";
          } else {
            errorMessage = `Server error: ${response.status}. Please try again.`;
          }
        }
        throw new Error(errorMessage);
      }

      const data: ChatResponse = await response.json();
      setMessages((prev) => [...prev, { id: botMessageId, text: data.reply, sender: 'bot' }]);

    } catch (apiError: any) {
      console.error('API error:', apiError);
      let displayError = apiError.message;
      if (apiError instanceof TypeError && apiError.message.includes('fetch')) {
        displayError = "Cannot connect to the chat service. Please ensure the backend is running.";
      }
      setMessages((prev) => [...prev, { id: `error-${Date.now()}`, text: displayError, sender: 'bot' }]);
      setError(displayError);
    } finally {
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  return (
    <div className="chat-container">
      <div className="messages-area" aria-live="polite" aria-atomic="false">
        {messages.map((msg) => (
          <div key={msg.id} className={`message ${msg.sender}`}>
            <p>{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      {isLoading && <div className="typing-indicator" aria-label="Bot is typing">Bot is typing...</div>}
      {error && <div className="error-message" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="input-area">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error && e.target.value.trim()) setError(null);
          }}
          placeholder="Ask about frontend best practices..."
          aria-label="Type your message"
          disabled={isLoading}
          aria-describedby={error ? "input-error" : undefined}
        />
        <button type="submit" disabled={isLoading || !inputValue.trim()}>
          Send
        </button>
      </form>
      {error && <span id="input-error" className="visually-hidden">{error}</span>}
    </div>
  );
};

export default ChatBox;