import React from "react";

type Props = { pdf_url: string };

const PDFViewer = ({ pdf_url }: Props) => {
  return (
    <iframe
      src={`https://docs.google.com/gview?embedded=true&url=${pdf_url}`}
      className="w-full h-full"
    ></iframe>
  );
};

export default PDFViewer;
