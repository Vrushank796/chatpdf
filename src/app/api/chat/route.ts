import { openai } from "@ai-sdk/openai";
import { convertToCoreMessages, streamText } from "ai";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    // const response = await openai.createChatCompletion({
    //   model: "gpt-3.5-turbo",
    //   messages: messages,
    //   stream: true,
    // });

    // const stream = OpenAIStream(response);
    // return new StreamingTextResponse(stream);

    const result = await streamText({
      model: openai("gpt-3.5-turbo"),
      messages: convertToCoreMessages(messages),
    });

    return result.toDataStreamResponse();
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
