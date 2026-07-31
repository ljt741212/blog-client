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
      <div className="bg-[#1a1333] rounded-xl border border-[#2d2050] focus-within:border-[#7c5cfc] transition-colors px-3 py-2">
        <textarea
          ref={textareaRef}
          className="w-full bg-transparent text-sm text-[#e8e0f0] resize-none outline-none placeholder:text-[#8a7ca0]"
          placeholder="请输入您遇到的问题，使用 Shift + Enter 换行"
          value={value}
          onChange={e => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={disabled}
        />
        <div className="flex justify-end mt-1">
          <button
            className={`w-8 h-8 rounded-lg bg-gradient-to-r from-[#7c5cfc] to-[#e056a0] flex items-center justify-center text-white transition-opacity ${
              !value.trim() || disabled ? 'opacity-30 cursor-not-allowed' : 'hover:opacity-90'
            }`}
            onClick={handleSend}
            disabled={!value.trim() || disabled}
          >
            ↑
          </button>
        </div>
      </div>
      <p className="text-[11px] text-[#8a7ca0] mt-2 text-center">
        内容由 AI 生成，仅供参考，您据此所作判断及操作均由您自行承担责任。
      </p>
    </div>
  );
}
