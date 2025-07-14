interface QuickRepliesProps {
  onSuggestionClick: (suggestion: string) => void;
}

export const QuickReplies = ({ onSuggestionClick }: QuickRepliesProps) => {
  const suggestions = [
    'Phim sắp chiếu',
    'Giá vé',
    'Đặt vé như thế nào?',
    'Rạp chiếu phim'
  ];

  return (
    <div className="space-y-2">
      <p className="text-xs text-gray-500 dark:text-gray-400 text-center">Câu hỏi gợi ý:</p>
      <div className="flex flex-wrap gap-2 justify-center">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => onSuggestionClick(suggestion)}
            className="px-3 py-1 text-xs bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 rounded-full hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};
