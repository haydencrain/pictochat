import { useState, useCallback } from 'react';
import { readFile } from '../utils/FileHelpers';

/**
 * A React Hook that provides functionality for asynchronously creating the base64 string of an image File
 * @param params - callback functions to use
 */
export function useImage(params: {
  onSetImageDone?: () => void;
}): {
  /**
   * The current image being used (can be null if no image is being processed)
   */
  image: File;
  /**
   * The base64 string of the image (can be null if still being processed)
   */
  base64: string;
  /**
   * A function which sets a new image to be processed
   * @function
   * @param img - The new image to process
   */
  addNewImage: (img: File) => void;
  /**
   * Clears the currently processed image
   */
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
