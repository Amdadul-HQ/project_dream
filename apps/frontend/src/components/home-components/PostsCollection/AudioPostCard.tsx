"use client"

import Image from "next/image"
import type React from "react"
import { useState, useRef } from "react"
import { BsThreeDotsVertical } from "react-icons/bs"
import { LuHeart } from "react-icons/lu"
import { TfiCommentAlt } from "react-icons/tfi"
import { FaPlay, FaPause, FaVolumeUp } from "react-icons/fa"

interface PostItem {
  image: { src: string }
  title: string
  content_type: string
  writer_name: string
  createdAt: string
  content: string
  like_count: number
  comment_count: number
  audio?: { src: string; duration?: string }
}

const AudioPostCard = ({ item }: { item: PostItem }) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  const handlePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number.parseFloat(e.target.value)
    if (audioRef.current) {
      audioRef.current.currentTime = time
      setCurrentTime(time)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  const isAudioPost = item.content_type.toLowerCase() === "audio"

  return (
    <div
      className={`text-secondary py-2 p-4 rounded-md transition-colors duration-200 ease-in-out ${
        isAudioPost
          ? "bg-gradient-to-r from-purple-50 to-pink-50 border-l-4 border-violet-400 hover:from-violet-100 hover:to-pink-100"
          : "hover:bg-gray-100 bg-gray-100"
      }`}
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-x-2">
          <div className="">
            <Image
              alt="Writer"
              src="/user-profile-avatar.png"
              className="w-[34px] h-[34px] rounded-full"
              width={34}
              height={34}
            />
          </div>
          <div>
            <h3 className="font-bold text-sm">{item.writer_name}</h3>
            <p className="text-xs">{`@${item.writer_name.toLocaleLowerCase().split(" ").join("")}`}</p>
          </div>
        </div>
        <div className="flex justify-between items-center h-full py-5">
          <BsThreeDotsVertical />
        </div>
      </div>

      <div className="flex sm:flex-row items-start ">
        <div className="flex items-start gap-5 w-full h-full">
          <div className="w-full space-y-5">
            <div className="space-y-1 space-x-0.5">
              <div className="space-y-1">
                <h3 className="font-bold sm:text-xl text-lg text-black">{item.title}</h3>
                <div className="flex items-center gap-5 text-xs"></div>
              </div>
              <div className="w-full overflow-hidden">
                <p className="line-clamp-3">{item.content}</p>
              </div>
            </div>

            {isAudioPost && item.audio && (
              <div className="bg-white rounded-lg p-4 border border-purple-200 shadow-sm">
                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePlayPause}
                    className="flex items-center justify-center w-12 h-12 bg-purple-500 hover:bg-purple-600 text-white rounded-full transition-colors"
                  >
                    {isPlaying ? <FaPause size={16} /> : <FaPlay size={16} />}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <FaVolumeUp className="text-violet-500" size={14} />
                      <span className="text-sm font-medium text-violet-700">Audio</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">{formatTime(currentTime)}</span>
                      <input
                        type="range"
                        min="0"
                        max={duration || 0}
                        value={currentTime}
                        onChange={handleSeek}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                        style={{
                          background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(currentTime / duration) * 100}%, #e5e7eb ${(currentTime / duration) * 100}%, #e5e7eb 100%)`,
                        }}
                      />
                      <span className="text-xs text-gray-500">{formatTime(duration)}</span>
                    </div>
                  </div>
                </div>

                <audio
                  ref={audioRef}
                  src={item.audio.src}
                  onTimeUpdate={handleTimeUpdate}
                  onLoadedMetadata={handleLoadedMetadata}
                  onEnded={() => setIsPlaying(false)}
                  className="hidden"
                />
              </div>
            )}

            <div className="flex gap-8 items-center text-sm">
              <div className="flex items-center gap-2">
                {" "}
                <LuHeart className="text-lg" /> <p>{item.like_count}</p>
              </div>
              <div className="flex items-center gap-2">
                {" "}
                <TfiCommentAlt className="text-lg" /> <p>{item.comment_count}</p>
              </div>
            </div>
          </div>
        </div>

        {/* <div className="w-[250px] h-[152px] rounded-md relative">
          {isAudioPost ? (
            <div className="w-full h-full bg-gradient-to-br from-purple-400 to-pink-400 rounded-md flex items-center justify-center">
              <div className="text-center text-white">
                <FaVolumeUp size={32} className="mx-auto mb-2" />
                <p className="text-sm font-medium">Audio Content</p>
                {item.audio?.duration && <p className="text-xs opacity-80">{item.audio.duration}</p>}
              </div>
            </div>
          ) : (
            <Image
              className="rounded-md"
              src={item.image.src || "/placeholder.svg"}
              alt={item.title}
              width={250}
              height={152}
            />
          )}
          <p
            className={`absolute top-1 left-1 px-2 py-1 rounded-md text-white text-xs capitalize backdrop-blur-xs max-w-max ${
              isAudioPost ? "bg-purple-600/80" : "bg-black/50"
            }`}
          >
            {item.content_type}
          </p>
        </div> */}
      </div>
    </div>
  )
}

export default AudioPostCard
