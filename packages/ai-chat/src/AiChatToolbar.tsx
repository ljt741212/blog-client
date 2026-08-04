import {
  PlusOutlined,
  ClockCircleOutlined,
  ColumnWidthOutlined,
  FullscreenOutlined,
  FullscreenExitOutlined,
  SettingOutlined,
  CloseOutlined,
} from '@ant-design/icons';

interface AiChatToolbarProps {
  isFullscreen: boolean;
  isFloat: boolean;
  onNew: () => void;
  onHistory: () => void;
  onToggleFloat: () => void;
  onToggleFullscreen: () => void;
  onClose: () => void;
}

const btnClass =
  'w-8 h-8 flex items-center justify-center rounded-lg text-[#7c8da5] hover:text-[#e2e8f0] hover:bg-[#16223b] transition-colors cursor-pointer';

export default function AiChatToolbar({
  isFullscreen,
  isFloat,
  onNew,
  onHistory,
  onToggleFloat,
  onToggleFullscreen,
  onClose,
}: AiChatToolbarProps) {
  return (
    <div className="flex items-center gap-1">
      <button className={btnClass} title="新建会话" onClick={onNew}>
        <PlusOutlined />
      </button>
      <button className={btnClass} title="会话记录" onClick={onHistory}>
        <ClockCircleOutlined />
      </button>
      <button
        className={btnClass}
        title={isFloat ? '退出浮动' : '浮动模式'}
        onClick={onToggleFloat}
      >
        <ColumnWidthOutlined style={isFloat ? { color: '#4d94ff' } : undefined} />
      </button>
      <button
        className={btnClass}
        title={isFullscreen ? '退出全屏' : '全屏模式'}
        onClick={onToggleFullscreen}
      >
        {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </button>
      <button className={`${btnClass} cursor-default opacity-50`} title="设置（暂未开放）">
        <SettingOutlined />
      </button>
      <button className={btnClass} title="关闭" onClick={onClose}>
        <CloseOutlined />
      </button>
    </div>
  );
}
