'use client';

import { Viewer, type ViewerProps } from 'markdownEditor';

export default function ArticleViewer(props: ViewerProps) {
  return <Viewer {...props} />;
}
