import { NextRequest, NextResponse } from 'next/server'
import { newMessageType, RoleType } from '../../components/types'
import { Configuration, OpenAIApi, ChatCompletionRequestMessageRoleEnum } from 'openai'
import GPT3Tokenizer from 'gpt3-tokenizer'

// OpenAI APIの設定
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

// トークンカウントの最大値
const MAX_TOKEN_COUNT = 3000

export async function POST(req: NextRequest) {
  try {
    // 質問とメッセージリスト取得
    const { question, messages } = await req.json()

    // メッセージリストの作成
    const newMessages: newMessageType[] = [
      { role: ChatCompletionRequestMessageRoleEnum.User, content: question },
    ]

    // GPT3Tokenizerの設定
    const tokenizer = new GPT3Tokenizer({ type: 'gpt3' })

    // トークン用カウントの初期化
    let count = 0

    if (messages.length) {
      // 新しいメッセージから履歴に追加
      for (const data of messages.slice().reverse()) {
        let role: RoleType
        // ロール設定
        if (data.type === 'question') {
          role = ChatCompletionRequestMessageRoleEnum.User
        } else {
          role = ChatCompletionRequestMessageRoleEnum.Assistant
        }

        // トークン数取得
        const encoded = tokenizer.encode(data.text)
        // カウント計算
        const newCount = count + encoded.text.length

        // カウントがMAX_TOKEN_COUNTを超えたら履歴の追加をやめる
        if (newCount > MAX_TOKEN_COUNT) {
          break
        }

        // カウントを更新
        count = newCount

        // 履歴に追加
        newMessages.push({ role, content: data.text })
      }
    }

    // メッセージを古い順に並び替え
    newMessages.reverse()

    // システムメッセージを配列の先頭に追加
    newMessages.unshift({
      role: ChatCompletionRequestMessageRoleEnum.System,
      content: 'あなたはAIアシスタントです。簡潔に答えてください。',
    })

    // ChatGPTによる応答
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: newMessages,
      max_tokens: 256,
      temperature: 0.7,
    })

    // 応答メッセージを取得
    const message = completion.data.choices[0].message?.content

    return NextResponse.json({ response: message })
  } catch (error) {
    console.log('error', error)
    return NextResponse.error()
  }
}