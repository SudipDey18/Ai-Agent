import type { askQuestionParams, message } from "../types/llm.types";

const baseUrl = import.meta.env.VITE_API_BASE_URL || "http://192.168.1.21:3000";

export async function askQuestion({ messages, query, setMessages, setIsLoading, setQuery, setIsThinking, setMarkdown }: askQuestionParams) {

    setIsLoading(true);
    let latestQuery: message[] = [...messages, {
        role: "user",
        content: query
    }]

    setMessages(latestQuery);
    setQuery("");

    try {
        const response = await fetch(baseUrl + "/api/ai", {
            method: "post",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ query: latestQuery })
        });
        const reader = response?.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let finalText = "";

        setMessages((prev: message[]) => {
            return [...prev, {
                role: "assistant",
                content: ""
            }]
        });

        while (true) {
            const response = await reader?.read();
            const { done, value }: any = response;

            if (done) {
                break;
            };

            const buffer = decoder.decode(value, { stream: true }).trim();
            const lines = buffer.split("\n");

            for (const line of lines) {
                if (!line.trim()) continue;
                if (!line.startsWith('{"data":')) continue;
                const jsonStr = JSON.parse(line.trim());

                if (jsonStr.thinking) {
                    setIsThinking(true);
                } else {
                    setIsThinking(false);
                    finalText += jsonStr.data;
                    setMarkdown(finalText);
                }
            }
        }

        setMessages((prev: message[]) => {
            let messageArr = prev;
            messageArr[(messageArr.length - 1)].content = finalText || "No response received!";
            return messageArr;
        });

        setMarkdown("");
        setIsThinking(false);
        setIsLoading(false);
        return { status: response.status };
    } catch (error) {
        console.log(error);
        setMarkdown("");
        setIsThinking(false);
        setIsLoading(false);
        setMessages((prev: message[]) => {
            let messageArr = prev;
            messageArr[(messageArr.length - 1)].content = "No response received!";
            return messageArr;
        });
        return error;
    }
}