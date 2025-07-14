'use client';

import { ChatToggleButton } from './chatbot/ChatToggleButton';
import { ChatWindow } from './chatbot/ChatWindow';
import { useChatbot } from '../src/hooks/useChatbot';

export default function Chatbot() {
  const {
    // State
    open,
    minimized,
    messages,
    inputText,
    isTyping,
    isConnected,
    showQuickReplies,
    messagesEndRef,

    // Actions
    setOpen,
    setMinimized,
    setInputText,
    handleSendMessage,
    handleKeyPress,
    handleSuggestionClick
  } = useChatbot();

  return (
    <>
      {/* Chatbot Toggle Button */}
      <ChatToggleButton
        isOpen={open}
        hasNewMessages={messages.length > 1}
        onClick={() => setOpen(!open)}
      />

      {/* Chat Window */}
      {open && (
        <ChatWindow
          isMinimized={minimized}
          isConnected={isConnected}
          messages={messages}
          isTyping={isTyping}
          showQuickReplies={showQuickReplies}
          inputText={inputText}
          messagesEndRef={messagesEndRef}
          onMinimize={() => setMinimized(!minimized)}
          onClose={() => setOpen(false)}
          onInputChange={setInputText}
          onSendMessage={handleSendMessage}
          onKeyDown={handleKeyPress}
          onSuggestionClick={handleSuggestionClick}
        />
      )}
    </>
  );
}
