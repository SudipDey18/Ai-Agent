import dotenv from "dotenv";
dotenv.config();

const api_key = process.env.LOCATION_API_KEY || "";

async function location_api_call(data) {
    try {
        const apiString = `https://geocode.maps.co/search?q=${data}&format=json&api_key=${api_key}`;
        console.log(apiString);

        let resp = await fetch(apiString);
        if (!resp) {
            throw new Error("location api error.");
        }
        return resp.json();
    } catch (error) {
        throw error;
    }
}

export async function get_lat_log(location) {
    let query_data;
    // console.log(location);
    
    try {
        if (!api_key) throw error("Api key not present");
        if (location?.pincode) {
            query_data = location.pincode;
        } else if (location?.place) {
            query_data = location.place;
        } else {
            query_data = location.police_station;
        }

        let response = await location_api_call(query_data);
        // console.log(response);
        
        if (response.length <= 0) {
            if (location?.police_station) {
                query_data = location.police_station;
                response = await location_api_call(query_data);
                if (!response || response.length <= 0) {
                    throw new Error("Please give correct address or pincode for getting correct weather.");
                } else {
                    return { "success": true, response };
                }
            } else {
                throw new Error("Please give correct address or pincode for getting correct weather.");
            }
        } else {
            return { "success": true, response };
        }
    } catch (error) {
        console.log("Location API:", error.message);
        return { success: false, message: error.message || "Something went wrong" }
    }
}