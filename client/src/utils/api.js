const API_BASE_URL = import.meta.env.PROD
    ? 'https://food-redistribute.onrender.com' // Replace with your actual Render URL later
    : 'http://localhost:5000';

export default API_BASE_URL;
