import 'bytemd/dist/index.css';
import 'juejin-markdown-themes/dist/juejin.min.css';
import breaks from '@bytemd/plugin-breaks';
import footnotes from '@bytemd/plugin-footnotes';
import frontmatter from '@bytemd/plugin-frontmatter';
import gemoji from '@bytemd/plugin-gemoji';
import gfm from '@bytemd/plugin-gfm';
import gfm_zhHans from '@bytemd/plugin-gfm/locales/zh_Hans.json';
import highlight from '@bytemd/plugin-highlight';
import highlightSsr from '@bytemd/plugin-highlight-ssr';
import math_zhHans from '@bytemd/plugin-math/locales/zh_Hans.json';
import math from '@bytemd/plugin-math-ssr';
import mediumZoom from '@bytemd/plugin-medium-zoom';
import mermaid from '@bytemd/plugin-mermaid';
import mermaid_zhHans from '@bytemd/plugin-mermaid/locales/zh_Hans.json';
import 'highlight.js/styles/monokai-sublime.css';

const plugins = [
  breaks(),
  frontmatter(),
  gemoji(),
  gfm({ locale: gfm_zhHans }),
  math({ locale: math_zhHans }),
  highlightSsr(),
  mermaid({ locale: mermaid_zhHans }),
  mediumZoom(),
  footnotes(),
  highlight(),
];

export default plugins;
