import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

import "./styles.css";
import { FiUpload } from "react-icons/fi";

interface ComponentProps {
  onFileUploaded: (file: File) => void;
}

const Dropzone: React.FC<ComponentProps> = ({ onFileUploaded }) => {
  const [fileURL, setFileURL] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    setFileURL(URL.createObjectURL(file));
    onFileUploaded(file);
  }, [onFileUploaded]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*",
  });

  return (
    <div className="dropzone" {...getRootProps()}>
      <input {...getInputProps()} accept="image/*" />
      {fileURL ? (
        <img src={fileURL} alt="Preview" />
      ) : (
        <p>
          <FiUpload></FiUpload>Imagem do estabelecimento
        </p>
      )}
    </div>
  );
};

export default Dropzone;
