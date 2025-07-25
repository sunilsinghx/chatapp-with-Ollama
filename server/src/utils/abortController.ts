const abortControllers = new Map<string, AbortController>();

export const setAbortController = (chatId: string, controller: AbortController) => {
  abortControllers.set(chatId, controller);
};

export const getAbortController = (chatId: string) => abortControllers.get(chatId);

export const removeAbortController = (chatId: string) => abortControllers.delete(chatId);
