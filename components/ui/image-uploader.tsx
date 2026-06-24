"use client";

import { AlertCircle, ArrowRight, Check, Trash, Upload } from "lucide-react";
import type React from "react";
import { useRef, useState } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary-client";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  aspectRatio?: "1:1" | "4:3" | "16:9" | "free";
  className?: string;
  label?: string;
}

export function ImageUploader({
  onUploadSuccess,
  aspectRatio = "1:1",
  className,
  label = "Upload Image",
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Upload status states
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case "16:9":
        return "aspect-video w-full max-w-[400px]";
      case "4:3":
        return "aspect-[4/3] w-full max-w-[350px]";
      default:
        return "w-[200px] h-[200px] rounded-none";
    }
  };

  const isCircular = aspectRatio === "1:1";

  const handleFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setUploadedUrl(null);
      setUploadError(null);
      setUploadProgress(null);
    } else {
      setUploadError("Invalid file type. Please select an image.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploadProgress(0);
    setUploadError(null);

    try {
      const response = await uploadToCloudinary(selectedFile, (percent) => {
        setUploadProgress(percent);
      });

      setUploadedUrl(response.secure_url);
      onUploadSuccess(response.secure_url);
      setUploadProgress(null);
    } catch (err: unknown) {
      setUploadProgress(null);
      const msg = err instanceof Error ? err.message : String(err);
      setUploadError(msg);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    setUploadedUrl(null);
    setUploadError(null);
    setUploadProgress(null);
  };

  return (
    <div className={cn("w-full flex flex-col gap-4", className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Drag & Drop Area */}
      {!previewUrl && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={cn(
            "border-2 border-dashed border-foreground/30 hover:border-accent bg-secondary/5 p-8 flex flex-col items-center justify-center gap-3 text-center cursor-pointer transition-all select-none duration-300 relative min-h-[160px]",
            dragActive && "border-accent bg-accent/5 scale-[0.99]",
          )}
        >
          <div className="w-10 h-10 border border-foreground/30 bg-background flex items-center justify-center text-muted-foreground">
            <Upload size={16} />
          </div>
          <div className="space-y-1">
            <span className="font-sans font-black text-xs uppercase tracking-tighter text-foreground block">
              {label}
            </span>
            <span className="font-mono text-[9px] text-muted-foreground block uppercase">
              DRAG & DROP OR CLICK TO INGEST FILE
            </span>
          </div>
        </div>
      )}

      {/* Selected Image Preview & Action HUD */}
      {previewUrl && (
        <div className="border border-border/20 bg-background/50 backdrop-blur-[6px] p-4 flex flex-col items-center gap-4 shadow-[4px_4px_0px_var(--color-accent)]">
          <div className="w-full flex justify-between items-center border-b border-border/30 pb-2">
            <span className="font-mono text-[9px] tracking-wider uppercase font-bold text-accent">
              [ STAGE_ASSET_INGESTION ]
            </span>
            {!uploadedUrl && uploadProgress === null && (
              <button
                type="button"
                onClick={handleReset}
                className="font-mono text-[9px] text-muted-foreground hover:text-red-500 uppercase border border-border/30 px-2 py-0.5"
              >
                Discard
              </button>
            )}
          </div>

          {/* Render Preview Container */}
          <div
            className={cn(
              "overflow-hidden border-2 border-foreground flex items-center justify-center bg-secondary/10 select-none",
              getAspectRatioClasses(),
            )}
          >
            {/* biome-ignore lint/performance/noImgElement: standard image tag is required for dynamic local blob preview */}
            <img
              src={previewUrl}
              alt="Asset Preview"
              className={cn(
                "w-full h-full object-cover",
                isCircular && "rounded-full"
              )}
            />
          </div>

          {/* Upload Progress */}
          {uploadProgress !== null && (
            <div className="w-full space-y-1">
              <div className="flex justify-between items-center font-mono text-[9px] text-accent font-bold">
                <span>UPLOADING_TO_CLOUD...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1 bg-secondary border border-border/20 overflow-hidden relative">
                <div
                  className="h-full bg-accent transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Error Feed */}
          {uploadError && (
            <div className="w-full border border-red-500/30 bg-red-500/5 p-3 flex gap-2 items-start text-red-500 font-mono text-[10px]">
              <AlertCircle size={12} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase block">
                  INGESTION_FAILURE:
                </span>
                {uploadError}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="w-full flex gap-3">
            {!uploadedUrl ? (
              <>
                {uploadProgress === null && (
                  <button
                    type="button"
                    onClick={handleUpload}
                    className="w-full font-mono text-xs border border-accent bg-accent text-accent-foreground hover:bg-transparent hover:text-accent py-2 flex items-center justify-center gap-1.5 transition-all uppercase font-black cursor-pointer"
                  >
                    Upload Asset <ArrowRight size={12} />
                  </button>
                )}
              </>
            ) : (
              <div className="w-full space-y-2">
                <div className="border border-emerald-500/30 bg-emerald-500/5 p-2 flex gap-1.5 items-center text-emerald-500 font-mono text-[10px] w-full justify-center">
                  <Check size={12} />
                  <span className="font-bold uppercase">
                    ASSET_STABILIZED_IN_CLOUD
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full font-mono text-xs border border-border/20 bg-background/50 hover:bg-secondary/20 py-1.5 uppercase font-bold transition-all"
                >
                  Upload Alternate Asset
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
