import { Viewer, ViewerProps } from '@bytemd/react';

import plugins from './plugins';
import './viewer.css';

export default function MarkdownView(props: ViewerProps) {
  return <Viewer plugins={plugins} {...props} />;
}
