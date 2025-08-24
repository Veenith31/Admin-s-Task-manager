import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import { tasksAPI } from '../../utils/api';
import { toast } from 'react-toastify';

export default function UploadTasksPage() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);

  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    
    if (selectedFile) {
      // Validate file type
      const allowedTypes = [
        'text/csv',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      ];
      
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      const validExtensions = ['csv', 'xls', 'xlsx'];
      
      if (!allowedTypes.includes(selectedFile.type) && !validExtensions.includes(fileExtension)) {
        toast.error('Please select a valid CSV, XLS, or XLSX file');
        return;
      }
      
      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > maxSize) {
        toast.error('File size must be less than 10MB');
        return;
      }
      
      setFile(selectedFile);
      setUploadResult(null);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file to upload');
      return;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await tasksAPI.upload(formData);
      
      setUploadResult(response.data);
      toast.success(response.data.message);
      setFile(null);
      
      // Reset file input
      const fileInput = document.getElementById('file-input');
      if (fileInput) {
        fileInput.value = '';
      }
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.response?.data?.message || 'Failed to upload file');
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    
    if (droppedFile) {
      // Simulate file input change
      const event = {
        target: {
          files: [droppedFile]
        }
      };
      handleFileChange(event);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="text-center mt-4">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Upload CSV | Task Distribution System</title>
      </Head>

      <div>
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Upload CSV File</h1>
          <Link href="/tasks" className="btn btn-secondary">
            View All Tasks
          </Link>
        </div>

        {/* Instructions */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Instructions</h5>
          </div>
          <div className="card-body">
            <div className="row">
              <div className="col-md-6">
                <h6>CSV Format Requirements:</h6>
                <ul>
                  <li><strong>FirstName</strong> - Text (Required)</li>
                  <li><strong>Phone</strong> - Number (Required)</li>
                  <li><strong>Notes</strong> - Text (Optional)</li>
                </ul>
                <p className="text-muted">
                  <small>
                    Make sure your CSV file has these exact column headers. 
                    The file will be validated before processing.
                  </small>
                </p>
              </div>
              <div className="col-md-6">
                <h6>Supported File Types:</h6>
                <ul>
                  <li>CSV files (.csv)</li>
                  <li>Excel files (.xlsx, .xls)</li>
                </ul>
                <h6>File Size Limit:</h6>
                <p>Maximum 10MB per file</p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Form */}
        <div className="card mb-4">
          <div className="card-header">
            <h5 className="mb-0">Upload File</h5>
          </div>
          <div className="card-body">
            <form onSubmit={handleUpload}>
              <div 
                className="upload-area"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="upload-content">
                  <div className="upload-icon">
                    <i className="fas fa-cloud-upload-alt fa-3x text-primary"></i>
                  </div>
                  <h4>Drag and drop your file here</h4>
                  <p className="text-muted">or click to browse</p>
                  
                  <input
                    type="file"
                    id="file-input"
                    onChange={handleFileChange}
                    accept=".csv,.xlsx,.xls"
                    className="file-input"
                    disabled={uploading}
                  />
                  
                  {file && (
                    <div className="selected-file">
                      <p><strong>Selected File:</strong> {file.name}</p>
                      <p><strong>Size:</strong> {(file.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  )}
                </div>
              </div>

              <div className="form-group mt-3">
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={uploading || !file}
                >
                  {uploading ? (
                    <>
                      <span className="spinner-border spinner-border-sm mr-2"></span>
                      Uploading and Processing...
                    </>
                  ) : (
                    'Upload and Distribute Tasks'
                  )}
                </button>
                
                {file && !uploading && (
                  <button
                    type="button"
                    className="btn btn-secondary ml-2"
                    onClick={() => {
                      setFile(null);
                      const fileInput = document.getElementById('file-input');
                      if (fileInput) fileInput.value = '';
                    }}
                  >
                    Clear File
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Upload Result */}
        {uploadResult && (
          <div className="card">
            <div className="card-header bg-success text-white">
              <h5 className="mb-0">Upload Successful!</h5>
            </div>
            <div className="card-body">
              <p><strong>Message:</strong> {uploadResult.message}</p>
              <p><strong>Tasks Created:</strong> {uploadResult.data?.length || 0}</p>
              
              <div className="mt-3">
                <Link href="/tasks" className="btn btn-primary mr-2">
                  View All Tasks
                </Link>
                <button
                  className="btn btn-success"
                  onClick={() => setUploadResult(null)}
                >
                  Upload Another File
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .upload-area {
          border: 2px dashed #ccc;
          border-radius: 10px;
          padding: 3rem 2rem;
          text-align: center;
          background-color: #f8f9fa;
          cursor: pointer;
          transition: all 0.3s ease;
          position: relative;
        }

        .upload-area:hover {
          border-color: var(--primary);
          background-color: rgba(78, 115, 223, 0.05);
        }

        .upload-content {
          pointer-events: none;
        }

        .upload-icon {
          margin-bottom: 1rem;
        }

        .file-input {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          opacity: 0;
          cursor: pointer;
          pointer-events: all;
        }

        .selected-file {
          margin-top: 1rem;
          padding: 1rem;
          background-color: #e9ecef;
          border-radius: 5px;
          pointer-events: all;
        }

        .spinner-border {
          width: 1rem;
          height: 1rem;
          border: 0.125em solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spinner-border 0.75s linear infinite;
        }

        .spinner-border-sm {
          width: 0.875rem;
          height: 0.875rem;
          border-width: 0.125em;
        }

        @keyframes spinner-border {
          to {
            transform: rotate(360deg);
          }
        }

        .row {
          display: flex;
          flex-wrap: wrap;
          margin: -0.75rem;
        }

        .col-md-6 {
          flex: 0 0 50%;
          max-width: 50%;
          padding: 0 0.75rem;
        }

        @media (max-width: 768px) {
          .col-md-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
        }

        .mr-2 {
          margin-right: 0.5rem;
        }

        .ml-2 {
          margin-left: 0.5rem;
        }

        .mt-3 {
          margin-top: 1rem;
        }

        .btn {
          text-decoration: none;
        }

        .btn:hover {
          text-decoration: none;
        }

        .bg-success {
          background-color: var(--success) !important;
        }

        .text-white {
          color: #fff !important;
        }

        .text-muted {
          color: #6c757d !important;
        }

        .text-primary {
          color: var(--primary) !important;
        }
      `}</style>
    </>
  );
}