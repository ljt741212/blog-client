interface Suggestion {
  label: string;
  prompt: string;
}

const suggestions: Suggestion[] = [
  { label: '帮我总结最近的文章', prompt: '帮我总结最近发布的文章' },
  { label: '审核所有待处理的评论', prompt: '帮我审核所有待处理的评论' },
  { label: '查看最近的流量数据', prompt: '帮我查看最近的流量数据怎么样' },
  { label: '写一篇关于 React 19 的文章', prompt: '写一篇关于 React 19 的文章' },
  { label: '帮我优化博客的 SEO', prompt: '帮我优化博客的 SEO 设置' },
];

interface AiChatWelcomeProps {
  onSend: (message: string) => void;
}

export default function AiChatWelcome({ onSend }: AiChatWelcomeProps) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center gap-8 px-8 py-12">
      <div className="text-center">
        <p className="text-2xl font-bold text-[#e8e0f0]">你好，我是</p>
        <p className="text-2xl font-bold bg-gradient-to-r from-[#7c5cfc] to-[#e056a0] bg-clip-text text-transparent">
          CX330 AI 助理
        </p>
      </div>

      <div className="w-full max-w-sm bg-[#1a1333] border border-[#2d2050] rounded-xl p-4">
        <p className="text-sm font-semibold bg-gradient-to-r from-[#7c5cfc] to-[#e056a0] bg-clip-text text-transparent mb-3">
          推荐解决方案
        </p>
        <div className="flex flex-col">
          {suggestions.map((s, i) => (
            <button
              key={i}
              className="text-sm text-[#e8e0f0] cursor-pointer hover:text-[#7c5cfc] transition-colors py-2 border-b border-[#2d2050] last:border-b-0 text-left"
              onClick={() => onSend(s.prompt)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
