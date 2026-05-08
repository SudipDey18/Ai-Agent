import dotenv from 'dotenv';
dotenv.config();


export const apiData = {
    apiKey: process.env.LLM_KEY || "",
    baseURL: process.env.BASE_URL || 'https://integrate.api.nvidia.com/v1/chat/completions',
}

export const sum_tool = {
    "type": "function",
    "function": {
        "name": "sum_nums",
        "description": "Sum two numbers",
        "parameters": {
            "type": "object",
            "properties": {
                "num1": {
                    "type": "number",
                    "description": "numbers e.g. 54"
                },
                "num2": {
                    "type": "number",
                    "description": "numbers e.g. 78.6"
                }
            },
            "required": ["num1", "num2"]
        }
    }
}

export const weather_tool = {
    "type": "function",
    "function": {
        "name": "get_current_weather",
        "description": "Get the current weather, pincode is optional if present then return best result",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "object",
                    "properties": {
                        "place": "string",
                        "police_station": "String",
                        "pincode": "number"
                    },
                    "description": 'The county and country and pincode, e.g. {"police_station": "patrasayer","place": "hat-krishnanagar","pincode":722206}',
                    "required": ["place"]
                }
            },
            "required": ["location"]
        }
    }
}
