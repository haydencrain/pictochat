import { useState, useCallback } from 'react';
import { readFile } from '../utils/FileHelpers';

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
