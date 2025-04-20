import React, { useState, useEffect } from 'react';
import { Card, Button, Table, Alert, Spinner, Modal } from 'react-bootstrap';
import axios from 'axios';
import FileUploader from '../common/FileUploader';

const FileAttachmentList = ({ entityType, entityId }) => {
  const [attachments, setAttachments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchAttachments();
  }, [entityType, entityId]);

  const fetchAttachments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:5000/api/files/entity/${entityType}/${entityId}`);
      setAttachments(res.data.fileAttachments);
      setError(null);
    } catch (err) {
      console.error('Error fetching attachments:', err);
      setError('Failed to load attachments. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUploadComplete = (newAttachment) => {
    setAttachments([...attachments, newAttachment]);
    setShowUploadModal(false);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      setDeleting(true);
      await axios.delete(`http://localhost:5000/api/files/${deleteId}`);
      setAttachments(attachments.filter(attachment => attachment.id !== deleteId));
      setShowDeleteConfirm(false);
      setDeleteId(null);
    } catch (err) {
      console.error('Error deleting attachment:', err);
      setError('Failed to delete attachment. Please try again later.');
    } finally {
      setDeleting(false);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/files/download/${id}`, {
        responseType: 'blob'
      });
      
      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([res.data]));
      
      // Create a temporary link element
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      
      // Append to the document
      document.body.appendChild(link);
      
      // Trigger the download
      link.click();
      
      // Clean up
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error downloading file:', err);
      setError('Failed to download file. Please try again later.');
    }
  };

  if (loading && attachments.length === 0) {
    return (
      <div className="text-center my-4">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <div className="file-attachment-list">
      {error && (
        <Alert variant="danger" onClose={() => setError(null)} dismissible>
          {error}
        </Alert>
      )}
      
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0">Attachments</h5>
        <Button 
          variant="primary" 
          size="sm"
          onClick={() => setShowUploadModal(true)}
        >
          Upload New File
        </Button>
      </div>
      
      {attachments.length > 0 ? (
        <Table hover responsive size="sm">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Description</th>
              <th>Uploaded</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {attachments.map(attachment => (
              <tr key={attachment.id}>
                <td>{attachment.originalName}</td>
                <td>{attachment.description || '-'}</td>
                <td>{new Date(attachment.createdAt).toLocaleString()}</td>
                <td>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    className="me-2"
                    onClick={() => handleDownload(attachment.id, attachment.originalName)}
                  >
                    Download
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteClick(attachment.id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <Card className="text-center p-3">
          <p className="mb-0">No attachments found</p>
        </Card>
      )}
      
      {/* Upload Modal */}
      <Modal show={showUploadModal} onHide={() => setShowUploadModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FileUploader 
            entityType={entityType} 
            entityId={entityId} 
            onUploadComplete={handleUploadComplete} 
          />
        </Modal.Body>
      </Modal>
      
      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this file? This action cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteConfirm(false)}
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDeleteConfirm}
            disabled={deleting}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FileAttachmentList;
