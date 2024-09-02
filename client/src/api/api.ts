import axios from 'axios';

const API_BASE_URL = '/api';  // Always use /api as the base URL

export async function getUsers() {
    try {
        const response = await axios.get(`${API_BASE_URL}/users`, {
            withCredentials: true,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
}

export async function getUserFiles(userId: string) {
    try {
        const response = await axios.get(`${API_BASE_URL}/files/user/${userId}`, {
            withCredentials: true,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error fetching user files:', error);
        throw error;
    }
}


export async function uploadUserFiles(userId: string, files: File[]) {
    const formData = new FormData();
    files.forEach(file => {
        formData.append('files', file);
    });

    try {
        const response = await axios.post(`${API_BASE_URL}/files/upload/${userId}`, formData, {
            withCredentials: true,
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        });
        
        return response.data;
    } catch (error) {
        console.error('Error uploading user files:', error);
        throw error;
    }
}