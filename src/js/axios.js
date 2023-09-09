import axios, { Axios } from 'axios';

axios.defaults.baseURL = 'https://pixabay.com/api/';
async function serviceSearch(searchQuery, page) {
    const params = new URLSearchParams({
        key: '39342473-635130f0c1fb6ae6ad40722d8',
        q: searchQuery,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: 'true',
        page: page,
        per_page: '40'

    })
    const response = await axios.get(`?${params}`);
    return response.data
}
export { serviceSearch };