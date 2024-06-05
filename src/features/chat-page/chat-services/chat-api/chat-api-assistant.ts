"use server";
import "server-only";

import { OpenAIInstance } from "@/features/common/services/openai";
import { FindExtensionByID } from "@/features/extensions-page/extension-services/extension-service";
import { RunnableToolFunction } from "openai/lib/RunnableFunction";
import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";
import { ChatCompletionMessageParam } from "openai/resources/chat/completions";
import { ChatThreadModel } from "../models";
import { AssistantStream } from "openai/lib/AssistantStream.mjs";
export const ChatApiAssistant = async (props: {
    chatThread: ChatThreadModel;
    userMessage: string;
    history: ChatCompletionMessageParam[];
    extensions: RunnableToolFunction<any>[];
    signal: AbortSignal;
}): Promise<AssistantStream> => {
    const { userMessage, history, signal, chatThread, extensions } = props;

    const openAI = OpenAIInstance();
    if (!chatThread.assistant_thread_id) {
        const thread = await openAI.beta.threads.create();
        chatThread.assistant_thread_id=thread.id
    }

    const message = await openAI.beta.threads.messages.create(
        chatThread.assistant_thread_id,
        {
            role: "user",
            content: userMessage,
        }
    );
    const run = openAI.beta.threads.runs.stream(chatThread.assistant_thread_id, {
        assistant_id: process.env.GEMINI_ASSISTANT_ID!
    })
    return run
};
