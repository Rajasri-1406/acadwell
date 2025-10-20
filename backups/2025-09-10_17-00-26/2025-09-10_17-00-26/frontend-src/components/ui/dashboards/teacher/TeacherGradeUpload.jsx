import React, { useState } from 'react';
import '../../../css/dashboards/teacher/TeacherDashboard.css';

const TeacherGradeUpload = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadStatus, setUploadStatus] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
        setUploadStatus('');
    };

    const handleUploadSubmit = async (event) => {
        event.preventDefault();

        if (!selectedFile) {
            setUploadStatus('Please select a file to upload.');
            return;
        }

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await fetch('/api/teacher/upload_grades', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('teacherToken')}`
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                setUploadStatus(data.message || 'Grades uploaded successfully!');
                setSelectedFile(null);
            } else {
                setUploadStatus(data.error || 'Failed to upload grades. Please try again.');
            }
        } catch (error) {
            console.error('Upload Error:', error);
            setUploadStatus('An error occurred. Please check your connection.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="dashboard-card grade-upload-card">
            <h2 className="card-title">Upload Grades</h2>
            <p className="card-subtitle">Securely upload student assessment marks and semester grades. The system will automatically anonymize the data for peer support purposes.</p>
            
            <form onSubmit={handleUploadSubmit} className="space-y-4">
                <div className="form-group">
                    <label htmlFor="grade-file" className="file-label">Select Grade File (e.g., CSV):</label>
                    <input
                        type="file"
                        id="grade-file"
                        className="file-input"
                        accept=".csv, .xlsx"
                        onChange={handleFileChange}
                        disabled={isUploading}
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="upload-button"
                    disabled={isUploading || !selectedFile}>
                    {isUploading ? 'Uploading...' : 'Upload Grades'}
                </button>
            </form>
            
            {uploadStatus && <p className="status-message">{uploadStatus}</p>}
        </div>
    );
};

export default TeacherGradeUpload;
