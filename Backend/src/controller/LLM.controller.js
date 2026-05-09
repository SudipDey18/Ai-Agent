
import dotenv from 'dotenv';
import llm_api_call from '../helper/llm.api.js';
import { get_lat_log } from '../helper/location.api.js';
import { get_weather } from '../helper/weather.api.js';
dotenv.config();

export default async function llm(req, res) {
    // console.log(req.body);
    let toolArgs = "";
    let tool = "";
    let user_context = req.body.query;

    try {
        while (true) {
            const response = await llm_api_call(user_context);
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
                    // console.log(data.choices[0].delta);

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
                break;
            } else {
                let toolArgsJson = JSON.parse(toolArgs)
                // console.log("👹");
                // console.log(toolArgsJson);
                user_context = [...user_context, {
                    role: "assistant",
                    content: `tool_calls: {tool: ${tool}, arguments:${toolArgs}`
                }];
                toolArgsJson = JSON.parse(toolArgsJson.location.replace(/'/g, '"'));
                const location_response = await get_lat_log(toolArgsJson);
                console.log(location_response);
                const { lat, lon } = location_response.response[0]
                const weather_response = await get_weather(lat, lon);
                console.log(weather_response);
                user_context = [...user_context, {
                    role: "user",
                    content: toolArgsJson.pincode? `todayCurrentWeatherData:${weather_response.weatherData}` : `{todayCurrentWeatherData:${weather_response.weatherData},user_message:"give weather report if present and also give this messageuse pincode for better weather report"}`
                }]
                continue;
            }
        }
        return res.end();
    } catch (error) {
        console.log(error);
        return res.status(404).json({ error: true, message: "Something went wrong" });
    }
}
