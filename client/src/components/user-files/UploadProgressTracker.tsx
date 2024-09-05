// // // import React, { useEffect, useState } from 'react';
// // // import { getFileUpdates } from '../../api/api';

// // // interface UploadProgressTrackerProps {
// // //   userId: string;
// // //   files: File[];
// // // }

// // // interface FileStatus {
// // //   status: 'queued' | 'in-progress' | 'completed';
// // //   progress: number;
// // // }

// // // const UploadProgressTracker: React.FC<UploadProgressTrackerProps> = ({ userId, files }) => {
// // //   const [fileStatuses, setFileStatuses] = useState<{ [key: string]: FileStatus }>({});

// // //   useEffect(() => {
// // //     const updateInterval = setInterval(() => {
// // //       files.forEach(file => {
// // //         getFileUpdates(userId, file.name)
// // //           .then(status => {
// // //             setFileStatuses(prev => ({
// // //               ...prev,
// // //               [file.name]: {
// // //                 status: status.status,
// // //                 progress: status.status === 'completed' ? 100 : prev[file.name]?.progress || 0
// // //               }
// // //             }));
// // //           })
// // //           .catch(error => console.error(`Error fetching status for ${file.name}:`, error));
// // //       });
// // //     }, 100);

// // //     return () => clearInterval(updateInterval);
// // //   }, [userId, files]);

// // //   return (
// // //     <div>
// // //       <h3>Upload Progress</h3>
// // //       {files.map(file => (
// // //         <div key={file.name}>
// // //           <p>{file.name} - {fileStatuses[file.name]?.status || 'waiting'}</p>
// // //           <progress value={fileStatuses[file.name]?.progress || 0} max="100" />
// // //           <p>{fileStatuses[file.name]?.progress || 0}% Uploaded</p>
// // //         </div>
// // //       ))}
// // //     </div>
// // //   );
// // // };

// // // export default UploadProgressTracker;

// // import React, { useEffect, useState } from 'react';
// // import { getFileUpdates } from '../../api/api';

// // interface UploadProgressTrackerProps {
// //   userId: string;
// //   files: File[];
// // }

// // interface FileStatus {
// //   status: 'queued' | 'processing' | 'completed';
// //   progress: number;
// // }

// // const UploadProgressTracker: React.FC<UploadProgressTrackerProps> = ({ userId, files }) => {
// //   const [fileStatuses, setFileStatuses] = useState<{ [key: string]: FileStatus }>({});

// //   useEffect(() => {
// //     const updateInterval = setInterval(() => {
// //       files.forEach((file, index) => {
// //         if (index < 5) {
// //           getFileUpdates(userId, file.name)
// //             .then(status => {
// //               setFileStatuses(prev => ({
// //                 ...prev,
// //                 [file.name]: {
// //                   status: status.status,
// //                   progress: status.status === 'completed' ? 100 : (prev[file.name]?.progress || 0) + 10
// //                 }
// //               }));
// //             })
// //             .catch(error => console.error(`Error fetching status for ${file.name}:`, error));
// //         } else {
// //           setFileStatuses(prev => ({
// //             ...prev,
// //             [file.name]: { status: 'queued', progress: 0 }
// //           }));
// //         }
// //       });
// //     }, 500);

// //     return () => clearInterval(updateInterval);
// //   }, [userId, files]);

// //   return (
// //     <div>
// //       <h3>Upload Progress</h3>
// //       {files.map((file, index) => (
// //         <div key={file.name}>
// //           <p>{file.name} - {fileStatuses[file.name]?.status || 'waiting'}</p>
// //           {index < 5 && fileStatuses[file.name]?.status === 'processing' && (
// //             <div className="indeterminate-progress-bar">
// //               <div className="indeterminate-progress-bar__progress"></div>
// //             </div>
// //           )}
// //           {(index >= 5 || fileStatuses[file.name]?.status === 'completed') && (
// //             <progress value={fileStatuses[file.name]?.progress || 0} max="100" />
// //           )}
// //           <p>{fileStatuses[file.name]?.status === 'queued' ? 'Queued' : 
// //               fileStatuses[file.name]?.status === 'completed' ? 'Completed' : 'Processing...'}</p>
// //         </div>
// //       ))}
// //     </div>
// //   );
// // };

// // export default UploadProgressTracker;

// import React, { useEffect, useState } from 'react';
// import { getFileUpdates } from '../../api/api';

// interface UploadProgressTrackerProps {
//   userId: string;
//   files: File[];
// }

// interface FileStatus {
//   status: 'queued' | 'processing' | 'completed';
//   progress: number;
// }

// const UploadProgressTracker: React.FC<UploadProgressTrackerProps> = ({ userId, files }) => {
//   const [fileStatuses, setFileStatuses] = useState<{ [key: string]: FileStatus }>({});

