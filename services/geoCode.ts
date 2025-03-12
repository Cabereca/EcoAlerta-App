import axios from 'axios';

const geoCodeApi = axios.create();

geoCodeApi.defaults.baseURL = process.env.EXPO_GEOCODE_API_URL || 'https://nominatim.openstreetmap.org`';

export default geoCodeApi;
