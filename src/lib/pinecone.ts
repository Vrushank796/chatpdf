import { Pinecone, PineconeRecord } from "@pinecone-database/pinecone";
import { downloadFromS3 } from "./s3-server";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import md5 from "md5";
import {
  Document,
  RecursiveCharacterTextSplitter,
} from "@pinecone-database/doc-splitter";
import { getEmbeddings } from "./embeddings";
import { convertToAscii } from "./utils";

let pinecone: Pinecone | null = null;

export const getPineconeClient = async () => {
  if (!pinecone) {
    pinecone = new Pinecone({
      apiKey: process.env.PINECONE_API_KEY!,
    });
  }
  return pinecone;
};

type PDFPage = {
  pageContent: string;
  metadata: {
    loc: { pageNumber: number };
  };
};
export async function loadS3IntoPinecone(fileKey: string) {
  // 1. Obtain the pdf -> download and read the pdf
  console.log("downloading s3 into file system");
  const file_name = await downloadFromS3(fileKey);

  if (!file_name) {
    throw new Error("Could not download file from s3");
  }
  const loader = new PDFLoader(file_name);
  const pages = (await loader.load()) as PDFPage[];

  // 2. split and segment the pdf pages into documents
  const documents = await Promise.all(pages.map(prepareDocument));

  // 3. vectorize and embed individual documents
  const vectors = await Promise.all(documents.flat().map(embedDocuments));

  // Filter out any undefined vectors
  const validVectors = vectors.filter(
    (vector): vector is PineconeRecord => vector !== undefined
  );

  // 4. Upload to pinecone
  const client = await getPineconeClient();
  const pineconeIndex = client.Index("chatpdf");

  const namespace = pineconeIndex.namespace(convertToAscii(fileKey));

  console.log("inserting vectors into pinecone");

  if (validVectors.length > 0) {
    await namespace.upsert(validVectors); // Now validVectors is guaranteed to be PineconeRecord[]
  } else {
    console.warn("No valid vectors to insert into Pinecone.");
  }

  return documents[0];
}

async function embedDocuments(doc: Document) {
  try {
    const embeddings = await getEmbeddings(doc.pageContent);
    const hash = md5(doc.pageContent);

    return {
      id: hash,
      values: embeddings,
      metadata: {
        text: doc.metadata.text,
        pageNumber: doc.metadata.pageNumber,
      },
    } as PineconeRecord;
  } catch (error) {
    console.log("error embedding document", error);
  }
}

// truncate string by bytes
export const truncateStringByBytes = (str: string, bytes: number) => {
  const enc = new TextEncoder();
  return new TextDecoder("utf-8").decode(enc.encode(str).slice(0, bytes));
};

async function prepareDocument(page: PDFPage) {
  let { pageContent, metadata } = page;

  // replace newlines with empty spaces
  pageContent = pageContent.replace(/\n/g, "");

  // split the docs
  const splitter = new RecursiveCharacterTextSplitter();
  const docs = await splitter.splitDocuments([
    new Document({
      pageContent,
      metadata: {
        pageNumber: metadata.loc.pageNumber,
        text: truncateStringByBytes(pageContent, 36000),
      },
    }),
  ]);

  return docs;
}
