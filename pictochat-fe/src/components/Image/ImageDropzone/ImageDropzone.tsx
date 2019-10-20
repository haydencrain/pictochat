import * as React from 'react';
import classnames from 'classnames';
import { useDropzone } from 'react-dropzone';
import { Icon } from 'semantic-ui-react';
import './ImageDropzone.less';

/**
 * Prop interface for the ImageDropzone component
 * @interface
 */
interface ImageDropzoneProps {
  /**
   * A callback function that will execute after an image has been uploaded to the dropzone input.
   * @function
   * @param { File } image - The image file that has been uploaded
   */
  onImageUpload?: (image: File) => void;
}

/**
 * A component which provides an area for uploading images.
 * A user is able to upload to upload a file by either clicking within the area,
 * or dragging and dropping the file into the area,
 * @component
 * @param { ImageDropzoneProps } props - The component's props
 */
export default function ImageDropzone(props: ImageDropzoneProps) {
  /* Hooks */
  const { errorMessage, onDropAccepted, onDropRejected, onDragOver } = useImageDropzone({
    onUpload: props.onImageUpload
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/jpeg, image/png, image/gif',
    multiple: false,
    onDropAccepted,
    onDropRejected,
    onDragOver
  });

  /* Rendering */

  const getMessage = () => {
    if (!!errorMessage) return errorMessage;
    if (isDragActive) return 'Drop the image here ...';
    return "Drag 'n' drop an image here, or click to select the image";
  };

  const errorClassName = !!errorMessage && 'upload-error';
  const className = classnames('image-dropzone', errorClassName);

  return (
    <div {...getRootProps({ className })}>
      <input {...getInputProps()} />
      <div className="image-dropzone-content">
        <Icon name="file image outline" size="huge" />
        <p>{getMessage()}</p>
      </div>
    </div>
  );
}

/**
 * a React Hook which provides functionality for ImageDropzone file upload
 * @param { Object } params - useImageDropzone hook parameters
 * @returns { Object } Callback functions that are passed into the useDropzone hook, and an error message
 */
function useImageDropzone(params: {
  /**
   * Callback function that executes once an image file has been accepted
   * @function
   * @param { File } image - The accepted image
   */
  onUpload?: (image: File) => void;
}): {
  errorMessage: string;
  onDropAccepted: (rejectedFiles: File[]) => void;
  onDropRejected: (acceptedFiles: File[]) => void;
  onDragOver: (event: React.DragEvent<HTMLElement>) => void;
} {
  const { onUpload } = params;
  const [errorMessage, setErrorMessage] = React.useState<string>();
  const onDropAccepted = React.useCallback((acceptedFiles: File[]) => {
    !!onUpload && params.onUpload(acceptedFiles[0]);
  }, []);
  const onDropRejected = React.useCallback((rejectedFiles: File[]) => {
    setErrorMessage('File is not an accepted image type!');
  }, []);
  const onDragOver = React.useCallback((event: React.DragEvent<HTMLElement>) => {
    setErrorMessage('');
  }, []);

  return {
    errorMessage,
    onDropAccepted,
    onDropRejected,
    onDragOver
  };
}
