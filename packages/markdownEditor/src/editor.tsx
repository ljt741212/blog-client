import { Editor, EditorProps } from '@bytemd/react';
import zhHans from 'bytemd/locales/zh_Hans.json';

import plugins from './plugins';

export interface MarkdownEditorProps extends EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function MarkdownEditor(props: MarkdownEditorProps) {
  return <Editor locale={zhHans} plugins={plugins} {...props} />;
}
