import axios from 'axios';
require('dotenv').config();

const apiKey = process.env.JSEARCH_API_KEY;
const apiHost = process.env.JSEARCH_API_HOST;

const options = {
    method: 'GET',
    url: 'https://jsearch.p.rapidapi.com/search',
    headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': apiHost
    },
    params: {
        query: '*',
        page: '1',
        num_pages: '1',
        country: 'us',
        date_posted: 'all'
    }
};

export const getJSearchJobs = async () => {
    console.log("getJSearchJobs function called");
    try {
        const response = await axios.request(options);
        console.log("jSearch API response data: ", response.data);
        const data = response.data;
        if (Array.isArray(data)) {
            return data;
        } else if (data) {
            return [data];
        } else {
            return [];
        }
    } catch (error) {
        console.error("Error fetching jSearch jobs:", error);
        return [];
    }
}