import axios from 'axios';
require('dotenv').config();

const apiKey = process.env.YC_JOBS_API_KEY;
const apiHost = process.env.YC_JOBS_API_HOST;

const options = {
  method: 'GET',
  url: 'https://free-y-combinator-jobs-api.p.rapidapi.com/active-jb-7d',
  headers: {
    'x-rapidapi-key': apiKey,
    'x-rapidapi-host': apiHost
  }
};

export const getYCJobs = async () => {
  console.log("getYCJobs function called");
  try {
    const response = await axios.request(options);
    console.log("YC Jobs API Response:", response.data);
    const data = response.data;
    if (Array.isArray(data)) {
      return data;
    } else if (data) {
      return [data];
    } else {
      return [];
    }
  } catch (error) {
    console.error("Error fetching YC Jobs:", error);
    return [];
  }
};
