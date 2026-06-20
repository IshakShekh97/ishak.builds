"use client";

import React, { useState, useRef, useEffect } from "react";
import { Upload, RotateCw, ZoomIn, ZoomOut, Check, Crop, ArrowRight, AlertCircle } from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinary-client";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  aspectRatio?: "1:1" | "4:3" | "16:9" | "free";
  maxOutputWidth?: number; // Target width to resize to
  className?: string;
  label?: string;
  presetName?: string;
}

export function ImageUploader({
  onUploadSuccess,
  aspectRatio = "1:1",
  maxOutputWidth = 800,
  className,
  label = "Upload Image",
}: ImageUploaderProps) {
  // States
  const [dragActive, setDragActive] = useState(false);
  const [srcImage, setSrcImage] = useState<string | null>(null);
  const [croppedPreview, setCroppedPreview] = useState<string | null>(null);
  const [croppedBlob, setCroppedBlob] = useState<Blob | null>(null);
  
  // Crop settings
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0); // 0, 90, 180, 270
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Upload states
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);

  // Aspect ratio calculations for viewport container
  const getAspectRatioClasses = () => {
    switch (aspectRatio) {
      case "16:9":
        return "aspect-video w-full max-w-[400px]";
      case "4:3":
        return "aspect-[4/3] w-full max-w-[350px]";
      case "1:1":
      default:
        return "w-[240px] h-[240px] rounded-none";
    }
  };

  const isCircular = aspectRatio === "1:1"; // circular crop overlay for avatars

  // File Handlers
  const handleFiles = (files: FileList) => {
    const file = files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setSrcImage(e.target.result as string);
          setCroppedPreview(null);
          setCroppedBlob(null);
          setUploadedUrl(null);
          setUploadError(null);
          setScale(1);
          setRotation(0);
          setOffset({ x: 0, y: 0 });
        }
      };
      reader.readAsDataURL(file);
    } else {
      setUploadError("Please select a valid image file.");
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
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Pointer Events for Panning the Image
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!srcImage || croppedPreview) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const newX = e.clientX - dragStart.x;
    const newY = e.clientY - dragStart.y;
    setOffset({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  // Rotate Image
  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
    setOffset({ x: 0, y: 0 }); // reset offset on rotation
  };

  // Process and Crop Image using Canvas
  const applyCrop = () => {
    if (!imgRef.current || !viewportRef.current) return;

    const img = imgRef.current;
    const viewport = viewportRef.current;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    const viewportWidth = viewport.clientWidth;
    const viewportHeight = viewport.clientHeight;

    // Set output target size, maintaining aspect ratio
    let targetWidth = maxOutputWidth;
    let targetHeight = maxOutputWidth;

    if (aspectRatio === "16:9") {
      targetHeight = Math.round((maxOutputWidth * 9) / 16);
    } else if (aspectRatio === "4:3") {
      targetHeight = Math.round((maxOutputWidth * 3) / 4);
    }

    canvas.width = targetWidth;
    canvas.height = targetHeight;

    ctx.clearRect(0, 0, targetWidth, targetHeight);

    // Calculate scale factor relative to target size
    const destScaleX = targetWidth / viewportWidth;
    const destScaleY = targetHeight / viewportHeight;

    // Translate to center of canvas for rotation & scaling
    ctx.translate(targetWidth / 2, targetHeight / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    // Get current dimensions and scale
    const renderedWidth = img.clientWidth;
    const renderedHeight = img.clientHeight;

    const finalScale = scale * destScaleX;

    // Apply translation offset from user pan
    const transX = offset.x * destScaleX;
    const transY = offset.y * destScaleY;

    // Draw the image
    ctx.drawImage(
      img,
      -renderedWidth / 2 + transX / scale,
      -renderedHeight / 2 + transY / scale,
      renderedWidth * scale,
      renderedHeight * scale
    );

    // Convert canvas to Data URL for preview and Blob for upload
    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);
    setCroppedPreview(dataUrl);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          setCroppedBlob(blob);
        }
      },
      "image/jpeg",
      0.9
    );
  };

  // Upload processed image to Cloudinary
  const handleUpload = async () => {
    if (!croppedBlob) return;

    setUploadProgress(0);
    setUploadError(null);

    try {
      const response = await uploadToCloudinary(croppedBlob, (percent) => {
        setUploadProgress(percent);
      });

      setUploadedUrl(response.secure_url);
      setUploadProgress(null);
      onUploadSuccess(response.secure_url);
    } catch (err: any) {
      setUploadProgress(null);
      setUploadError(err.message || "An error occurred during upload.");
    }
  };

  const handleReset = () => {
    setSrcImage(null);
    setCroppedPreview(null);
    setCroppedBlob(null);
    setUploadedUrl(null);
    setUploadError(null);
    setUploadProgress(null);
  };

  return (
    <div className={cn("w-full flex flex-col gap-6", className)}>
      {/* File input element */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* No Image State: Drag & Drop Zone */}
      {!srcImage && (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={triggerFileInput}
          className={cn(
            "border-2 border-dashed border-foreground/30 hover:border-accent bg-secondary/10 p-10 flex flex-col items-center justify-center gap-4 text-center cursor-crosshair transition-all select-none duration-300 relative min-h-[200px]",
            dragActive && "border-accent bg-accent/5 scale-[0.99]"
          )}
        >
          <div className="w-12 h-12 border border-foreground/30 bg-background flex items-center justify-center text-muted-foreground group-hover:text-accent">
            <Upload size={18} className="animate-pulse" />
          </div>
          <div className="space-y-1">
            <span className="font-sans font-black text-sm uppercase tracking-tighter text-foreground block">
              {label}
            </span>
            <span className="font-mono text-[9px] text-muted-foreground block uppercase">
              DRAG & DROP OR CLICK TO INGEST IMAGE FILE
            </span>
          </div>
        </div>
      )}

      {/* Image Loaded: Cropping Panel */}
      {srcImage && !croppedPreview && (
        <div className="border border-border/20 bg-background/50 backdrop-blur-[6px] p-6 flex flex-col items-center gap-6 shadow-[4px_4px_0px_var(--color-accent)]">
          <div className="w-full flex justify-between items-center border-b border-border/30 pb-3">
            <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-accent">
              [ STAGE_IMAGE_CROPPING ]
            </span>
            <button
              onClick={handleReset}
              className="font-mono text-[9px] text-muted-foreground hover:text-red-500 uppercase border border-border/30 px-2 py-0.5"
            >
              Cancel
            </button>
          </div>

          {/* Viewport for cropping */}
          <div
            ref={viewportRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            className={cn(
              "relative overflow-hidden bg-secondary/20 border-2 border-foreground cursor-move select-none flex items-center justify-center",
              getAspectRatioClasses()
            )}
          >
            {/* Image to crop */}
            <img
              ref={imgRef}
              src={srcImage}
              alt="Source crop"
              draggable={false}
              className="absolute pointer-events-none max-w-none origin-center transition-transform duration-75 select-none"
              style={{
                transform: `translate(${offset.x}px, ${offset.y}px) rotate(${rotation}deg) scale(${scale})`,
                maxHeight: "100%",
              }}
            />

            {/* Bounding box guide overlay */}
            <div
              className={cn(
                "absolute inset-0 pointer-events-none border-2 border-accent border-dashed mix-blend-difference bg-black/20",
                isCircular && "rounded-full"
              )}
            />
          </div>

          {/* Controls HUD */}
          <div className="w-full space-y-4">
            {/* Zoom Slider */}
            <div className="space-y-1">
              <div className="flex justify-between items-center font-mono text-[9px] text-muted-foreground">
                <span className="flex items-center gap-1"><ZoomOut size={10} /> ZOOM OUT</span>
                <span className="font-bold text-foreground">{Math.round(scale * 100)}%</span>
                <span className="flex items-center gap-1"><ZoomIn size={10} /> ZOOM IN</span>
              </div>
              <input
                type="range"
                min="1"
                max="3"
                step="0.05"
                value={scale}
                onChange={(e) => setScale(parseFloat(e.target.value))}
                className="w-full accent-accent h-1 bg-secondary border border-border/40 appearance-none cursor-pointer"
              />
            </div>

            {/* Rotator and Apply Controls */}
            <div className="flex gap-4 w-full">
              <button
                type="button"
                onClick={handleRotate}
                className="flex-1 font-mono text-xs border border-border/20 bg-background/50 hover:bg-secondary/40 py-2.5 flex items-center justify-center gap-2 hover:border-accent transition-all uppercase font-bold"
              >
                <RotateCw size={12} /> Rotate 90°
              </button>

              <button
                type="button"
                onClick={applyCrop}
                className="flex-1 font-mono text-xs border border-foreground bg-foreground text-background hover:bg-accent hover:text-accent-foreground py-2.5 flex items-center justify-center gap-2 transition-all uppercase font-black"
              >
                <Crop size={12} /> Apply Crop
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cropped Image: Preview and Cloudinary Upload */}
      {croppedPreview && (
        <div className="border border-border/20 bg-background/50 backdrop-blur-[6px] p-6 flex flex-col items-center gap-6 shadow-[4px_4px_0px_var(--color-accent)]">
          <div className="w-full flex justify-between items-center border-b border-border/30 pb-3">
            <span className="font-mono text-[10px] tracking-wider uppercase font-bold text-accent">
              [ CROPPED_PREVIEW ]
            </span>
            {!uploadedUrl && (
              <button
                onClick={() => setCroppedPreview(null)}
                className="font-mono text-[9px] text-muted-foreground hover:text-accent uppercase border border-border/30 px-2 py-0.5"
              >
                Recrop
              </button>
            )}
          </div>

          {/* Render Preview of Cropped Result */}
          <div
            className={cn(
              "overflow-hidden border-2 border-foreground flex items-center justify-center bg-secondary/15 select-all",
              getAspectRatioClasses()
            )}
          >
            <img
              src={croppedPreview}
              alt="Cropped Result Preview"
              className={cn("w-full h-full object-cover", isCircular && "rounded-full")}
            />
          </div>

          {/* Upload Progress Hud */}
          {uploadProgress !== null && (
            <div className="w-full space-y-2">
              <div className="flex justify-between items-center font-mono text-[9px] text-accent font-bold">
                <span>UPLOADING TO CLOUDINARY_STATION...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full h-1.5 bg-secondary border border-border/20 overflow-hidden relative">
                <div
                  className="h-full bg-accent transition-all duration-150"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Upload Error HUD */}
          {uploadError && (
            <div className="w-full border border-red-500/30 bg-red-500/5 p-3 flex gap-2 items-start text-red-500 font-mono text-[10px]">
              <AlertCircle size={14} className="shrink-0 mt-0.5" />
              <div>
                <span className="font-bold uppercase block">UPLOAD_FAILURE:</span>
                {uploadError}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="w-full flex gap-4">
            {!uploadedUrl ? (
              <>
                <button
                  type="button"
                  onClick={handleReset}
                  className="flex-1 font-mono text-xs border border-border/20 bg-background/50 hover:bg-secondary/40 py-2.5 uppercase font-bold transition-all"
                >
                  Discard
                </button>
                <button
                  type="button"
                  disabled={uploadProgress !== null}
                  onClick={handleUpload}
                  className="flex-1 font-mono text-xs border border-accent bg-accent text-accent-foreground hover:bg-transparent hover:text-accent py-2.5 flex items-center justify-center gap-2 transition-all uppercase font-black cursor-crosshair disabled:opacity-50"
                >
                  Upload Image <ArrowRight size={12} />
                </button>
              </>
            ) : (
              <div className="w-full space-y-3">
                <div className="border border-emerald-500/30 bg-emerald-500/5 p-3 flex gap-2 items-center text-emerald-500 font-mono text-[10px] w-full justify-center">
                  <Check size={14} />
                  <span className="font-bold uppercase">ASSET_STORED_IN_CLOUD</span>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="w-full font-mono text-xs border border-border/20 bg-background/50 hover:bg-secondary/40 py-2.5 uppercase font-bold transition-all"
                >
                  Upload Another Image
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
