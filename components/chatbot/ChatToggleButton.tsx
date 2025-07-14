interface ChatToggleButtonProps {
  isOpen: boolean;
  hasNewMessages: boolean;
  onClick: () => void;
}

export const ChatToggleButton = ({ isOpen, hasNewMessages, onClick }: ChatToggleButtonProps) => {
  return (
    <div
      className="fixed bottom-4 right-4 z-50 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative">
        <div className="w-14 h-14 bg-gradient-to-r from-primary-500 to-primary-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center group-hover:scale-110">
          {isOpen ? (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          )}
        </div>
        
        {/* Notification Badge */}
        {!isOpen && hasNewMessages && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-xs text-white font-bold">!</span>
          </div>
        )}
      </div>
    </div>
  );
};
