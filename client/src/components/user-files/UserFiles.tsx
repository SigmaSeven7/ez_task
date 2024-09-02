// // import React, { useEffect, useState, useCallback } from 'react';
// // import { useParams } from 'react-router-dom';
// // import { useDropzone } from 'react-dropzone';
// // import { getUserFiles, uploadUserFiles } from '../../api/api';  // Ensure this path is correct
// // import FileContents from '../file-contents/FileContents';

// // const UserFiles: React.FC = () => {
// //   const { u_id } = useParams<{ u_id: string }>();
// //   const [files, setFiles] = useState<any[]>([]);
// //   const [selectedFileId, setSelectedFileId] = useState<number | null>(null);

// //   useEffect(() => {
// //     const fetchUserFiles = async () => {
// //       try {
// //         if (u_id) {
// //           const filesData = await getUserFiles(u_id);
// //           setFiles(filesData);
// //           console.log('User files:', filesData);
// //         }
// //       } catch (error) {
// //         console.error('Error fetching user files:', error);
// //       }
// //     };

// //     fetchUserFiles();
// //   }, [u_id]);

// //   const onDrop = useCallback(async (acceptedFiles: File[]) => {
// //     console.log('Files dropped:', acceptedFiles);
// //     try {
// //       if (u_id) {
// //         const response = await uploadUserFiles(u_id, acceptedFiles);
// //         console.log('Upload response:', response);
// //         // Refresh the file list after upload
// //         const filesData = await getUserFiles(u_id);
// //         setFiles(filesData);
// //       }
// //     } catch (error) {
// //       console.error('Error uploading files:', error);
// //     }
// //   }, [u_id]);

// //   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

// //   return (
// //     <div>
// //       <h1>User Files</h1>
// //       {files.length > 0 ? (
// //         <ul>
// //           {files.map((file) => (
// //             <li key={file.f_id}>
// //               {file.f_name}
// //               <button onClick={() => setSelectedFileId(file.f_id)}>View Contents</button>
// //             </li>
// //           ))}
// //         </ul>
// //       ) : (
// //         <p>No files uploaded yet.</p>
// //       )}
// //       {selectedFileId && <FileContents fileId={selectedFileId} />}
// //       <div {...getRootProps()} style={{ border: '2px dashed #ccc', padding: '20px', textAlign: 'center', marginTop: '20px' }}>
// //         <input {...getInputProps()} />
// //         {isDragActive ? (
// //           <p>Drop the files here ...</p>
// //         ) : (
// //           <p>Drag 'n' drop some files here, or click to select files</p>
// //         )}
// //       </div>
// //     </div>
// //   );
// // };

// // export default UserFiles;


// import React, { useEffect, useState, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import { useDropzone } from 'react-dropzone';
// import { getUserFiles, uploadUserFiles } from '../../api/api';  // Ensure this path is correct
// import FileContents from '../file-contents/FileContents';

// const UserFiles: React.FC = () => {
//   const { u_id } = useParams<{ u_id: string }>();
//   const [files, setFiles] = useState<any[]>([]);
//   const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
//   const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchUserFiles = async () => {
//       try {
//         if (u_id) {
//           const filesData = await getUserFiles(u_id);
//           setFiles(filesData);
//           console.log('User files:', filesData);
//         }
//       } catch (error) {
//         console.error('Error fetching user files:', error);
//       }
//     };

//     fetchUserFiles();
//   }, [u_id]);

//   const onDrop = useCallback(async (acceptedFiles: File[]) => {
//     console.log('Files dropped:', acceptedFiles);
//     try {
//       if (u_id) {
//         const response = await uploadUserFiles(u_id, acceptedFiles);
//         console.log('Upload response:', response);
//         // Refresh the file list after upload
//         const filesData = await getUserFiles(u_id);
//         setFiles(filesData);
//       }
//     } catch (error) {
//       console.error('Error uploading files:', error);
//     }
//   }, [u_id]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

//   const handleFileSelect = (fileId: number, fileName: string) => {
//     setSelectedFileId(fileId);
//     setSelectedFileName(fileName);
//   };

