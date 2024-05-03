"use client";
import React from "react";
import { Inbox } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { uploadToS3 } from "@/lib/s3";

const FileUpload = () => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      console.log(acceptedFiles);
      const file = acceptedFiles[0];
      if (file.size > 10 * 1024 * 1024) {
        // Bigger than 10MB!
        alert("please uplaod a smaller file");
        return;
      }
      try {
        const data = await uploadToS3(file);
        console.log("data", data);
      } catch (error) {
        console.log(error);
      }
    },
  });
  return (
    <div className="p-2 bg-white rounded-xl">
      <div
        {...getRootProps({
          className:
            "border-dashed border-2 rounded-xl cursor-pointer bg-grey-50 py-8 flex justify-center items-center flex-col",
        })}
      >
        <input {...getInputProps()} />
        <>
          <Inbox className="w-10 h-10 text-blue-500" />
          <p className="text-sm text-gray-500">Drop PDF here</p>
        </>
      </div>
    </div>
  );
};

export default FileUpload;
