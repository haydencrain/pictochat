import * as React from 'react';
import * as classNames from 'classnames';
import { useDropzone } from 'react-dropzone';
import { useImageDropzoneUpload } from '../../hooks/DropzoneHooks';
import { Icon } from 'semantic-ui-react';
import './ImageUpload.less';

interface ImageUploadProps {
  onImageUpload: (image: File) => void;
}

export default function ImageUpload(props: ImageUploadProps) {
  const { errorMessage, onDropAccepted, onDropRejected, onDragOver } = useImageDropzoneUpload({
    onUpload: props.onImageUpload
  });
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'image/jpeg, image/png, image/gif',
    multiple: false,
    onDropAccepted,
    onDropRejected,
    onDragOver
  });

  const getMessage = () => {
    if (!!errorMessage) return errorMessage;
    if (isDragActive) return 'Drop the image here ...';
    return "Drag 'n' drop an image here, or click to select the image";
  };

  const errorClassName = !!errorMessage && 'upload-error';
  const className = classNames('image-dropzone', errorClassName);

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
