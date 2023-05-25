import React, { useCallback, useEffect, useState } from "react";
import { FileMinus, Trash2 } from "react-feather";
import { IconButton } from "./IconButton";

interface FileSpaceProps {
  files?: File[];
  urls?: string[];
  handleDeleteFile: (index: number, file: File|string) => void;
  imagen?: boolean;
}
export const FileSpace: React.FC<FileSpaceProps> = ({
  files,
  handleDeleteFile,
  imagen = false,
  urls,
}) => {
  return (
    <React.Fragment>
        {files
          ? files.map((file, index) => {
              return (
                <div
                  className="flex flex-col justify-center items-center mr-4 mb-4"
                  key={`file-${index}`}
                >
                  {imagen ? (
                    <div className="h-32 w-40 rounded-lg bg-gray-300 overflow-hidden">
                      <ImageLoad file={file} />
                    </div>
                  ) : (
                    <div className="h-32 w-40 px-4 rounded-lg bg-gray-300 text-secondary flex flex-col items-center justify-center">
                      <FileMinus size={24} className="" />
                      <span className="text-sm overflow-x-hidden overflow-ellipsis">
                        {file?.name}
                      </span>
                    </div>
                  )}
                  <IconButton onClick={() => handleDeleteFile(index, file) }>
                    <Trash2
                      size={24}
                      className="text-secondary mt-4 cursor-pointer"
                    />
                  </IconButton>
                </div>
              );
            })
          : urls &&
            urls.map((url, index) => {
              return (
                <div
                  className="flex flex-col justify-center items-center mr-4 mb-4"
                  key={`file-${index}`}
                >
                  <div className="h-32 w-40 rounded-lg bg-gray-300 overflow-hidden">
                    <div
                      className="h-32 w-40 bg-contain bg-center"
                      style={{
                        backgroundImage: `url("${url}")`,
                        backgroundRepeat: "no-repeat",
                      }}
                    />
                  </div>
                  <IconButton onClick={() => handleDeleteFile(index, url)}>
                    <Trash2
                      size={24}
                      className="text-secondary mt-4 cursor-pointer"
                    />
                  </IconButton>
                </div>
              );
            })}
    </React.Fragment>
  );
};

interface ImageLoadProps {
  file: File;
}

const ImageLoad: React.FC<ImageLoadProps> = ({ file }) => {
  const [loading, setLoading] = useState(false);
  const [src, setSrc] = useState<any>();

  const loadImage = useCallback(async () => {
    setLoading(true);
    try {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        setSrc(reader.result);
      };
    } catch (error) {
    } finally {
      setLoading(false);
    }
  }, [file]);

  useEffect(() => {
    loadImage();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      {!loading ? (
        <div
          className="h-32 w-40 bg-contain bg-center"
          style={{
            backgroundImage: `url("${src}")`,
            backgroundRepeat: "no-repeat",
          }}
        />
      ) : (
        <div></div>
      )}
    </div>
  );
};
