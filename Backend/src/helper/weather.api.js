import dotenv from 'dotenv';
dotenv.config();

const API_key = process.env.WEATHER_API_KEY || "";

export async function get_weather(lat, lon) {
    const api_url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}`;
    try {
        let response = await fetch(api_url);
        let json_response = await response.json();
        if (!response?.ok) {
            throw new Error(json_response?.message || "Something went wrong!")
        }
        return ({ "success": true, "weatherData": JSON.stringify(json_response) });
    } catch (error) {
        console.log(error?.message);
        return ({ "success": false, "message": error?.message })
    }
}

// console.log(process.env.SYSTEM_PROMPT);