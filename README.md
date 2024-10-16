# ChatPDF Clone

## Introduction

Welcome to the **ChatPDF Clone App** repository! This application replicates the core functionality of ChatPDF, providing AI-powered document search and retrieval. Users can upload PDFs, query them, and retrieve detailed answers using **Retrieval Augmented Generation (RAG)**. This system overcomes token/context limitations by efficiently processing large documents and providing seamless user interactions.

## Tech Stack

The app is powered by the following technologies:

- **Next.js**: Framework for server-side rendering and building the frontend.
- **Clerk Auth**: User authentication and management.
- **DrizzleORM + NeonDB (Serverless PostgreSQL)**: Lightweight ORM and serverless PostgreSQL for efficient database operations.
- **Stripe**: Payment processing for premium features.
- **AWS S3**: Cloud storage for securely storing and retrieving PDF documents.

## AI Tech Stack

- **PineconeDB**: Manages vector embeddings for document similarity search.
- **Langchain**: Integrates OpenAI with PineconeDB for query handling.
- **OpenAI**: Provides the AI-based natural language processing (NLP) and query generation.
- **Vercel AI SDK**: Supports AI functionalities within the Vercel platform.

## AI-RAG Workflow

### How Retrieval Augmented Generation (RAG) Works:

1. **PDF Upload**: User uploads a PDF.
2. **Document Segmentation**: The PDF is split and segmented into manageable parts.
3. **Vectorization and Embedding**: Each segment is vectorized and stored in PineconeDB.
4. **Storage**: The vectorized embeddings are stored in PineconeDB for later querying.

### Search Process:

1. **Query Embedding**: The user's query is embedded.
2. **Vector Search**: PineconeDB searches for similar vectors.
3. **Metadata Extraction**: Metadata from matching vectors is extracted.
4. **Prompt to OpenAI**: The metadata is used to generate the final response using OpenAI.

## Advantages of ChatPDF Clone

- **No Token/Context Limit**: Unlike standard ChatGPT models, ChatPDF Clone can process and retrieve data from large documents without running into token limitations.
- **Efficient Document Search**: Enables quick search and extraction from large PDFs, making it ideal for research, legal, and academic use cases.

## How to Use

1. **Clone the repository**: 
   ```bash
   git clone https://github.com/your-repo/chatpdf-clone.git
   cd chatpdf-clone
   ```
2. **Install dependencies**: 
   ```bash
   npm install
   ```
3. **Set up environment variables**:
   - **Clerk Auth**: Set up Clerk API keys.
   - **NeonDB**: Configure serverless PostgreSQL credentials.
   - **AWS S3**: Set up AWS S3 bucket and access keys.
   - **Stripe**: Add Stripe keys for payment processing.
   - **PineconeDB**: API keys and configuration for vector database.
   - **OpenAI**: API key for OpenAI integration.

4. **Run the app**:
   ```bash
   npm run dev
   ```

## Future Improvements

- Add support for additional file formats (e.g., DOCX, XLSX).
- Implement user dashboard for managing stored documents.
- Add multilingual support for document retrieval.

##Resources:
https://youtu.be/r895rFUbGtE?si=AEBX2NFE4CxG6avF
