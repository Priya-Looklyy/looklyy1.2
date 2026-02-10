'use client';

import { useState } from 'react';
import { Upload, Scissors, Download, Loader2, AlertCircle } from 'lucide-react';
import { removeBackground, canRemoveBackground } from '@/utils/backgroundRemoval';

interface BackgroundRemoverProps {
  onImageProcessed?: (processedImageUrl: string) => void;
}

export default function BackgroundRemover({ onImageProcessed }: BackgroundRemoverProps) {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [processedImage, setProcessedImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [canProcess, setCanProcess] = useState<boolean | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const imageUrl = URL.createObjectURL(file);
    setOriginalImage(imageUrl);
    setProcessedImage(null);
    setError(null);

    // Check if background can be removed
    try {
      const suitable = await canRemoveBackground(imageUrl);
      setCanProcess(suitable);
    } catch (err) {
      console.error('Error checking image:', err);
      setCanProcess(false);
    }
  };

  const handleRemoveBackground = async () => {
    if (!originalImage) return;

    setIsProcessing(true);
    setError(null);

    try {
      const processedUrl = await removeBackground(originalImage);
      setProcessedImage(processedUrl);
      onImageProcessed?.(processedUrl);
    } catch (err) {
      console.error('Error removing background:', err);
      setError('Failed to remove background. Please try a different image.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDownload = () => {
    if (!processedImage) return;

    const link = document.createElement('a');
    link.href = processedImage;
    link.download = 'looklyy-cutout.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="modern-card p-6">
      <div className="mb-6">
        <h3 className="font-display text-xl font-semibold text-gray-900 mb-2">
          Background Remover
        </h3>
        <p className="text-gray-600 text-sm">
          Upload a fashion item image to create a clean cut-out for your canvas
        </p>
      </div>

      {/* Upload Section */}
      {!originalImage && (
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-purple-400 transition-colors">
          <div className="icon-container mx-auto mb-4">
            <Upload className="w-6 h-6 text-white" />
          </div>
          <h4 className="font-display text-lg font-semibold text-gray-900 mb-2">
            Upload Image
          </h4>
          <p className="text-gray-600 text-sm mb-4">
            Choose a fashion item with a clean background
          </p>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="btn-primary cursor-pointer inline-block"
          >
            Choose Image
          </label>
        </div>
      )}

      {/* Processing Section */}
      {originalImage && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original Image */}
            <div>
              <h4 className="font-display text-sm font-semibold text-gray-900 mb-2">
                Original
              </h4>
              <div className="relative rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={originalImage}
                  alt="Original"
                  className="w-full h-48 object-cover"
                />
              </div>
            </div>

            {/* Processed Image */}
            <div>
              <h4 className="font-display text-sm font-semibold text-gray-900 mb-2">
                Background Removed
              </h4>
              <div className="relative rounded-xl overflow-hidden bg-gray-100 bg-opacity-50 bg-[linear-gradient(45deg,#f0f0f0_25%,transparent_25%),linear-gradient(-45deg,#f0f0f0_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f0f0f0_75%),linear-gradient(-45deg,transparent_75%,#f0f0f0_75%)] bg-[length:20px_20px] bg-[position:0_0,0_10px,10px_-10px,-10px_0px]">
                {processedImage ? (
                  <img
                    src={processedImage}
                    alt="Processed"
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Scissors className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Processed image will appear here</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Background Suitability Warning */}
          {canProcess === false && (
            <div className="flex items-center gap-3 p-4 bg-orange-50 border border-orange-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-orange-600 flex-shrink-0" />
              <div>
                <p className="text-orange-800 font-medium text-sm">
                  Complex Background Detected
                </p>
                <p className="text-orange-700 text-xs">
                  This image may not produce optimal results. Try an image with a plain background.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleRemoveBackground}
              disabled={isProcessing}
              className="btn-primary flex items-center gap-2 flex-1 justify-center"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Scissors className="w-4 h-4" />
                  Remove Background
                </>
              )}
            </button>

            {processedImage && (
              <button
                onClick={handleDownload}
                className="btn-secondary flex items-center gap-2 px-4"
              >
                <Download className="w-4 h-4" />
                Download
              </button>
            )}
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setOriginalImage(null);
              setProcessedImage(null);
              setError(null);
              setCanProcess(null);
            }}
            className="w-full text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors"
          >
            Upload Different Image
          </button>
        </div>
      )}
    </div>
  );
}
