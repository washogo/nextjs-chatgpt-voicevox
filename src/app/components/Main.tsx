'use client';

import { useRef, useState } from 'react';
import { CharacterType, MessageType } from './types';
import { Characters, TestMessages } from './const';
import CharacterSelect from './CharacterSelect';
import axios from 'axios';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import Scroll from './Scroll';
import Character from './Character';

// メインコンポーネント
const Main = () => {
  const [character, setCharacter] = useState<CharacterType>(Characters[0]);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<MessageType[]>([]);
  // const [messages, setMessages] = useState<MessageType[]>(TestMessages);
  const questionRef = useRef<HTMLInputElement>(null);

  // 音声再生
  const playAudio = async (text: string, speaker: string) => {
    try {
      // 音声取得
      const responseAudio = await axios.post('/api/audio', {
        text,
        speaker,
      });

      // Base64形式で取得
      const base64Audio = responseAudio?.data?.response;
      // Bufferに変換
      const byteArray = Buffer.from(base64Audio, 'base64');
      // Blobに変換
      const audioBlob = new Blob([byteArray], { type: 'audio/x-wav' });
      // URLに変換
      const audioUrl = URL.createObjectURL(audioBlob);
      // 音声作成
      const audio = new Audio(audioUrl);
      // 音量[0-1]設定
      audio.volume = 1;
      // 再生
      audio.play();
    } catch (e) {
      console.error(e);
    }
  };

  // メッセージ設定
  const messageHandler = (message: MessageType) => {
    setMessages((messages) => [...messages, message]);
  };

  // 送信
  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // ローディング開始
    setLoading(true);

    try {
      // 質問取得
      const question = questionRef.current?.value;

      // 質問がない場合は終了
      if (!question) {
        setLoading(false);
        return;
      }

      // メッセージリストに追加
      const messageQuestion = { type: 'question', text: question };
      messageHandler(messageQuestion);

      // ChatGPTに質問を投げて回答を取得
      const responseChatGPT = await axios.post('/api/chatgpt', {
        question,
        messages,
      });

      // 回答取得
      const answer = responseChatGPT?.data?.response;

      // メッセージリストに追加
      const messageAnswer = { type: 'answer', text: answer };
      messageHandler(messageAnswer);

      // 質問フォームをクリア
      questionRef.current!.value = '';

      // ローディング終了
      setLoading(false);

      // 音声再生
      playAudio(answer, character.value);
    } catch (e) {
      console.error(e);
    } finally {
      // ローディング終了
      setLoading(false);
    }
  };

  return (
    <div>
      {/* キャラクター選択 */}
      <CharacterSelect setCharacter={setCharacter} playAudio={playAudio} />

      <div className="px-3">
        {/* メッセージ */}
        {messages.map((data, index) => (
          <div key={index}>
            {data.type === 'question' ? (
              <div className="mb-4">
                <div className="leading-relaxed break-words whitespace-pre-wrap text-gray-600">{data.text}</div>
              </div>
            ) : data.type === 'answer' ? (
              <div className="mb-4">
                <div className="leading-relaxed break-words whitespace-pre-wrap font-bold">{data.text}</div>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <div>
        {/* ローディング */}
        {loading && (
          <div className="flex items-center justify-center my-2">
            <ArrowPathIcon className="h-6 w-6 animate-spin text-gray-600" />
          </div>
        )}
      </div>

      <form onSubmit={onSubmit}>
        {/* 入力フォーム */}
        <input
          className="w-full border-b py-2 px-3 focus:outline-none bg-transparent"
          placeholder="Your question..."
          ref={questionRef}
          disabled={loading}
          id="question"
          required
        />
      </form>

      {/* スクロール */}
      <Scroll messages={messages} />

      {/* イラスト表示 */}
      <Character character={character} />
    </div>
  );
};

export default Main;
