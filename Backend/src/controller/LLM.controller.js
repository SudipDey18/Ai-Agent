
import dotenv from 'dotenv';
dotenv.config();
const apiData = {
    apiKey: process.env.LLM_KEY || "",
    baseURL: process.env.BASE_URL || 'https://integrate.api.nvidia.com/v1/chat/completions',
}

export default async function llm(req, res) {
    try {
        const response = await fetch(apiData.baseURL, {
            method: "post",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiData.apiKey}`
            },
            body: JSON.stringify({
                "model": "bytedance/seed-oss-36b-instruct",
                messages: [{
                    role: "systemprompt",
                    content: process.env.SYSTEM_PROMPT || "you are a ai agent reply eveyone politely"
                }, ...req.body.query],
                "temperature": 1.1,
                "top_p": 0.95,
                "max_tokens": 4096,
                "thinking_budget": -1,
                "frequency_penalty": 0,
                "presence_penalty": 0,
                "stream": true,
            })
        })

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split("\n");
            buffer = lines.pop();

            for (const line of lines) {
                if (!line.trim()) continue;
                if (!line.startsWith("data:")) continue;

                const jsonStr = line.replace("data:", "").trim();

                if (jsonStr === "[DONE]") continue;

                const data = JSON.parse(jsonStr);
                const chunk = data.choices[0]?.delta;
                // console.log(chunk);

                res.write(
                    JSON.stringify({
                        data: chunk?.content || "",
                        thinking: !chunk?.content
                    }) + "\n"
                );
            }
        }

        return res.end();
    } catch (error) {
        return res.status(404).json({ error: true, message: "Something went wrong" });
    }
}
