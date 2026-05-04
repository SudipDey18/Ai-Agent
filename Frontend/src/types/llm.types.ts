export type message = {
    role: "user" | "assistant",
    content: string
}

export type askQuestionParams = {
    messages: message[],
    query: string,
    setMessages: React.Dispatch<React.SetStateAction<message[]>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
    setQuery: React.Dispatch<React.SetStateAction<string>>,
    setIsThinking: React.Dispatch<React.SetStateAction<0 | 1 | 2>>,
    setMarkdown: React.Dispatch<React.SetStateAction<string>>
}
