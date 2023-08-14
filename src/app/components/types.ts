// キャラクターの型定義
export type CharacterType = {
  value: string
  label: string
  word: string
}

// メッセージの型定義
export type MessageType = {
  text: string
  type: string
}

// ロールの型定義
export type RoleType = 'system' | 'user' | 'assistant'

// ChatGPTのメッセージの型定義
export type newMessageType = {
  role: RoleType
  content: string
}