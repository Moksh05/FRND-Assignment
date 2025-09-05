import { useState, useRef } from 'react';
import { Upload, FileText, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const UploadButton = ({ onFileSelect, isLoading = false }) => {
  const [isDragActive, setIsDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragActive(true);
    } else if (e.type === 'dragleave') {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelection(files[0]);
    }
  };

  const handleFileSelection = (file) => {
    if (file.type === 'text/csv' || file.name.endsWith('.csv')) {
      setSelectedFile(file);
      onFileSelect(file);
    } else {
      alert('Please select a CSV file');
    }
  };

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileSelection(file);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full max-w-md mx-auto">
      {/* File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleInputChange}
        className="hidden"
        disabled={isLoading}
      />

      {/* Drop Zone */}
      <div
        className={`
          relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-smooth hover:border-primary/50
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}
          ${isLoading ? 'pointer-events-none opacity-50' : ''}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <div className="flex flex-col items-center gap-4">
          {isLoading ? (
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
          ) : (
            <div className="p-3 rounded-full bg-primary/10">
              <Upload className="h-8 w-8 text-primary" />
            </div>
          )}
          
          <div>
            <p className="text-lg font-medium text-foreground mb-1">
              {selectedFile ? selectedFile.name : 'Upload CSV File'}
            </p>
            <p className="text-sm text-muted-foreground">
              {isLoading ? 'Processing...' : 'Drop your CSV file here or click to browse'}
            </p>
          </div>

          {selectedFile && !isLoading && (
            <div className="flex items-center gap-2 text-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
              <FileText className="h-4 w-4" />
              <span>CSV file selected</span>
            </div>
          )}
        </div>
      </div>

      {selectedFile && !isLoading && (
        <Button 
          className="w-full mt-4 gradient-purple text-primary-foreground"
          onClick={() => onFileSelect(selectedFile)}
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload & Process
        </Button>
      )}
    </div>
  );
};

export default UploadButton;