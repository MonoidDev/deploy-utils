export interface ParsedCommitMessage {
  bugherdIds: string[];
  atUsers: string[];
}

export const parseCommitMessage = (message: string): ParsedCommitMessage => {
  const atUsers = [...message.matchAll(/@([a-zA-Z]+)/g)].map((m) => m[1]);

  const bugherdIds = [...message.matchAll(/bg#([0-9]+)/g)].map((m) => m[1]);

  return {
    atUsers,
    bugherdIds,
  };
};
