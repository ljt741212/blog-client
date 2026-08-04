import { useState, useEffect, useCallback, useRef } from 'react';

import Draggable from 'react-draggable';

import AiChatComposer from './AiChatComposer';
import AiChatConversationList from './AiChatConversationList';
import AiChatMessage from './AiChatMessage';
import AiChatToolbar from './AiChatToolbar';
import './panel.css';
import { useChat } from './useChat';
import { useConversations } from './useConversations';

import type { AiChatApi } from './types';
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
    if (visible && conversations.length === 0) loadList();
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

  if (!visible && !closing) return null;

  const isStreaming = status === 'streaming';
  const isConfirming = status === 'confirming';
  const panelStyle = getPanelStyle(mode);

  return (
    <>
      {mode !== 'float' && mode !== 'fullscreen' && (
        <div
          className={`fixed inset-0 z-[998] bg-[rgba(0,0,0,0.4)] ${closing ? 'ai-backdrop-exit' : 'ai-backdrop-enter'}`}
          onClick={handleClose}
        />
      )}

      <div
        className={`fixed z-[999] rounded-lg ${closing ? 'ai-panel-exit' : 'ai-panel-enter'}`}
        style={panelStyle}
      >
        <Draggable
          disabled={mode !== 'float'}
          handle=".drag-handle"
          bounds={dragBounds}
          nodeRef={dragRef}
          onStart={onDragStart}
        >
          <div
            ref={dragRef}
            className="flex flex-col w-full h-full rounded-lg overflow-hidden border border-[#1e3050]"
            style={{ backgroundColor: '#0b1424', paddingBottom: 12 }}
          >
            <div
              className={`drag-handle flex items-center justify-between px-4 py-3 shrink-0 ${mode === 'float' ? 'cursor-move' : ''}`}
            >
              <span className="text-base font-semibold bg-gradient-to-r from-[#4d94ff] to-[#5eead4] bg-clip-text text-transparent">
                AI 助理
              </span>
              <AiChatToolbar
                isFullscreen={mode === 'fullscreen'}
                isFloat={mode === 'float'}
                onNew={() => {
                  clear();
                  loadList();
                }}
                onHistory={() => {
                  loadList();
                  setHistoryOpen(true);
                }}
                onToggleFloat={() => setMode(prev => (prev === 'float' ? 'default' : 'float'))}
                onToggleFullscreen={() =>
                  setMode(prev => (prev === 'fullscreen' ? 'default' : 'fullscreen'))
                }
                onClose={handleClose}
              />
            </div>

            <div className="h-px bg-[#1e3050] shrink-0" />

            <div className="flex-1 overflow-y-auto px-4 py-4">
              {messages.map((msg, i) => (
                <AiChatMessage
                  key={msg.id}
                  message={msg}
                  streaming={isStreaming && i === messages.length - 1 && msg.role === 'assistant'}
                  onConfirm={confirm}
                />
              ))}
              {error && (
                <div className="bg-[#f97066]/10 border border-[#f97066]/30 rounded-lg px-3 py-2 text-sm text-[#f97066] mb-4">
                  {error}
                </div>
              )}
            </div>

            <div className="h-px bg-[#1e3050] shrink-0" />

            <div className="px-4 pt-3">
              <AiChatComposer onSend={send} disabled={isStreaming || isConfirming} />
            </div>
          </div>
        </Draggable>
      </div>

      <AiChatConversationList
        open={historyOpen}
        conversations={conversations}
        activeId={conversationId}
        onClose={() => setHistoryOpen(false)}
        onSelect={async id => {
          await loadHistory(id);
          setHistoryOpen(false);
        }}
        onDelete={async id => {
          await remove(id);
          if (String(id) === conversationId) clear();
        }}
      />
    </>
  );
}

function getPanelStyle(mode: PanelMode): React.CSSProperties {
  switch (mode) {
    case 'fullscreen':
      return { inset: 0, borderRadius: 0, overflow: 'hidden' };
    case 'float':
      return { left: 'calc(100vw - 440px)', top: 'calc(100vh - 520px)', width: 420, height: 500 };
    default:
      return { top: 120, right: 0, bottom: 0, width: 480 };
  }
}
