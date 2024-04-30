"use client"
import React from 'react';

const BackupButton: React.FC = () => {
  const handleDownload = async () => {
    const response = await fetch('/api/backup');
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'backup.sql';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <button onClick={handleDownload}>
      Download Database Backup
    </button>
  );
};

export default BackupButton;
