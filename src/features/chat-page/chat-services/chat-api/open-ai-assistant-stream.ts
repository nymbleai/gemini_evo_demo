import { AI_NAME } from "@/features/theme/theme-config";
import { ChatCompletionStreamingRunner } from "openai/resources/beta/chat/completions";
import { CreateChatMessage } from "../chat-message-service";
import {
  AzureChatCompletion,
  AzureChatCompletionAbort,
  ChatThreadModel,
  AzureChatCompletionContent
} from "../models";
import { AssistantStream } from "openai/lib/AssistantStream.mjs";
import { ChatCompletionSnapshot } from "openai/lib/ChatCompletionStream";
import { time, timeStamp } from "console";

export const OpenAIStreamAssistant = (props: {
  runner: AssistantStream;
  chatThread: ChatThreadModel;
}) => {
  const encoder = new TextEncoder();

  const { runner, chatThread } = props;

  const readableStream = new ReadableStream({
    async start(controller) {
      const streamResponse = (event: string, value: string) => {
        controller.enqueue(encoder.encode(`event: ${event} \n`));
        controller.enqueue(encoder.encode(`data: ${value} \n\n`));
      };

      let lastMessage = "";

      runner

        .on('textDelta', (textDelta, snapshot) => {
          lastMessage = lastMessage + textDelta.value

          const regex = /【\d+:\d+†source】/g;

          // Replace the matched patterns with an empty string
          lastMessage = lastMessage.replace(regex, '');

          const time = Math.floor(new Date().getTime() / 1000)
          const msg: ChatCompletionSnapshot.Choice.Message = { content: lastMessage }
          const choice: ChatCompletionSnapshot.Choice = { message: msg, finish_reason: null, logprobs: null, index: 0 }
          const completion_obj: ChatCompletionSnapshot = { id: "123", choices: [choice], created: time, model: "gpt-4", system_fingerprint: "123" }

          const response: AzureChatCompletion = {
            type: "content",
            response: completion_obj,
          };

          streamResponse(response.type, JSON.stringify(response));

        })

        .on("abort", (error) => {
          const response: AzureChatCompletionAbort = {
            type: "abort",
            response: "Chat aborted",
          };
          streamResponse(response.type, JSON.stringify(response));
          controller.close();
        })
        .on("error", async (error: any) => {
          console.log("🔴 error", error);
          const response: AzureChatCompletion = {
            type: "error",
            response: error.message,
          };

          // if there is an error still save the last message even though it is not complete
          await CreateChatMessage({
            name: AI_NAME,
            content: lastMessage,
            role: "assistant",
            chatThreadId: props.chatThread.id,
          });

          streamResponse(response.type, JSON.stringify(response));
          controller.close();
        })
        .on("end", async () => {
          await CreateChatMessage({
            name: AI_NAME,
            content: lastMessage,
            role: "assistant",
            chatThreadId: props.chatThread.id,
          });

          const response: AzureChatCompletion = {
            type: "finalContent",
            response: lastMessage,
          };
          streamResponse(response.type, JSON.stringify(response));
          controller.close();
        });
    },
  });

  return readableStream;
};
