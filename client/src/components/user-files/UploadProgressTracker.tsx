import { LinearProgress, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";

interface UploadedFileData {
  file: File;
  uploadId: string;
  timestamp: string;
  status: string;
  progress: number;
}

interface UploadProgressTrackerProps {
  uploads: UploadedFileData[];
}

const UploadProgressTracker: React.FC<UploadProgressTrackerProps> = ({
  uploads,
}) => {

  return (
    <div className="upload-progress-tracker">
      <h3>Upload Progress</h3>
      {uploads
        .filter(({ status }) => status !== "completed")
        .map(({ file, uploadId, status }) => (
          <UploadProgressItem
            key={uploadId || file.name}
            file={file}
            status={status}
          />
        ))}
    </div>
  );
};


const UploadProgressItem: React.FC<{
  file: File;
  status: string;
}> = ({ file, status }) => {
  const [dynamicProgress, setDynamicProgress] = useState(0);

  useEffect(() => {
    if (status === "in-progress") {
      const interval = setInterval(() => {
        setDynamicProgress((prev) => {
          const newProgress = Math.min(prev + 1, 100);
          if (newProgress === 100) {
            clearInterval(interval);
          }
          return newProgress;
        });
      }, 100); 

      return () => clearInterval(interval); 
    }
  }, [status]);

  return (
    <div>
      <p>
        {file.name} - {status}
      </p>
      <Typography variant="body1">{file.name}</Typography>
      {status === 'uploading' && (
        <LinearProgress variant="indeterminate" />
      )}
      {status === 'in-progress' && (
        <div>
        <LinearProgress variant="determinate" value={dynamicProgress} />
        <Typography variant="body2">{`${Math.round(dynamicProgress)}%`}</Typography>
      </div>
      )}
      {status === 'completed' && (
        <Typography variant="body2">Upload completed</Typography>
      )}
      {status === 'queued' && (
         <div>
         <LinearProgress variant="determinate" value={0} />
         <Typography variant="body2">Queued</Typography>
       </div>
      )}
      <p>
      </p>
    </div>
  );
};

export default UploadProgressTracker;
