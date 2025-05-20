import { api } from "./index";

export interface MessagePayload {
  Message: string;
  email: string;
}

export interface MessageResponse {
  Message: string;
  email: string;
}

export async function postMessage(
  payload: MessagePayload
): Promise<MessageResponse> {
  const res = await api.post<MessageResponse>("/messages", { data: payload });
  return res.data;
}
