import { useState, useRef, useCallback, useEffect } from 'react';

import { RobotOutlined, CloseOutlined, PlusOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import Draggable from 'react-draggable';

import type { Category } from '~/types/category';
import type { Tag } from '~/types/tag';

import EditorAiPanel from './EditorAiPanel';

import type { FormInstance } from 'antd';
import type { DraggableData, DraggableEvent } from 'react-draggable';

interface Props {
  form: FormInstance;
  categories: Category[];
  tags: Tag[];
}

const DEFAULT_W = 440;
const DEFAULT_H = 500;
const MIN_W = 340;
const MIN_H = 360;
const MAX_W = 640;
const MAX_H = 800;
const GAP = 24;

export default function FloatingAiPanel({ form, categories, tags }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [chatKey, setChatKey] = useState(0);
  const [size, setSize] = useState({ w: DEFAULT_W, h: DEFAULT_H });
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);
  const resizing = useRef<{ sx: number; sy: number; sw: number; sh: number } | null>(null);

  const clampPos = useCallback(
    (x: number, y: number, w: number, h: number) => ({
      x: Math.max(0, Math.min(x, window.innerWidth - w)),
      y: Math.max(0, Math.min(y, window.innerHeight - h - GAP)),
    }),
    []
  );

  const open = () => {
    const w = size.w;
    const h = size.h;
    setPos(clampPos(window.innerWidth - w - GAP, window.innerHeight - h - GAP, w, h));
    setExpanded(true);
  };

  const close = () => setExpanded(false);

  const onDrag = useCallback(
    (_e: DraggableEvent, data: DraggableData) => {
      setPos(clampPos(data.x, data.y, size.w, size.h));
    },
    [size, clampPos]
  );

  const onResizeStart = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      resizing.current = { sx: e.clientX, sy: e.clientY, sw: size.w, sh: size.h };

      const onMove = (ev: MouseEvent) => {
        if (!resizing.current) return;
        const dw = ev.clientX - resizing.current.sx;
        const dh = ev.clientY - resizing.current.sy;
        const nw = Math.min(MAX_W, Math.max(MIN_W, resizing.current.sw + dw));
        const nh = Math.min(MAX_H, Math.max(MIN_H, resizing.current.sh + dh));
        setSize({ w: nw, h: nh });
        setPos(prev => clampPos(prev.x, prev.y, nw, nh));
      };

      const onUp = () => {
        resizing.current = null;
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    },
    [size, clampPos]
  );

  useEffect(() => {
    if (!expanded) return;
    const onWindowResize = () => setPos(prev => clampPos(prev.x, prev.y, size.w, size.h));
    window.addEventListener('resize', onWindowResize);
    return () => window.removeEventListener('resize', onWindowResize);
  }, [expanded, size, clampPos]);

  return (
    <>
      {/* Collapsed: floating orb */}
      <button
        onClick={open}
        className="fixed z-50 flex h-12 w-12 items-center justify-center rounded-full bg-[#2563eb] text-white shadow-lg shadow-blue-500/20 transition-all duration-200 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/30"
        style={{ right: GAP, bottom: GAP }}
        title="AI 写作助手"
        aria-label="打开 AI 写作助手"
      >
        <span
          className="absolute inset-0 animate-ping rounded-full border border-blue-400/40"
          style={{ animationDuration: '3s' }}
        />
        <RobotOutlined className="relative text-xl" />
      </button>

      {/* Expanded: floating window */}
      {expanded && (
        <Draggable handle=".ai-panel-handle" nodeRef={nodeRef} position={pos} onDrag={onDrag}>
          <div
            ref={nodeRef}
            className="fixed z-50 flex flex-col overflow-hidden rounded-xl bg-white"
            style={{
              left: 0,
              top: 0,
              width: size.w,
              height: size.h,
              boxShadow:
                '0 0 0 1px rgba(0,0,0,0.04), 0 4px 8px rgba(15,23,42,0.04), 0 18px 40px rgba(15,23,42,0.12)',
            }}
          >
            {/* Drag handle header */}
            <div className="ai-panel-handle flex shrink-0 cursor-move select-none items-center justify-between border-b border-[#e2e8f0] bg-white px-4 py-2.5">
              <div className="flex items-center gap-2.5">
                <div className="h-[3px] w-12 rounded-full bg-gradient-to-r from-[#4d94ff] to-[#5eead4]" />
                <span className="text-sm font-semibold text-[#0f172a]">AI 写作助手</span>
              </div>
              <div className="flex items-center gap-1">
                <Button
                  type="text"
                  size="small"
                  icon={<PlusOutlined />}
                  onClick={() => setChatKey(k => k + 1)}
                  title="新对话"
                />
                <button
                  onClick={close}
                  className="flex h-7 w-7 items-center justify-center rounded-md text-[#94a3b8] transition-colors hover:bg-[#f1f5f9] hover:text-[#475569]"
                  aria-label="关闭"
                >
                  <CloseOutlined className="text-xs" />
                </button>
              </div>
            </div>

            {/* Chat body */}
            <div className="min-h-0 flex-1 overflow-hidden bg-white px-3">
              <EditorAiPanel key={chatKey} form={form} categories={categories} tags={tags} />
            </div>

            {/* Resize handle */}
            <div
              className="absolute bottom-0 right-0 flex h-6 w-6 cursor-se-resize items-end justify-end p-0.5 group"
              onMouseDown={onResizeStart}
            >
              <svg
                viewBox="0 0 16 16"
                className="h-3.5 w-3.5 text-[#cbd5e1] transition-colors group-hover:text-[#94a3b8]"
              >
                <path
                  d="M2 14 L14 14 L14 2"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
        </Draggable>
      )}
    </>
  );
}
