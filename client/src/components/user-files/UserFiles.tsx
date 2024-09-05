// import React, { useEffect, useState, useCallback } from 'react';
// import { useParams } from 'react-router-dom';
// import { useDropzone } from 'react-dropzone';
// import { getUserFiles, uploadUserFiles, deleteFile, downloadFile } from '../../api/api';
// import FileContents from '../file-contents/FileContents';
// import UploadProgressTracker from './UploadProgressTracker';
// import './UserFiles.css';

// interface FileData {
//   f_id: number;
//   f_name: string;
// }

// const UserFiles: React.FC = () => {
//   const { u_id } = useParams<{ u_id: string }>();
//   const [files, setFiles] = useState<FileData[]>([]);
//   const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
//   const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
//   const [isUploading, setIsUploading] = useState<boolean>(false);
//   const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
//   const [queuedFiles, setQueuedFiles] = useState<File[]>([]);

//   const fetchUserFiles = useCallback(async () => {
//     try {
//       if (u_id) {
//         const filesData = await getUserFiles(u_id);
//         setFiles(filesData);
//       }
//     } catch (error) {
//       console.error('Error fetching user files:', error);
//     }
//   }, [u_id]);

//   useEffect(() => {
//     fetchUserFiles();
//   }, [fetchUserFiles]);

//   // Function to handle batch upload
//   const uploadBatch = useCallback(
//     async (filesToUpload: File[]) => {
//       if (u_id) {
//         setIsUploading(true);
//         setUploadingFiles(filesToUpload);

//         try {
//           // Upload the batch of files
//           await uploadUserFiles(u_id, filesToUpload, () => {});
//           // After uploading, fetch the latest files
//           await fetchUserFiles();
//         } catch (error) {
//           console.error('Error uploading files:', error);
//         }

//         setIsUploading(false);
//         setUploadingFiles([]); // Clear the current batch
//       }
//     },
//     [u_id, fetchUserFiles]
//   );

//   // Handle batches sequentially
//   useEffect(() => {
//     const processNextBatch = async () => {
//       if (!isUploading && queuedFiles.length > 0) {
//         const nextBatch = queuedFiles.slice(0, 5); // Get next batch of up to 5 files
//         setQueuedFiles((prev) => prev.slice(5)); // Remove the next batch from the queue
//         await uploadBatch(nextBatch); // Wait for the current batch to finish uploading
//       }
//     };

//     processNextBatch(); // Trigger the processing of the next batch
//   }, [isUploading, queuedFiles, uploadBatch]);

//   const onDrop = useCallback((acceptedFiles: File[]) => {
//     setQueuedFiles((prev) => [...prev, ...acceptedFiles]);
//   }, []);

//   const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

//   const handleFileSelect = (fileId: number, fileName: string) => {
//     setSelectedFileId(fileId);
//     setSelectedFileName(fileName);
//   };

//   const handleDeleteFile = async (fileId: number) => {
//     try {
//       await deleteFile(fileId);
//       fetchUserFiles();
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

//   const handleCloseFileContents = () => {
//     setSelectedFileId(null);
//     setSelectedFileName(null);
//   };

//   return (
//     <div className="user-files-container">
//       <h1>User Files</h1>
//       {(isUploading || queuedFiles.length > 0) && u_id && (
//         <UploadProgressTracker userId={u_id} files={[...uploadingFiles, ...queuedFiles]} />
//       )}
//       {files.length > 0 ? (
//         <ul>
//           {files.map((file) => (
//             <li key={file.f_id}>
//               <span className="file-name">{file.f_name}</span>
//               <div className="file-actions">
//                 <button className="info-button" onClick={() => handleFileSelect(file.f_id, file.f_name)}>Info</button>
//                 <button className="download-button" onClick={() => handleDownloadFile(file.f_id, file.f_name)}>Download</button>
//                 <button className="delete-button" onClick={() => handleDeleteFile(file.f_id)}>Delete</button>
//               </div>
//             </li>
//           ))}
//         </ul>
//       ) : (
//         <p className="no-files">No files uploaded yet.</p>
//       )}
//       {selectedFileId && selectedFileName && (
//         <div className="file-contents-container">
//           <div className="file-contents-header">
//             <h2>File Contents: {selectedFileName}</h2>
//             <button className="close-button" onClick={handleCloseFileContents}>Close</button>
//           </div>
//           <FileContents fileId={selectedFileId} fileName={selectedFileName} />
//         </div>
//       )}
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
import UploadProgressTracker from './UploadProgressTracker';
import './UserFiles.css';

interface FileData {
  f_id: number;
  f_name: string;
}

const UserFiles: React.FC = () => {
  const { u_id } = useParams<{ u_id: string }>();
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);
  const [queuedFiles, setQueuedFiles] = useState<File[]>([]);

  const fetchUserFiles = useCallback(async () => {
    try {
      if (u_id) {
        const filesData = await getUserFiles(u_id);
        setFiles(filesData);
      }
    } catch (error) {
      console.error('Error fetching user files:', error);
    }
  }, [u_id]);

  useEffect(() => {
    fetchUserFiles();
  }, [fetchUserFiles]);

  const uploadBatch = useCallback(
    async (filesToUpload: File[]) => {
      if (u_id) {
        setIsUploading(true);
        setUploadingFiles(filesToUpload);

        try {
          await uploadUserFiles(u_id, filesToUpload, (fileName, progress) => {
            // You can use this callback to update individual file progress if needed
            console.log(`File ${fileName} progress: ${progress}%`);
          });
          await fetchUserFiles();
        } catch (error) {
          console.error('Error uploading files:', error);
        }

        setIsUploading(false);
        setUploadingFiles([]);
      }
    },
    [u_id, fetchUserFiles]
  );

  useEffect(() => {
    const processNextBatch = async () => {
      if (!isUploading && queuedFiles.length > 0) {
        const nextBatch = queuedFiles.slice(0, 5);
        setQueuedFiles((prev) => prev.slice(5));
        await uploadBatch(nextBatch);
      }
    };

    processNextBatch();
  }, [isUploading, queuedFiles, uploadBatch]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setQueuedFiles((prev) => [...prev, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileSelect = (fileId: number, fileName: string) => {
    setSelectedFileId(fileId);
    setSelectedFileName(fileName);
  };

  const handleDeleteFile = async (fileId: number) => {
    try {
      await deleteFile(fileId);
      fetchUserFiles();
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
      {(isUploading || queuedFiles.length > 0) && u_id && (
        <UploadProgressTracker userId={u_id} files={[...uploadingFiles, ...queuedFiles]} />
      )}
      {files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file.f_id}>
              <span className="file-name">{file.f_name}</span>
              <div className="file-actions">
                <button className="info-button" onClick={() => handleFileSelect(file.f_id, file.f_name)}>Info</button>
                <button className="download-button" onClick={() => handleDownloadFile(file.f_id, file.f_name)}>Download</button>
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