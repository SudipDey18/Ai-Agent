import MarkdownPreview from '@uiw/react-markdown-preview';
import '@uiw/react-markdown-preview/markdown.css';
import { HashLoader, SyncLoader } from 'react-spinners';

function Message({ markdown, isThinking }: { markdown: string, isThinking: 0 | 1 | 2 }) {

    if(isThinking === 1 && !markdown) <SyncLoader color='#000000' loading={isThinking === 1} size={18} />

    if (isThinking === 2 && !markdown) return (<div className='p-2 mt-2 max-w-fit justify-center items-center bg-slate-200 border border-slate-500 rounded-2xl text-left flex font-sans'>
        <span className='pr-2'>Thinking</span><HashLoader size={15} loading={true} />
    </div>)

    return (
        <MarkdownPreview
            source={markdown}
            style={{ backgroundColor: 'transparent', color: 'black' }}
            className='text-start bg-transparent max-w-full custom-markdown px-4 pb-4'
        />
    )
}

export default Message