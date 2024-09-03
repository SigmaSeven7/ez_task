import React, { useState, useEffect } from 'react';
import { connectWebSocket } from '../../api/api'; // Adjust the import path as necessary

interface UploadProgress {
  [fileName: string]: {
    progress: number;
    status: 'queued' | 'processing' | 'completed';
  };
}

interface UploadProgressTrackerProps {
  userId: string;
  uploadingFiles: string[];
}

const UploadProgressTracker: React.FC<UploadProgressTrackerProps> = ({ userId, uploadingFiles }) => {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});

  useEffect(() => {
    connectWebSocket(userId);
    console.log('Connected to WebSocket server',connectWebSocket(userId));
    // Initialize progress for new uploading files
    const newProgress = { ...uploadProgress };
    uploadingFiles.forEach(fileName => {
      if (!(fileName in newProgress)) {
        newProgress[fileName] = { progress: 0, status: 'queued' };
      }
    });
    setUploadProgress(newProgress);
  }, [userId, uploadingFiles]);

  return (
    <div>
      <h3>Upload Progress</h3>
      {uploadingFiles.map((fileName) => (
        <div key={fileName}>
          <p>{fileName}: {uploadProgress[fileName]?.progress || 0}% ({uploadProgress[fileName]?.status || 'queued'})</p>
          <progress value={uploadProgress[fileName]?.progress || 0} max="100" />
        </div>
      ))}
    </div>
  );
};

export default UploadProgressTracker;