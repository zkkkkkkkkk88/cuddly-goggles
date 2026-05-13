"use client";

import { useCallback, useRef, useState, DragEvent } from "react";
import { Upload, FileText, X } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

const MAX_FILE_SIZE_MB = 10;

export default function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    setError(null);
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setError("仅接受 PDF 文件。");
      return false;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      setError(`文件过大，最大限制为 ${MAX_FILE_SIZE_MB}MB。`);
      return false;
    }
    return true;
  };

  const handleFile = useCallback(
    (file: File) => {
      if (validateFile(file)) {
        setSelectedFile(file);
        onFileSelect(file);
      }
    },
    [onFileSelect],
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (disabled) return;
      const file = e.dataTransfer.files?.[0];
      if (file) handleFile(file);
    },
    [disabled, handleFile],
  );

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const clearFile = () => {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div
        onClick={handleClick}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-lg border-2 border-dashed p-14 text-center cursor-pointer transition-colors ${
          dragOver && !disabled
            ? "border-amber-500 bg-amber-50"
            : "border-ink-200 hover:border-ink-400 bg-white"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-amber-50 flex items-center justify-center">
              <FileText className="w-6 h-6 text-amber-600" />
            </div>
            <p className="font-semibold text-ink-900">{selectedFile.name}</p>
            <p className="text-sm text-ink-400">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
            {!disabled && (
              <button
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                className="mt-1 text-sm text-ink-400 hover:text-red-500 flex items-center gap-1 transition-colors"
              >
                <X className="w-3 h-3" />
                移除
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-ink-100 flex items-center justify-center">
              <Upload className="w-6 h-6 text-ink-400" />
            </div>
            <div>
              <p className="font-semibold text-ink-900">拖拽 PDF 到此处</p>
              <p className="text-sm text-ink-400 mt-1">
                或点击选择文件 — 最大 {MAX_FILE_SIZE_MB}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-3 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
