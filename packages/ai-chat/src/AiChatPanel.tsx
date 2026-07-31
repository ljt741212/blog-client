import { useState, useEffect, useCallback, useRef } from 'react';

import { BorderBeam } from 'antd';
import Draggable from 'react-draggable';

import AiChatComposer from './AiChatComposer';
import AiChatConversationList from './AiChatConversationList';
import AiChatMessage from './AiChatMessage';
import AiChatToolbar from './AiChatToolbar';
import AiChatWelcome from './AiChatWelcome';
import './panel.css';
import { useChat } from './useChat';
import { useConversations } from './useConversations';

import type { AiChatApi } from './types';
import type { BorderBeamGradient } from 'antd';
import type { DraggableData, DraggableEvent } from 'react-draggable';

type PanelMode = 'default' | 'fullscreen' | 'float';

interface AiChatPanelProps {
  visible: boolean;
  onClose: () => void;
  api: AiChatApi;
}

export default function AiChatPanel({ visible, onClose, api }: AiChatPanelProps) {
  const [closing, setClosing] = useState(false);
  const [mode, setMode] = useState<PanelMode>('default');
  const [historyOpen, setHistoryOpen] = useState(false);
  const [dragBounds, setDragBounds] = useState({
    left: -5000,
    top: -5000,
    bottom: 5000,
    right: 5000,
  });
  const dragRef = useRef<HTMLDivElement>(null!);

  const { messages, status, conversationId, error, send, confirm, clear, loadHistory } = useChat({
    api,
  });

  const { conversations, loadList, remove } = useConversations({ api });

  useEffect(() => {
    if (visible && conversations.length === 0) {
      loadList();
    }
  }, [visible]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (visible && mode !== 'float') {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [visible, mode]);

  const onDragStart = (_event: DraggableEvent, uiData: DraggableData) => {
    const { clientWidth, clientHeight } = document.documentElement;
    const rect = dragRef.current?.getBoundingClientRect();
    if (!rect) return;
    setDragBounds({
      left: -rect.left + uiData.x,
      right: clientWidth - (rect.right - uiData.x),
      top: -rect.top + uiData.y,
      bottom: clientHeight - (rect.bottom - uiData.y),
    });
  };

  const handleClose = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 200);
  }, [onClose]);

  const handleToggleFloat = () => {
    setMode(prev => (prev === 'float' ? 'default' : 'float'));
  };

  const handleToggleFullscreen = () => {
    setMode(prev => (prev === 'fullscreen' ? 'default' : 'fullscreen'));
  };

  const handleNew = () => {
    clear();
    loadList();
  };

  const handleSelectConversation = async (id: number) => {
    await loadHistory(id);
    setHistoryOpen(false);
  };

  const handleDeleteConversation = async (id: number) => {
    await remove(id);
    if (String(id) === conversationId) {
      clear();
    }
  };

  if (!visible && !closing) return null;

  const isStreaming = status === 'streaming';
  const isConfirming = status === 'confirming';
  const showWelcome = messages.length === 0 && !isStreaming;

  const panelStyle = getPanelStyle(mode);
  const containerClass = closing ? 'ai-panel-exit' : 'ai-panel-enter';

  const beamColor: BorderBeamGradient = [
    { color: '#7c5cfc', percent: 0 },
    { color: '#e056a0', percent: 50 },
    { color: '#7c5cfc', percent: 100 },
  ];

  const toolArea = (
    <AiChatToolbar
      isFullscreen={mode === 'fullscreen'}
      isFloat={mode === 'float'}
      onNew={handleNew}
      onHistory={() => {
        loadList();
        setHistoryOpen(true);
      }}
      onToggleFloat={handleToggleFloat}
      onToggleFullscreen={handleToggleFullscreen}
      onClose={handleClose}
    />
  );

  const content = (
    <div className="w-full h-full">
      <BorderBeam color={beamColor} className="w-full h-full rounded-lg">
        <div
          className="flex flex-col w-full h-full rounded-lg overflow-hidden"
          style={{ backgroundColor: '#0f0a1a' }}
        >
          <div
            className={`drag-handle flex items-center justify-between px-4 py-3 shrink-0 ${mode === 'float' ? 'cursor-move' : ''}`}
          >
            <span className="text-base font-semibold bg-gradient-to-r from-[#7c5cfc] to-[#e056a0] bg-clip-text text-transparent">
              CX330 AI 助理
            </span>
            {toolArea}
          </div>

          <div className="h-px bg-[#2d2050] shrink-0" />

          <div className="flex-1 overflow-y-auto px-4 py-4">
            {showWelcome && <AiChatWelcome onSend={send} />}
            {messages.map((msg, i) => (
              <AiChatMessage
                key={msg.id}
                message={msg}
                streaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
                onConfirm={confirm}
              />
            ))}
            {error && (
              <div className="bg-[#f85149]/10 border border-[#f85149]/30 rounded-lg px-3 py-2 text-sm text-[#f85149] mb-4">
                {error}
              </div>
            )}
          </div>

          <div className="h-px bg-[#2d2050] shrink-0" />

          <div className="px-4 py-3">
            <AiChatComposer onSend={send} disabled={isStreaming || isConfirming} />
          </div>
        </div>
      </BorderBeam>

      <AiChatConversationList
        open={historyOpen}
        conversations={conversations}
        activeId={conversationId}
        onClose={() => setHistoryOpen(false)}
        onSelect={handleSelectConversation}
        onDelete={handleDeleteConversation}
      />
    </div>
  );

  return (
    <>
      {mode !== 'float' && mode !== 'fullscreen' && (
        <div
          className={`fixed inset-0 z-[998] bg-[rgba(0,0,0,0.4)] ${
            closing ? 'ai-backdrop-exit' : 'ai-backdrop-enter'
          }`}
          onClick={handleClose}
        />
      )}

      <div className={`fixed z-[999] rounded-lg ${containerClass}`} style={panelStyle}>
        <Draggable
          disabled={mode !== 'float'}
          handle=".drag-handle"
          bounds={dragBounds}
          nodeRef={dragRef}
          onStart={onDragStart}
        >
          <div ref={dragRef} style={{ width: '100%', height: '100%' }}>
            {content}
          </div>
        </Draggable>
      </div>
    </>
  );
}

function getPanelStyle(mode: PanelMode): React.CSSProperties {
  switch (mode) {
    case 'fullscreen':
      return { inset: 0, borderRadius: 0, overflow: 'hidden' };
    case 'float':
      return {
        left: 'calc(100vw - 440px)',
        top: 'calc(100vh - 520px)',
        width: 420,
        height: 500,
      };
    default:
      return {
        top: 120,
        right: 0,
        bottom: 0,
        width: 480,
      };
  }
}
