/**
 * Utility functions for blob and file operations
 */

/**
 * Converts a Blob to a base64 string
 */
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Converts a base64 string to a Blob
 */
export const base64ToBlob = async (base64: string): Promise<Blob> => {
  const response = await fetch(base64);
  return response.blob();
};

/**
 * Gets file extension from base64 data URL
 */
export const getFileExtensionFromBase64 = (base64: string): string => {
  const match = base64.match(/data:image\/([a-zA-Z]*);base64/);
  return match ? match[1] : 'png';
};

/**
 * Validates if string is a valid base64 data URL
 */
export const isValidBase64DataUrl = (str: string): boolean => {
  return /^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,/.test(str);
};

/**
 * Converts file size in bytes to human readable format
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * Gets blob size and type information
 */
export const getBlobInfo = (blob: Blob) => {
  return {
    size: blob.size,
    type: blob.type,
    formattedSize: formatFileSize(blob.size)
  };
};