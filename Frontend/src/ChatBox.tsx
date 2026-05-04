import Message from "./Message";
import { useState } from "react";
import UserChat from "./UserChat";
import { ScaleLoader } from "react-spinners";
import type { message } from "./types/llm.types.js";
import { askQuestion } from "./helper/LLM.helper.js";
import toast from "react-hot-toast";

function ChatBox() {
    const [markdown, setMarkdown] = useState<string>("");
    const [messages, setMessages] = useState<message[]>([]);
    const [query, setQuery] = useState<string>("");
    const [isThinking, setIsThinking] = useState<0 | 1 | 2>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const queryHandeler = async () => {
        let resp: any = await askQuestion({ messages, setMarkdown, setMessages, setIsThinking, setIsLoading, query, setQuery });
        if (resp?.error || resp?.status > 201) {
            console.log(resp);
            toast.error('Something went wrong!');
        }
    }

    return (
        <div className='w-5/6 max-sm:w-[95%] lg:w-[70%] h-[95%] flex flex-col items-center bg-(--code-bg) border border-(--accent) rounded-2xl mt-5 py-5 overflow-hidden'>
            <div className='w-[90%] h-full flex flex-col overflow-y-auto hide-scrollbar '>
                {messages?.map((item, index) => {
                    if (item.role === "user") {
                        return <UserChat message={item.content} key={index} />
                    } else {
                        return <Message markdown={item.content || markdown} key={index} isThinking={isThinking} />
                    }
                })}
            </div>
            <div className='mt-auto mb-2 flex items-center w-[90%] h-[15%]'>
                <div className='w-full h-fit flex items-center bg-purple-200 border-2 rounded-2xl border-(--accent)'>

                    <textarea value={query} rows={1}
                        onChange={(e) => {
                            setQuery(e.target.value);

                            const el = e.target;
                            el.style.height = "auto";

                            const style = window.getComputedStyle(el);
                            const lineHeight = parseInt(style.lineHeight);

                            const maxRows = 2;
                            const maxHeight = lineHeight * maxRows;

                            el.style.height = Math.min(el.scrollHeight, maxHeight) + "px";
                        }}
                        className='p-1 my-1 w-full max-h-[98%] h-fit font-mono mx-2 border-0 scroll-auto outline-0 text-start resize-none hide-scrollbar'
                        placeholder="Ask anything..."
                    />
                </div>
                <button className='w-10 h-10 rounded-full bg-green-300 hover:bg-green-500 hover:scale-120 relative left-3 flex justify-center items-center disabled:opacity-30 disabled:hover:scale-0' disabled={isLoading} onClick={() => queryHandeler()}>
                    {!isLoading ? (
                        <span className="text-xl">➤</span>
                    ) : (

                        <ScaleLoader barCount={4} height={15} width={3} loading={isLoading} />
                    )}
                </button>
            </div>
        </div>
    )
}

export default ChatBox