
import dotenv from 'dotenv';
import llm_api_call from '../helper/llm.api.js';
dotenv.config();

export default async function llm(req, res) {
    // console.log(req.body);
    let toolArgs = "";
    let tool = "";

    try {
        // do {
            const response = await llm_api_call(req.body.query);
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let buffer = "";
            let data;

            while (true) {

                const llmResponse = await reader.read();
                const { done, value } = llmResponse;
                if (done) break;
                buffer += decoder.decode(value, { stream: true });

                const lines = buffer.split("\n");
                buffer = lines.pop();

                for (const line of lines) {
                    if (!line.trim()) continue;
                    if (!line.startsWith("data:")) continue;

                    const jsonStr = line.replace("data:", "").trim();

                    if (jsonStr === "[DONE]") continue;

                    data = JSON.parse(jsonStr);
                    const chunk = data.choices[0]?.delta;
                    console.log(data.choices[0]);

                    if (chunk.tool_calls) {
                        tool += chunk.tool_calls[0]?.function?.name || "";
                        toolArgs += chunk.tool_calls[0]?.function?.arguments || ""
                    }

                    res.write(
                        JSON.stringify({
                            data: chunk?.content || "",
                            thinking: !chunk?.content,
                            toolCalling: (data.choices[0].finish_reason === "tool_calls")
                        }) + "\n"
                    );
                }
            }

            if (data.choices[0].finish_reason === "stop") {
                return res.end();
            } else {


            }
        // } while ()
    } catch (error) {
        console.log(error);
        return res.status(404).json({ error: true, message: "Something went wrong" });
    }
}
