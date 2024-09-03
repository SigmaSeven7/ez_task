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


export async function getFileContents(fileId: number) {
    try {
      const response = await axios.get(`${API_BASE_URL}/files/${fileId}/contents`);
      return response.data;
    } catch (error) {
      console.error('Error fetching file contents:', error);
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


// export async function uploadUserFiles(userId: string, files: File[]) {
//     const formData = new FormData();
//     files.forEach(file => {
//         formData.append('files', file);
//     });

//     try {
//         const response = await axios.post(`${API_BASE_URL}/files/upload/${userId}`, formData, {
//             withCredentials: true,
//             headers: {
//                 'Accept': 'application/json',
//                 'Content-Type': 'multipart/form-data'
//             }
//         });
        
//         return response.data;
//     } catch (error) {
//         console.error('Error uploading user files:', error);
//         throw error;
//     }
// }

export async function uploadUserFiles(userId: string, files: File[]) {
  const formData = new FormData();
  files.forEach(file => {
      formData.append('files', file, file.name);
  });
  console.log('formData:', formData);
  try {
      const response = await axios.post(`${API_BASE_URL}/files/upload/${userId}`, formData, {
          withCredentials: true,
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'multipart/form-data'
          },
          // Add this to ensure the entire file is sent
          maxContentLength: Infinity,
          maxBodyLength: Infinity
      });
     
      return response.data;
  } catch (error) {
      console.error('Error uploading user files:', error);
      throw error;
  }
}


export async function deleteFile(fileId: number) {
    try {
      const response = await axios.delete(`${API_BASE_URL}/files/${fileId}`, {
        withCredentials: true,
        headers: {
          'Accept': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
    }
  }
  
  export async function downloadFile(fileId: number, fileName: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/files/${fileId}/download`, {
        responseType: 'blob',
        withCredentials: true,
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading file:', error);
      throw error;
    }
  }