//   useEffect(() => {
//     const delay = 500; // Delay in milliseconds (e.g., 500ms)
  
//     const startInterval = () => {
//       const updateInterval = setInterval(() => {
//         files.forEach((file, index) => {
//           if (index < 5) {
//             getFileUpdates(userId, file.name)
//               .then(status => {
//                 setFileStatuses(prev => ({
//                   ...prev,
//                   [file.name]: {
//                     status: status.status === 'in-progress' ? 'processing' : status.status,
//                     progress: status.status === 'completed' ? 100 : (prev[file.name]?.progress || 0) + 10
//                   } as FileStatus
//                 }));
//               })
//               .catch(error => console.error(`Error fetching status for ${file.name}:`, error));
//           } else {
//             setFileStatuses(prev => ({
//               ...prev,
//               [file.name]: { status: 'queued', progress: 0 }
//             }));
//           }
//         });
//       }, 500);
  
//       return updateInterval;
//     };
  
//     const timeoutId = setTimeout(() => {
//       const updateInterval = startInterval();
//       return () => clearInterval(updateInterval);
//     }, delay);
  
//     return () => clearTimeout(timeoutId);
//   }, [userId, files]);

//   return (
//     <div>
//       <h3>Upload Progress</h3>
//       {files.map((file, index) => (
//         <div key={file.name}>
//           <p>{file.name} - {fileStatuses[file.name]?.status || 'waiting'}</p>
//           {index < 5 && fileStatuses[file.name]?.status === 'processing' && (
//             <div className="indeterminate-progress-bar">
//               <div className="indeterminate-progress-bar__progress"></div>
//             </div>
//           )}
//           {(index >= 5 || fileStatuses[file.name]?.status === 'completed') && (
//             <progress value={fileStatuses[file.name]?.progress || 0} max="100" />
//           )}
//           <p>{fileStatuses[file.name]?.status === 'queued' ? 'Queued' : 
//               fileStatuses[file.name]?.status === 'completed' ? 'Completed' : 'Processing...'}</p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default UploadProgressTracker;


import React, { useEffect, useState } from 'react';
import { getFileUpdates } from '../../api/api';

interface UploadProgressTrackerProps {
  userId: string;
  files: File[];
}

interface FileStatus {
  status: 'queued' | 'processing' | 'completed';
  progress: number;
}

const UploadProgressTracker: React.FC<UploadProgressTrackerProps> = ({ userId, files }) => {
  const [fileStatuses, setFileStatuses] = useState<{ [key: string]: FileStatus }>({});
  
  useEffect(() => {
    const fileIntervals: { [key: string]: any } = {};

    const startPollingForFile = (file: File) => {
      const intervalId = setInterval(() => {
        getFileUpdates(userId, file.name)
          .then(status => {
            setFileStatuses(prev => ({
              ...prev,
              [file.name]: {
                status: status.status === 'in-progress' ? 'processing' : status.status,
                progress: status.status === 'completed' ? 100 : (prev[file.name]?.progress || 0) + 10
              } as FileStatus
            }));

            // If file is completed, stop polling
            if (status.status === 'completed') {
              clearInterval(fileIntervals[file.name]);
            }
          })
          .catch(error => {
            console.error(`Error fetching status for ${file.name}:`, error);
            clearInterval(fileIntervals[file.name]); // Clear interval on error
          });
      }, 1000); // Poll every second

      // Store interval reference to clear it later
      fileIntervals[file.name] = intervalId;
    };

    // Start polling for all files
    files.forEach(file => {
      startPollingForFile(file);
    });

    return () => {
      // Clear all intervals when component unmounts
      Object.values(fileIntervals).forEach(clearInterval);
    };
  }, [userId, files]);

  return (
    <div>
      <h3>Upload Progress</h3>
      {files.map((file, index) => (
        <div key={file.name}>
          <p>{file.name} - {fileStatuses[file.name]?.status || 'waiting'}</p>
          {fileStatuses[file.name]?.status === 'processing' && (
            <div className="indeterminate-progress-bar">
              <div className="indeterminate-progress-bar__progress"></div>
            </div>
          )}
          {(fileStatuses[file.name]?.status === 'queued' || fileStatuses[file.name]?.status === 'completed') && (
            <progress value={fileStatuses[file.name]?.status === 'queued' ? 0 : 100} max="100" />
          )}
          <p>{fileStatuses[file.name]?.status === 'queued' ? 'Queued' :
              fileStatuses[file.name]?.status === 'completed' ? 'Completed' : 'Processing...'}</p>
        </div>
      ))}
    </div>
  );
};

export default UploadProgressTracker;
