import { useState, useCallback } from 'react';

interface useImageDropzoneUploadParams {
  onUpload?: (image: File) => void;
}

export function useImageDropzoneUpload(params: useImageDropzoneUploadParams) {
  const [errorMessage, setErrorMessage] = useState<string>();
  const onDropAccepted = useCallback((acceptedFiles: File[]) => {
    !!params.onUpload && params.onUpload(acceptedFiles[0]);
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
