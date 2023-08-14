'use client'

import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { useInterval } from 'react-use'
import { CharacterType } from './types'
import Image from 'next/image'

// ずんだもん表示
const Character = ({ character }: { character: CharacterType }) => {
  const [imageIndex, setImageIndex] = useState<number>(0)
  const imageRef = useRef<HTMLImageElement>(null)

  // 画像リスト
  const images = ['/next.svg', '/vercel.svg', '/next.svg']

  // 画像を切り替える関数
  const changeImage = () => {
    setImageIndex((imageIndex + 1) % images.length)
  }

  // 2秒ごとに画像を切り替える
  useInterval(changeImage, 2000)

  // GSAPを使用したアニメーション
  useEffect(() => {
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        duration: 0.5, // 時間
        scale: 1, // 拡大・縮小
        repeat: 1, // 繰り返し回数
        yoyo: true, // リピート時に逆再生
        ease: 'power1.inOut', // 加減速
      })
    }
  }, [imageIndex])

  return (
    <div>
      {/* ずんだもんが選択されたら表示 */}
      {character.value === '3' && (
        <div className="fixed bottom-5 right-5">
          <Image
            ref={imageRef}
            src={images[imageIndex]}
            className="object-cover drop-shadow-lg"
            alt="zundamon"
            width={300}
            height={458}
          />
        </div>
      )}
    </div>
  )
}

export default Character