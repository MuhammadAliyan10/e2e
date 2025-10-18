import { cn } from "@/lib/utils";
import React, { JSX, useRef, useState } from "react";
import { motion } from "framer-motion";
import { useDropzone, FileRejection } from "react-dropzone";
import { Upload, FileText, AlertTriangle } from "lucide-react";

const mainVariant = {
  initial: { x: 0, y: 0 },
  animate: { x: 20, y: -20, opacity: 0.9 },
};

const secondaryVariant = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
};

interface FileUploadProps {
  onChange?: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onChange }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [rejectedFiles, setRejectedFiles] = useState<FileRejection[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (newFiles: File[]): void => {
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
    onChange?.(newFiles);
  };

  const handleClick = (): void => {
    fileInputRef.current?.click();
  };

  const { getRootProps, isDragActive } = useDropzone({
    multiple: false,
    noClick: true,
    maxSize: 100 * 1024 * 1024,
    accept: {
      "text/csv": [".csv"],
      "application/json": [".json"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "application/vnd.ms-excel": [".xls"],
      "application/octet-stream": [".parquet"],
    },
    onDrop: handleFileChange,
    onDropRejected: (rejectedFiles: FileRejection[]) => {
      setRejectedFiles(rejectedFiles);
    },
  });

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    handleFileChange(Array.from(e.target.files || []));
  };

  return (
    <div className="w-full" {...getRootProps()}>
      <motion.div
        onClick={handleClick}
        whileHover="animate"
        className="p-10 group/file block rounded-xl cursor-pointer w-full relative overflow-hidden border-2 border-dashed border-muted-foreground/25 hover:border-primary/50 transition-colors"
      >
        <input
          ref={fileInputRef}
          id="file-upload-handle"
          type="file"
          accept=".csv,.json,.xlsx,.xls,.parquet"
          onChange={handleInputChange}
          className="hidden"
        />

        <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,white,transparent)]">
          <GridPattern />
        </div>

        <div className="flex flex-col items-center justify-center relative z-20">
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center">
              <Upload className="w-8 h-8 text-primary" />
            </div>

            <div className="space-y-2">
              <p className="text-xl font-semibold text-foreground">
                Upload Dataset
              </p>
              <p className="text-muted-foreground max-w-md mx-auto">
                Drag and drop your dataset file here, or click to browse
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-4">
                <span className="text-xs bg-muted px-2 py-1 rounded">CSV</span>
                <span className="text-xs bg-muted px-2 py-1 rounded">JSON</span>
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  Excel
                </span>
                <span className="text-xs bg-muted px-2 py-1 rounded">
                  Parquet
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum file size: 100MB
              </p>
            </div>
          </div>

          <div className="relative w-full mt-8 max-w-xl mx-auto">
            {files.length > 0 &&
              files.map((file, idx) => (
                <motion.div
                  key={"file" + idx}
                  layoutId={idx === 0 ? "file-upload" : "file-upload-" + idx}
                  className={cn(
                    "relative overflow-hidden z-40 bg-background border rounded-lg flex flex-col items-start justify-start p-4 mt-4 w-full mx-auto",
                    "shadow-sm"
                  )}
                >
                  <div className="flex justify-between w-full items-center gap-4">
                    <div className="flex items-center gap-3">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        layout
                        className="text-sm font-medium text-foreground truncate max-w-xs"
                      >
                        {file.name}
                      </motion.p>
                    </div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded"
                    >
                      {formatFileSize(file.size)}
                    </motion.p>
                  </div>

                  <div className="flex text-xs items-center w-full mt-2 justify-between text-muted-foreground">
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      className="px-2 py-1 rounded bg-muted/50"
                    >
                      {file.type || "Unknown type"}
                    </motion.p>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                    >
                      Modified{" "}
                      {new Date(file.lastModified).toLocaleDateString()}
                    </motion.p>
                  </div>
                </motion.div>
              ))}

            {rejectedFiles.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg"
              >
                <div className="flex items-center gap-2 text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  <p className="text-sm font-medium">File rejected</p>
                </div>
                {rejectedFiles.map((rejection, idx) => (
                  <div key={idx} className="mt-2 text-xs text-destructive/80">
                    {rejection.file.name}: {rejection.errors[0]?.message}
                  </div>
                ))}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                layoutId="file-upload"
                variants={mainVariant}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                }}
                className={cn(
                  "relative group-hover/file:shadow-lg z-40 bg-background border-2 border-dashed border-muted-foreground/25 flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-lg",
                  "transition-all duration-200"
                )}
              >
                {isDragActive ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-muted-foreground flex flex-col items-center gap-2"
                  >
                    <p className="text-sm">Drop it here</p>
                    <Upload className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <Upload className="h-6 w-6 text-muted-foreground" />
                )}
              </motion.div>
            )}

            {!files.length && (
              <motion.div
                variants={secondaryVariant}
                className="absolute opacity-0 border-2 border-dashed border-primary/50 inset-0 z-30 bg-transparent flex items-center justify-center h-32 mt-4 w-full max-w-[8rem] mx-auto rounded-lg"
              ></motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export function GridPattern(): JSX.Element {
  const columns = 41;
  const rows = 11;
  return (
    <div className="flex bg-muted/30 shrink-0 flex-wrap justify-center items-center gap-x-px gap-y-px scale-105">
      {Array.from({ length: rows }).map((_, row) =>
        Array.from({ length: columns }).map((_, col) => {
          const index = row * columns + col;
          return (
            <div
              key={`${col}-${row}`}
              className={`w-10 h-10 flex shrink-0 rounded-[2px] ${
                index % 2 === 0 ? "bg-muted/20" : "bg-muted/40"
              }`}
            />
          );
        })
      )}
    </div>
  );
}
