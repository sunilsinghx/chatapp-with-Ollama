const BACKEND_URL =  process.env.NEXT_BACKEND_URL||"http://localhost:5000";

export const getChats = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/chats`);
    const data = await res.json();
    return data;
  } catch (error) {
    console.log("getChats: ", error);
  }
};

export const getChatsById = async ({chatId}:{chatId:string}) => {
  try {
    const res = await fetch(`http://localhost:5000/api/chat/${chatId}`);
    const data = await res.json();
    return data
  } catch (error) {
    console.log("getChatsById: ", error);
  }
};

export const createChat = async () => {
  try {
    const res = await fetch(`${BACKEND_URL}/api/chat`, {
      method: "POST",
    });
    return await res.json();
  } catch (error) {
    console.log("createChat: ", error);
  }
};

export const sendMessage = async ({chatId,message}:{chatId:string,message:string}) => {
  try {
     const res = await fetch(`${BACKEND_URL}/api/chat/${chatId}/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      return res;
  } catch (error) {
    console.log("sendMessage : ", error);

  }
};

export const stopMessage = async ({chatId}:{chatId:string}) => {
  try {
    await fetch(`${BACKEND_URL}/api/chat/${chatId}/stop`, { method: 'POST' });
  } catch (error) {}
};
