import { useDropzone } from "react-dropzone";
import Button from "../ui/forms/Button";

interface FileDropzoneProps {
  handleImportState: (state: { nonce: string; data: string }) => void;
}

function FileDropzone(props: FileDropzoneProps) {
  const { handleImportState } = props;

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/json": [".json"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles: File[], fileRejections, event) => {
      for (const f of acceptedFiles) {
        const contents = await f.text();
        try {
          const object = JSON.parse(contents);
          if (!object.nonce || !object.data) {
            return;
          }

          handleImportState(object);
        } catch (err) {}
      }
    }
  });

  return (
    <>
      <div className="mt-4 w-full">
        <div
          {...getRootProps()}
          className={`w-full rounded-lg focus:outline-none border-2 border-gray-300 border-dashed flex flex-col justify-center ${
            isDragActive && "bg-gray-800"
          } `}
        >
          <input {...getInputProps()} />
          <div className="mt-4 select-none mx-auto">Drag and drop a file here</div>
          <span className="mx-auto my-4">
            <Button stopPropagation={false}>Upload</Button>
          </span>
        </div>
      </div>
    </>
  );
}

export default FileDropzone;
