'use client';

import { Characters } from './const';
import Select from 'react-select';
import { Dispatch, SetStateAction } from 'react';
import { CharacterType } from './types';

// キャラクター選択の型定義
export type CharacterSelectProps = {
  setCharacter: Dispatch<SetStateAction<CharacterType>>;
  playAudio: (text: string, speaker: string) => Promise<void>;
};

// キャラクター選択
const CharacterSelect = ({ setCharacter, playAudio }: CharacterSelectProps) => {
  return (
    <div className="flex items-center justify-end mb-2">
      <Select
        styles={{
          control: (styles, { isFocused }) => ({
            ...styles,
            width: 170,
            backgroundColor: 'white',
            boxShadow: 'none',
            borderRadius: '0.2rem',
            '&:hover': {
              borderColor: '#7fbfff',
            },
          }),
          option: (styles, { isSelected, isFocused }) => ({
            ...styles,
            backgroundColor: isSelected ? '#7fbfff' : isFocused ? '#d1e8ff' : 'white',
            color: isSelected ? 'white' : isFocused ? 'black' : 'black',
          }),
        }}
        id="selectbox"
        instanceId="selectbox"
        className="text-sm"
        options={Characters}
        defaultValue={Characters[0]}
        onChange={async (data) => {
          if (data) {
            setCharacter(data);
            // キャラクター変更時に音声を再生
            await playAudio(data.word, data.value);
          }
        }}
        components={{
          IndicatorSeparator: () => null,
        }}
      />
    </div>
  );
};

export default CharacterSelect;
