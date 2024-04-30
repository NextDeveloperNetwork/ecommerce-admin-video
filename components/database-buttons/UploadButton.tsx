"use client"
import React from 'react';

const UploadButton: React.FC = () => {
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('backup', file);

    await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
  };

  return (
    <input type="file" onChange={handleUpload} />
  );
};

export default UploadButton;