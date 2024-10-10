import { getEmbeddings } from "./embeddings";
import { Pinecone } from "@pinecone-database/pinecone";
import { convertToAscii } from "./utils";

export async function getMatchesFromEmbeddings(
  embeddings: number[],
  fileKey: string
) {
  const pinecone = new Pinecone({
    apiKey: process.env.PINECONE_API_KEY!,
  });
  const index = pinecone.Index("chatpdf");

  try {
    const queryResult = await index.namespace(convertToAscii(fileKey)).query({
      topK: 5,
      vector: embeddings,
      includeMetadata: true,
    });

    return queryResult.matches || [];
  } catch (error) {
    console.log("error querying pinecone", error);
    throw error;
  }
}

export async function getContext(query: string, fileKey: string) {
  const queryEmbedding = await getEmbeddings(query);
  const matches = await getMatchesFromEmbeddings(queryEmbedding, fileKey);

  const qualifyingDocs = matches.filter(
    (match) => match.score && match.score > 0.7
  );

  type Metadata = {
    text: string;
    pageNumber: number;
  };

  let docs = qualifyingDocs.map((match) => (match.metadata as Metadata).text);
  // 5 vectors
  return docs.join("\n").substring(0, 3000);
}
