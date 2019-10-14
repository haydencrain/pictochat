/// <reference types="react" />
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
export default function ImageDropzone(props: ImageDropzoneProps): JSX.Element;
export {};