//   return (
//     <div>
//       <h1>User Files</h1>
//       {files.length > 0 ? (
//         <ul>
//           {files.map((file) => (
//             <li key={file.f_id}>
//               {file.f_name}
//               <button onClick={() => handleFileSelect(file.f_id, file.f_name)}>View Contents</button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No files uploaded yet.</p>
//       )}
//       {selectedFileId && selectedFileName && <FileContents fileId={selectedFileId} fileName={selectedFileName} />}
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


// import React, { useEffect, useState, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import { useDropzone } from 'react-dropzone';
// import { getUserFiles, uploadUserFiles, deleteFile, downloadFile } from '../../api/api';
// import FileContents from '../file-contents/FileContents';

// const UserFiles: React.FC = () => {
//   const { u_id } = useParams<{ u_id: string }>();
//   const [files, setFiles] = useState<any[]>([]);
//   const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
//   const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

//   const fetchUserFiles = useCallback(async () => {
//     try {
//       if (u_id) {
//         const filesData = await getUserFiles(u_id);
//         setFiles(filesData);
//         console.log('User files:', filesData);
//       }
//     } catch (error) {
//       console.error('Error fetching user files:', error);
//     }
//   }, [u_id]);

//   useEffect(() => {
//     fetchUserFiles();
//   }, [fetchUserFiles]);

//   const onDrop = useCallback(async (acceptedFiles: File[]) => {
//     console.log('Files dropped:', acceptedFiles);
//     try {
//       if (u_id) {
//         const response = await uploadUserFiles(u_id, acceptedFiles);
//         console.log('Upload response:', response);
//         fetchUserFiles(); // Refresh the file list after upload
//       }
//     } catch (error) {
//       console.error('Error uploading files:', error);
//     }
//   }, [u_id, fetchUserFiles]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

//   const handleFileSelect = (fileId: number, fileName: string) => {
//     setSelectedFileId(fileId);
//     setSelectedFileName(fileName);
//   };

//   const handleDeleteFile = async (fileId: number) => {
//     try {
//       await deleteFile(fileId);
//       fetchUserFiles(); // Refresh the file list after deletion
//       if (selectedFileId === fileId) {
//         setSelectedFileId(null);
//         setSelectedFileName(null);
//       }
//     } catch (error) {
//       console.error('Error deleting file:', error);
//     }
//   };

//   const handleDownloadFile = async (fileId: number, fileName: string) => {
//     try {
//       await downloadFile(fileId, fileName);
//     } catch (error) {
//       console.error('Error downloading file:', error);
//     }
//   };

//   return (
//     <div>
//       <h1>User Files</h1>
//       {files.length > 0 ? (
//         <ul>
//           {files.map((file) => (
//             <li key={file.f_id}>
//               {file.f_name}
//               <button onClick={() => handleFileSelect(file.f_id, file.f_name)}>Info</button>
//               <button onClick={() => handleDeleteFile(file.f_id)}>Delete</button>
//               <button onClick={() => handleDownloadFile(file.f_id, file.f_name)}>Download</button>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p>No files uploaded yet.</p>
//       )}
//       {selectedFileId && selectedFileName && <FileContents fileId={selectedFileId} fileName={selectedFileName} />}
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


// import React, { useEffect, useState, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import { useDropzone } from 'react-dropzone';
// import { getUserFiles, uploadUserFiles, deleteFile, downloadFile } from '../../api/api';
// import FileContents from '../file-contents/FileContents';
// import './UserFiles.css';

// const UserFiles: React.FC = () => {
//   const { u_id } = useParams<{ u_id: string }>();
//   const [files, setFiles] = useState<any[]>([]);
//   const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
//   const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

//   const fetchUserFiles = useCallback(async () => {
//     try {
//       if (u_id) {
//         const filesData = await getUserFiles(u_id);
//         setFiles(filesData);
//         console.log('User files:', filesData);
//       }
//     } catch (error) {
//       console.error('Error fetching user files:', error);
//     }
//   }, [u_id]);

//   useEffect(() => {
//     fetchUserFiles();
//   }, [fetchUserFiles]);

//   const onDrop = useCallback(async (acceptedFiles: File[]) => {
//     console.log('Files dropped:', acceptedFiles);
//     try {
//       if (u_id) {
//         const response = await uploadUserFiles(u_id, acceptedFiles);
//         console.log('Upload response:', response);
//         fetchUserFiles(); // Refresh the file list after upload
//       }
//     } catch (error) {
//       console.error('Error uploading files:', error);
//     }
//   }, [u_id, fetchUserFiles]);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

