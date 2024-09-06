import React, { useState, useEffect } from 'react';
import { getFileContents } from '../../api/api';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import * as XLSX from 'xlsx';

interface FileContentsProps {
  fileId: number;
  fileName: string;
}

const FileContents: React.FC<FileContentsProps> = ({ fileId, fileName }) => {
  const [contents, setContents] = useState<any[]>([]);

  useEffect(() => {
    const fetchContents = async () => {
      try {
        const base64Data = await getFileContents(fileId);

      
        const binaryString = atob(base64Data[0]); 

      
        const binaryData = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          binaryData[i] = binaryString.charCodeAt(i);
        }

        
        const workbook = XLSX.read(binaryData, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        // Convert sheet to JSON
        const parsedData = XLSX.utils.sheet_to_json(sheet);
        setContents(parsedData);
      } catch (error) {
        console.error('Error fetching file contents:', error);
      }
    };

    fetchContents();
  }, [fileId]);

  if (contents.length === 0) {
    return <div>Loading file contents...</div>;
  }

  const headers = Object.keys(contents[0]);

  return (
    <TableContainer component={Paper}>
      <div>{fileName}</div>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((header) => (
              <TableCell key={header}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {contents.map((row, index) => (
            <TableRow key={index}>
              {headers.map((header) => (
                <TableCell key={header}>{row[header]}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default FileContents;
