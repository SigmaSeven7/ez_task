import axios from 'axios';

const API_BASE_URL = '/api';


export async function getUsers() {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`);
        console.log('Users:', response);
        return response.data;
    } catch (error) {
        // Handle error
        console.error('Error fetching users:', error);
        throw error;
    }
}