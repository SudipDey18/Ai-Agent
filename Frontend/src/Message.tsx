import MarkdownPreview from '@uiw/react-markdown-preview';
import '@uiw/react-markdown-preview/github.css';
import { HashLoader } from 'react-spinners';

function Message({ markdown, isThinking }: { markdown: string, isThinking: boolean }) {

    if (isThinking && !markdown) return (<div className='p-2 mt-2 max-w-fit justify-center items-center bg-slate-200 border border-slate-500 rounded-2xl text-left flex font-sans'>
        <span className='pr-2'>Thinking</span><HashLoader size={15} loading={true}/>
    </div>)

    return (
        <MarkdownPreview
            source={markdown}
            style={{ padding: 16, backgroundColor: 'transparent', color: 'black' }}
            className='text-start bg-transparent max-w-full'
        />
    )
}

export default Message