//   const handleFileSelect = (fileId: number, fileName: string) => {
//     setSelectedFileId(fileId);
//     setSelectedFileName(fileName);
//   };

//   const handleDeleteFile = async (fileId: number) => {
//     try {
//       await deleteFile(fileId);
//       fetchUserFiles(); // Refresh the file list after deletion
//       if (selectedFileId === fileId) {
//         setSelectedFileId(null);
//         setSelectedFileName(null);
//       }
//     } catch (error) {
//       console.error('Error deleting file:', error);
//     }
//   };

//   const handleDownloadFile = async (fileId: number, fileName: string) => {
//     try {
//       await downloadFile(fileId, fileName);
//     } catch (error) {
//       console.error('Error downloading file:', error);
//     }
//   };

//   return (
//     <div className="user-files-container">
//       <h1>User Files</h1>
//       {files.length > 0 ? (
//         <ul>
//           {files.map((file) => (
//             <li key={file.f_id}>
//               <span className="file-name">{file.f_name}</span>
//               <div className="file-actions">
//                 <button className="info-button" onClick={() => handleFileSelect(file.f_id, file.f_name)}>Info</button>
//                 <button onClick={() => handleDownloadFile(file.f_id, file.f_name)}>Download</button>
//                 <button className="delete-button" onClick={() => handleDeleteFile(file.f_id)}>Delete</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="no-files">No files uploaded yet.</p>
//       )}
//       {selectedFileId && selectedFileName && <FileContents fileId={selectedFileId} fileName={selectedFileName} />}
//       <div {...getRootProps()} className="dropzone">
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
import { getUserFiles, uploadUserFiles, deleteFile, downloadFile } from '../../api/api';
import FileContents from '../file-contents/FileContents';
import './UserFiles.css';

const UserFiles: React.FC = () => {
  const { u_id } = useParams<{ u_id: string }>();
  const [files, setFiles] = useState<any[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const fetchUserFiles = useCallback(async () => {
    try {
      if (u_id) {
        const filesData = await getUserFiles(u_id);
        setFiles(filesData);
        console.log('User files:', filesData);
      }
    } catch (error) {
      console.error('Error fetching user files:', error);
    }
  }, [u_id]);

  useEffect(() => {
    fetchUserFiles();
  }, [fetchUserFiles]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    console.log('Files dropped:', acceptedFiles);
    try {
      if (u_id) {
        const response = await uploadUserFiles(u_id, acceptedFiles);
        console.log('Upload response:', response);
        fetchUserFiles(); // Refresh the file list after upload
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    }
  }, [u_id, fetchUserFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileSelect = (fileId: number, fileName: string) => {
    setSelectedFileId(fileId);
    setSelectedFileName(fileName);
  };

  const handleDeleteFile = async (fileId: number) => {
    try {
      await deleteFile(fileId);
      fetchUserFiles(); // Refresh the file list after deletion
      if (selectedFileId === fileId) {
        setSelectedFileId(null);
        setSelectedFileName(null);
      }
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const handleDownloadFile = async (fileId: number, fileName: string) => {
    try {
      await downloadFile(fileId, fileName);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleCloseFileContents = () => {
    setSelectedFileId(null);
    setSelectedFileName(null);
  };

  return (
    <div className="user-files-container">
      <h1>User Files</h1>
      {files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file.f_id}>
              <span className="file-name">{file.f_name}</span>
              <div className="file-actions">
                <button className="info-button" onClick={() => handleFileSelect(file.f_id, file.f_name)}>Info</button>
                <button className='download-button' onClick={() => handleDownloadFile(file.f_id, file.f_name)}>Download</button>
                <button className="delete-button" onClick={() => handleDeleteFile(file.f_id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-files">No files uploaded yet.</p>
      )}
      {selectedFileId && selectedFileName && (
        <div className="file-contents-container">
          <div className="file-contents-header">
            <h2>File Contents: {selectedFileName}</h2>
            <button className="close-button" onClick={handleCloseFileContents}>Close</button>
          </div>
          <FileContents fileId={selectedFileId} fileName={selectedFileName} />
        </div>
      )}
      <div {...getRootProps()} className="dropzone">
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