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
        className={`relative rounded p-14 text-center cursor-pointer transition-all duration-200 ${
          dragOver && !disabled
            ? "border-2 border-deco-brass bg-deco-brass/5 scale-[1.02]"
            : "border-2 border-dashed border-deco-warmgray/40 bg-white hover:border-deco-brass/50 gold-leaf"
        } ${disabled ? "opacity-40 cursor-not-allowed" : ""}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        {/* Corner ornaments */}
        <div className="absolute top-3 left-3 w-3 h-3 border-t-2 border-l-2 border-deco-brass/40" />
        <div className="absolute top-3 right-3 w-3 h-3 border-t-2 border-r-2 border-deco-brass/40" />
        <div className="absolute bottom-3 left-3 w-3 h-3 border-b-2 border-l-2 border-deco-brass/40" />
        <div className="absolute bottom-3 right-3 w-3 h-3 border-b-2 border-r-2 border-deco-brass/40" />

        {selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 flex items-center justify-center">
              <FileText className="w-7 h-7 text-deco-navy" />
            </div>
            <p className="font-bold text-deco-navy text-lg" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              {selectedFile.name}
            </p>
            <p className="text-sm text-deco-warmgray">
              {(selectedFile.size / 1024).toFixed(1)} KB
            </p>
            {!disabled && (
              <button
                onClick={(e) => { e.stopPropagation(); clearFile(); }}
                className="mt-1 text-sm text-deco-rose hover:text-deco-copper flex items-center gap-1 transition-colors font-medium"
              >
                <X className="w-3 h-3" />
                移除
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-14 h-14 flex items-center justify-center">
              <Upload className="w-7 h-7 text-deco-navy" />
            </div>
            <div>
              <p className="font-bold text-deco-navy text-xl" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                拖拽 PDF 到此处
              </p>
              <p className="text-sm text-deco-warmgray mt-1">
                或点击选择文件 — 最大 {MAX_FILE_SIZE_MB}MB
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="mt-3 border border-deco-rose bg-deco-rose/5 p-3">
          <p className="text-sm text-deco-rose font-medium">{error}</p>
        </div>
      )}
    </div>
  );
}
