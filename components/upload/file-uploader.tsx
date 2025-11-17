'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { storageService } from '@/lib/services/storage-service';
import toast from 'react-hot-toast';

interface FileUploaderProps {
  bucket: string;
  path: string;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  maxSize?: number; // in bytes
  onUploadComplete?: (urls: string[]) => void;
  onUploadError?: (error: Error) => void;
}

export function FileUploader({
  bucket,
  path,
  accept,
  maxFiles = 10,
  maxSize = 10 * 1024 * 1024, // 10MB default
  onUploadComplete,
  onUploadError,
}: FileUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({});
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const validFiles = acceptedFiles.filter((file) => {
        if (file.size > maxSize) {
          toast.error(`${file.name} is too large. Max size: ${maxSize / 1024 / 1024}MB`);
          return false;
        }
        return true;
      });

      setSelectedFiles((prev) => [...prev, ...validFiles].slice(0, maxFiles));
    },
    [maxFiles, maxSize]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    disabled: uploading,
  });

  const removeFile = (index: number) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress({});

    try {
      const urls = await storageService.uploadMultiple(
        bucket,
        selectedFiles,
        path,
        (index, progress) => {
          setUploadProgress((prev) => ({ ...prev, [index]: progress }));
        }
      );

      toast.success(`Successfully uploaded ${urls.length} file(s)`);
      onUploadComplete?.(urls);
      setSelectedFiles([]);
      setUploadProgress({});
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error('Failed to upload files');
      onUploadError?.(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
          transition-all duration-200
          ${
            isDragActive
              ? 'border-cyan-400 bg-cyan-400/10'
              : 'border-white/20 hover:border-white/40'
          }
          ${uploading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
      >
        <input {...getInputProps()} />
        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
        <p className="text-white text-lg mb-2">
          {isDragActive ? 'Drop files here' : 'Drag & drop files here'}
        </p>
        <p className="text-gray-400 text-sm">
          or click to browse • Max {maxFiles} files • {maxSize / 1024 / 1024}MB each
        </p>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="text-white font-semibold">
              Selected Files ({selectedFiles.length})
            </h4>
            {!uploading && (
              <Button onClick={handleUpload} size="sm" className="bg-cyan-500 hover:bg-cyan-600">
                <Upload className="w-4 h-4 mr-2" />
                Upload All
              </Button>
            )}
          </div>

          <div className="space-y-2">
            {selectedFiles.map((file, index) => (
              <div
                key={index}
                className="glass-card border-white/10 p-3 flex items-center justify-between"
              >
                <div className="flex items-center gap-3 flex-1">
                  <FileIcon className="w-5 h-5 text-cyan-400" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{file.name}</p>
                    <p className="text-gray-400 text-xs">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>

                {uploading && uploadProgress[index] !== undefined ? (
                  <div className="flex items-center gap-2 w-32">
                    <Progress value={uploadProgress[index] || 0} className="flex-1" />
                    <span className="text-xs text-gray-400">{uploadProgress[index] || 0}%</span>
                  </div>
                ) : uploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-gray-400 hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
