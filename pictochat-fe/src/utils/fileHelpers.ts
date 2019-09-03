export async function readFile(file: File): Promise<string | ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onabort = () => reject('file reading was aborted');
    reader.onerror = () => reject('file reading has failed');
    reader.onload = () => {
      const binaryStr = reader.result;
      resolve(binaryStr);
    };
    reader.readAsDataURL(file);
  });
}
