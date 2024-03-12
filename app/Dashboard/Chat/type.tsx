export type message = {
  id?: number;
  message: string;
  sender: string;
  time: Date;
};

export type channel = {
  key: string;
  state: string;
  id?: number;
  topic: string;
  name: string;
  picture: string;
  messages: message[];
};

export type conversation = {
  id?: number;
  messages: message[];
};

export type target = {
  channel?: channel;
  conversation?: conversation;
  type: string;
};

export type user = {
  id: number;
  googleId: string;
  fortytwoId: number;
  username: string;
  name: string;
  password: string;
  picture: string;
  banner_picture: string;
  status: string;
  level: number;
  createdAt: Date;
  twoFa: boolean;
  twoFaSecret: string;
};
