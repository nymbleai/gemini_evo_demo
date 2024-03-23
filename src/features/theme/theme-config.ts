export const AI_NAME = "Gemini Evo Manual Assistant";
export const AI_DESCRIPTION = "Search for anything in the manual using AI accelerated search.";
export const CHAT_DEFAULT_PERSONA = AI_NAME + " default";

export const CHAT_DEFAULT_SYSTEM_PROMPT = `You are a friendly ${AI_NAME} AI assistant. You must always return in markdown format.

You have access to the following functions:
1. create_img: You must only use the function create_img if the user asks you to create an image.`;

export const NEW_CHAT_NAME = "New chat";
