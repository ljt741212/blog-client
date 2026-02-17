// import { useState, useEffect } from 'react';
// import { Editor, type EditorProps } from '@bytemd/react';
// import gfm from '@bytemd/plugin-gfm';
// import highlight from '@bytemd/plugin-highlight';
// import math from '@bytemd/plugin-math';
// import mediumZoom from '@bytemd/plugin-medium-zoom';
// import zhHans from 'bytemd/locales/zh_Hans.json';
// import gfm_zhHans from '@bytemd/plugin-gfm/locales/zh_Hans.json';
// import math_zhHans from '@bytemd/plugin-math/locales/zh_Hans.json';
// import 'bytemd/dist/index.css';
// import 'highlight.js/styles/github.css';
// import 'katex/dist/katex.css';
//
// const defaultPlugins = [
//     gfm({ locale: gfm_zhHans }),
//     highlight(),
//     math({ locale: math_zhHans }),
//     mediumZoom()
// ];
//
// interface MarkdownEditorProps extends Partial<Pick<EditorProps, 'plugins' | 'mode' | 'locale'>> {
//     value?: string;
//     onChange?: (value: string) => void;
//     /**
//      * 是否顯示全屏選項
//      * @default false
//      */
//     showFullscreen?: boolean;
//     /**
//      * 是否顯示預覽區
//      * @default false
//      */
//     showPreview?: boolean;
// }
//
// export function MarkdownEditor({
//     value = '',
//     onChange,
//     plugins = defaultPlugins,
//     showFullscreen = false,
//     showPreview = false,
//     mode = 'auto',
//     locale = zhHans
// }: MarkdownEditorProps) {
//     const [innerValue, setInnerValue] = useState(value);
//     useEffect(() => {
//         setInnerValue(value);
//     }, [value]);
//     // 自定義 locale，移除全屏相關的文本（如果不需要全屏功能）
//     const customLocale = showFullscreen
//         ? locale
//         : {
//             ...locale,
//             fullscreen: '',
//             exitFullscreen: '',
//         };
//
//     return (
//         <>
//             <Editor
//                 value={innerValue}
//                 plugins={plugins}
//                 locale={customLocale}
//                 mode={mode}
//                 onChange={(v: string) => {
//                     setInnerValue(v);
//                     onChange?.(v);
//                 }}
//             />
//         </>
//     );
// }
//
