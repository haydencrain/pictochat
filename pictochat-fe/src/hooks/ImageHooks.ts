import { useState, useCallback } from 'react';
import { readFile } from '../utils/FileHelpers';

export function useImageDropzone(params: {
  onUpload?: (image: File) => void;
}): {
  errorMessage: string;
  onDropAccepted: (rejectedFiles: File[]) => void;
  onDropRejected: (acceptedFiles: File[]) => void;
  onDragOver: (event: React.DragEvent<HTMLElement>) => void;
} {
  const { onUpload } = params;
  const [errorMessage, setErrorMessage] = useState<string>();
  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    !!onUpload && params.onUpload(acceptedFiles[0]);
  }, []);
  const onDropRejected = useCallback((rejectedFiles: File[]) => {
    setErrorMessage('File is not an accepted image type!');
  }, []);
  const onDragOver = useCallback((event: React.DragEvent<HTMLElement>) => {
    setErrorMessage('');
  }, []);

  return {
    errorMessage,
    onDropAccepted,
    onDropRejected,
    onDragOver
  };
}

export function useImage(params: {
  onSetImageDone?: () => void;
}): {
  image: File;
  base64: string;
  addNewImage: (img: File) => void;
  clearImage: () => void;
} {
  const { onSetImageDone } = params;
  const [image, setImage] = useState<File>();
  const [base64, setBase64] = useState<string>();
  const addNewImage = useCallback((img: File) => {
    (async () => {
      const b64 = await readFile(img);
      setImage(img);
      setBase64(b64.toString());
      !!onSetImageDone && onSetImageDone();
    })();
  }, []);
  const clearImage = useCallback(() => {
    setImage(null);
    setBase64(null);
  }, []);

  return {
    image,
    base64,
    addNewImage,
    clearImage
  };
}
