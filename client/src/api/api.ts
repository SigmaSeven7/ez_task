import axios from 'axios';


const API_BASE_URL = '/api';  // Always use /api as the base URL
import * as XLSX from 'xlsx';

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
      console.log(response.data);
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


export const getFileUpdates = async (userId: string, fileName: string): Promise<{ status: 'queued' | 'in-progress' | 'completed' }> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/files/updates/${userId}/${fileName}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching file updates:', error);
    throw error;
  }
};

export const uploadUserFiles = (userId: string, files: File[], onProgress: (fileName: string, progress: number) => void): Promise<any> => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();

    files.forEach(file => {
      formData.append('files', file);
    });

    xhr.open('POST', `${API_BASE_URL}/files/upload/${userId}`);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentCompleted = Math.round((event.loaded * 100) / event.total);
        files.forEach(file => {
          onProgress(file.name, percentCompleted);
        });
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(`HTTP Error: ${xhr.status}`));
      }
    };

    xhr.onerror = () => {
      reject(new Error('Network Error'));
    };

    xhr.send(formData);
  });
};



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
  
  // export async function downloadFile(fileId: number, fileName: string) {
  //   try {
  //     const response = await axios.get(`${API_BASE_URL}/files/${fileId}/download`, {
  //       responseType: 'blob',
  //       withCredentials: true,
  //     });
      
  //     const url = window.URL.createObjectURL(new Blob([response.data]));
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', fileName);
  //     document.body.appendChild(link);
  //     link.click();
  //     link.remove();
  //   } catch (error) {
  //     console.error('Error downloading file:', error);
  //     throw error;
  //   }
  // }

  export async function downloadFile(fileId: number, fileName: string) {
    try {
      const response = await axios.get(`${API_BASE_URL}/files/${fileId}/download`, {
        responseType: 'text', // Expecting base64 encoded string
        withCredentials: true,
      });
  
      // Decode base64 string
      const base64Data = response.data;
      const binaryString = atob(base64Data);
      const binaryData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        binaryData[i] = binaryString.charCodeAt(i);
      }
  
      // Parse binary data to workbook
      const workbook = XLSX.read(binaryData, { type: 'array' });
  
      // Create a Blob from the workbook
      const workbookBlob = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });
  
      // Convert binary string to Blob
      const buffer = new ArrayBuffer(workbookBlob.length);
      const view = new Uint8Array(buffer);
      for (let i = 0; i < workbookBlob.length; i++) {
        view[i] = workbookBlob.charCodeAt(i) & 0xFF;
      }
      const blob = new Blob([buffer], { type: 'application/octet-stream' });
  
      // Create a download link and trigger the download
      const url = window.URL.createObjectURL(blob);
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
  


