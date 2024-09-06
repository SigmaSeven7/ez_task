
import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { getUserFiles, uploadUserFiles, deleteFile, downloadFile, getFileUpdates } from '../../api/api';
import FileContents from '../file-contents/FileContents';
import UploadProgressTracker from './UploadProgressTracker';
import './UserFiles.css';

interface FileData {
  f_id: number;
  f_name: string;
}

interface UploadedFileData {
  file: File;
  uploadId: string;
  timestamp: string;
  status: string;
  progress: number;
}

const UserFiles: React.FC = () => {
  const { u_id } = useParams<{ u_id: string }>();
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadedFileData[]>([]);

  const fetchUserFiles = useCallback(async () => {
    try {
      if (u_id) {
        const filesData = await getUserFiles(u_id);
        setFiles(prevFiles => {
          const newFiles = filesData.filter((newFile: { f_id: number; }) => 
            !prevFiles.some(existingFile => existingFile.f_id === newFile.f_id)
          );
          return [...prevFiles, ...newFiles];
        });
      }
    } catch (error) {
      console.error('Error fetching user files:', error);
    }
  }, [u_id]);

  useEffect(() => {
    fetchUserFiles();
  }, [fetchUserFiles]);

  const uploadFiles = useCallback(async (filesToUpload: File[]) => {
    if (u_id) {
      setIsUploading(true);
      try {
        const newUploadingFiles = filesToUpload.map(file => ({
          file,
          uploadId: '',
          timestamp: new Date().toISOString(),
          status: 'uploading',
          progress: 0
        }));
        setUploadingFiles(prev => [...prev, ...newUploadingFiles]);

        const uploadResponse = await uploadUserFiles(u_id, filesToUpload, (fileName, progress) => {
          setUploadingFiles(prev =>
            prev.map(file => 
              file.file.name === fileName ? { ...file, progress, status: 'uploading' } : file
            )
          );
        });

        const updatedFiles = uploadResponse.results.map((response: any, index: number) => ({
          ...newUploadingFiles[index],
          uploadId: response.uploadId,
          status: response.status,
          progress: 100,
        }));

        setUploadingFiles(prev => 
          prev.map(file => 
            updatedFiles.find((u: { file: { name: string; }; }) => u.file.name === file.file.name) || file
          )
        );

        await fetchUserFiles();

        return updatedFiles;
      } catch (error) {
        console.error('Error uploading files:', error);
        return [];
      } finally {
        setIsUploading(false);
      }
    }
    return [];
  }, [u_id, fetchUserFiles]);

  const pollForCompletion = useCallback(async (uploadedFiles: UploadedFileData[]) => {
    const poll = async () => {
      const updatedFiles = await Promise.all(
        uploadedFiles.map(async (file) => {
          if (file.status !== 'completed') {
            const { status } = await getFileUpdates(u_id as string, file.uploadId);
            return { ...file, status };
          }
          return file;
        })
      );

      setUploadingFiles(prev => 
        prev.map(file => 
          updatedFiles.find(u => u.uploadId === file.uploadId) || file
        )
      );

      if (updatedFiles.some(file => file.status === 'completed')) {
        await fetchUserFiles();
      }

      if (!updatedFiles.every((file) => file.status === 'completed')) {
        setTimeout(poll, 1000);
      } else {
        setUploadingFiles([]);
      }
    };

    poll();
  }, [u_id, fetchUserFiles]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    uploadFiles(acceptedFiles).then((uploadedFiles) => {
      pollForCompletion(uploadedFiles);
    });
  }, [uploadFiles, pollForCompletion]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleFileSelect = (fileId: number, fileName: string) => {
    setSelectedFileId(fileId);
    setSelectedFileName(fileName);
  };

  const handleDeleteFile = async (fileId: number) => {
    try {
      await deleteFile(fileId);
      setFiles(prevFiles => prevFiles.filter(file => file.f_id !== fileId));
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
      {(isUploading || uploadingFiles.length > 0) && u_id && (
        <UploadProgressTracker uploads={uploadingFiles} />
      )}
      {files.length > 0 ? (
        <ul>
          {files.map((file) => (
            <li key={file.f_id}>
              <span className="file-name">{file.f_name}</span>
              <div className="file-actions">
                <button className="info-button" onClick={() => handleFileSelect(file.f_id, file.f_name)}>
                  Info
                </button>
                <button className="download-button" onClick={() => handleDownloadFile(file.f_id, file.f_name)}>
                  Download
                </button>
                <button className="delete-button" onClick={() => handleDeleteFile(file.f_id)}>
                  Delete
                </button>
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
            <button className="close-button" onClick={handleCloseFileContents}>
              Close
            </button>
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