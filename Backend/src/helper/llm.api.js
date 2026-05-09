import { apiData, sum_tool, weather_tool } from "../../config.data.js";

export default async function llm_api_call(queries) {
    // console.log(apiData);
    console.log(sum_tool ? "true" : "false");
    const response = await fetch(apiData.baseURL, {
        method: "post",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiData.apiKey}`
        },
        body: JSON.stringify({
            "model": process.env.AI_MODEL || "bytedance/seed-oss-36b-instruct",
            messages: [{
                role: "systemprompt",
                content: process.env.SYSTEM_PROMPT || "you are a ai agent reply eveyone politely"
            }, ...queries],
            "temperature": 1.1,
            "top_p": 0.95,
            "tools": [sum_tool, weather_tool],
            "tool_choice": "auto",
            "max_tokens": 2048,
            "thinking_budget": 1024,
            "frequency_penalty": 0,
            "presence_penalty": 0,
            "stream": true,
        })
    });

    // console.log(response);
    return response;
}