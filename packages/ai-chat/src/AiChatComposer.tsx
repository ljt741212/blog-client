import { useState, useRef, useCallback, useEffect } from 'react';

interface AiChatComposerProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function AiChatComposer({ onSend, disabled }: AiChatComposerProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
  }, []);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="shrink-0">
      <div className="gradient-border rounded-xl bg-[#111b2e] px-4 py-3">
        <textarea
          ref={textareaRef}
          className="w-full bg-transparent text-sm text-[#e2e8f0] resize-none outline-none placeholder:text-[#7c8da5]"
          placeholder="输入您的问题，Shift + Enter 换行"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={2}
          disabled={disabled}
        />
        <div className="flex justify-end mt-2">
          <button
            className={`w-9 h-9 rounded-lg bg-[#4d94ff] flex items-center justify-center text-white transition-colors ${
              !value.trim() || disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-[#3b7eeb]'
            }`}
            onClick={handleSend}
            disabled={!value.trim() || disabled}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  );
}
