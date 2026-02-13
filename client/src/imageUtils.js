import imageCompression from 'browser-image-compression';

export const compressImage = async (file) => {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };

  try {
    const compressedFile = await imageCompression.compress(file, options);
    console.log('compressedFile instanceof Blob', compressedFile instanceof Blob);
    console.log(`originalFile size ${file.size / 1024 / 1024} MB`);
    console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`);
    
    return new File([compressedFile], file.name, { type: compressedFile.type });
  } catch (error) {
    console.error('Error compressing image:', error);
    return file;
  }
};

export const getFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};
