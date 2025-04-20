import React, { useState } from 'react';
import { Form, Button, Alert, ProgressBar } from 'react-bootstrap';
import axios from 'axios';

const FileUploader = ({ entityType, entityId, onUploadComplete }) => {
  const [file, setFile] = useState(null);
  const [description, setDescription] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setSuccess(false);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const validateForm = () => {
    if (!file) {
      setError('Please select a file to upload');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', description);
    formData.append('entityType', entityType);
    formData.append('entityId', entityId);
    
    try {
      setUploading(true);
      setUploadProgress(0);
      
      const response = await axios.post(
        'http://localhost:5000/api/files/upload',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percentCompleted);
          }
        }
      );
      
      setSuccess(true);
      setFile(null);
      setDescription('');
      setError(null);
      
      // Call the callback function if provided
      if (onUploadComplete) {
        onUploadComplete(response.data.fileAttachment);
      }
    } catch (err) {
      console.error('Error uploading file:', err);
      setError(err.response?.data?.message || 'Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="file-uploader">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" onClose={() => setSuccess(false)} dismissible>
          File uploaded successfully!
        </Alert>
      )}
      
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Select File</Form.Label>
          <Form.Control 
            type="file" 
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Form.Text className="text-muted">
            Supported file types: PDF, DOC, DOCX, JPG, PNG, etc.
          </Form.Text>
        </Form.Group>
        
        <Form.Group className="mb-3">
          <Form.Label>Description</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={description}
            onChange={handleDescriptionChange}
            placeholder="Enter a description for this file"
            disabled={uploading}
          />
        </Form.Group>
        
        {uploading && (
          <ProgressBar 
            now={uploadProgress} 
            label={`${uploadProgress}%`} 
            className="mb-3" 
          />
        )}
        
        <Button 
          variant="primary" 
          type="submit"
          disabled={uploading || !file}
        >
          {uploading ? 'Uploading...' : 'Upload File'}
        </Button>
      </Form>
    </div>
  );
};

export default FileUploader;
