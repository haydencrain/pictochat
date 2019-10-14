/**
 * A React Hook that provides functionality for asynchronously creating the base64 string of an image File
 * @function
 * @param params - callback functions to use
 */
export declare function useImage(params: {
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
};
