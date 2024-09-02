// import React, { useEffect, useState, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import { useDropzone } from 'react-dropzone';
// import { getUserFiles } from '../../api/api';  // Ensure this path is correct

// const UserFiles: React.FC = () => {
//   const { u_id } = useParams<{ u_id: string }>();
//   const [files, setFiles] = useState<any[]>([]);
  
//   console.log(u_id);  // Ensure u_id is correctly logged

//   useEffect(() => {
//     const fetchUserFiles = async () => {
//       try {
//         const filesData = await getUserFiles(u_id as string);
//         setFiles(filesData);
//         console.log('User files:', filesData);
//       } catch (error) {
//         console.error('Error fetching user files:', error);
//       }
//     };

//     if (u_id) {
//       fetchUserFiles();
//     }
//   }, [u_id]);

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     console.log('Files dropped:', acceptedFiles);
//     // Handle file upload logic here
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

//   return (
//     <div>
//       <h1>User Files</h1>
//       {files.length > 0 ? (
//         <ul>
//           {files.map((file, index) => (
//             <li key={index}>{file.name}</li>
//           ))}
//         </ul>
//       ) : (
//         <p>No files uploaded yet.</p>
//       )}
//       <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '20px' }}>
//         <input {...getInputProps()} />
//         {isDragActive ? (
//           <p>Drop the files here ...</p>
//         ) : (
//           <p>Drag 'n' drop some files here, or click to select files</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserFiles;

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { getUserFiles, uploadUserFiles } from '../../api/api';  // Ensure this path is correct

const UserFiles: React.FC = () => {
  const { u_id } = useParams<{ u_id: string }>();
  const [files, setFiles] = useState<any[]>([]);
  
  console.log(u_id);  // Ensure u_id is correctly logged

  useEffect(() => {
    const fetchUserFiles = async () => {
      try {
        const filesData = await getUserFiles(u_id as string);
        setFiles(filesData);
        console.log('User files:', filesData);
      } catch (error) {
        console.error('Error fetching user files:', error);
      }
    };

    if (u_id) {
      fetchUserFiles();
    }
  }, [u_id]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    try {
      const response = await uploadUserFiles(u_id as string, acceptedFiles);
      console.log('Upload response:', response);
      // Optionally, refresh the file list after upload
      const filesData = await getUserFiles(u_id as string);
      setFiles(filesData);
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }, [u_id]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div>
      <h1>User Files</h1>
      {files.length > 0 ? (
        <ul>
          {files.map((file, index) => (
            <li key={index}>{file.name}</li>
          ))}
        </ul>
      ) : (
        <p>No files uploaded yet.</p>
      )}
      <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '20px' }}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag 'n' drop some files here, or click to select files</p>
        )}
      </div>
    </div>
  );
};

export default UserFiles;