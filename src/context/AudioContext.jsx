import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

const AudioContext = createContext();

export const AudioProvider = ({ children }) => {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    if (currentTrack) {
      audioRef.current.src = currentTrack.sound_file_url;
      if (isPlaying) {
        audioRef.current.play().catch(error => {
          console.error("Error playing audio:", error);
          setIsPlaying(false);
        });
      }
    }

    // Add event listener for when the track ends
    const handleTrackEnd = () => {
      if (repeat) {
        // If repeat is on, play the same track again
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      } else if (shuffle) {
        // If shuffle is on, play a random track from the playlist
        const randomIndex = Math.floor(Math.random() * playlist.length);
        setCurrentTrack(playlist[randomIndex]);
        setIsPlaying(true);
      } else {
        // Play the next track in sequence
        playNextTrack();
      }
    };

    audioRef.current.addEventListener('ended', handleTrackEnd);

    // Cleanup function to remove event listener
    return () => {
      audioRef.current.removeEventListener('ended', handleTrackEnd);
    };
  }, [currentTrack, isPlaying, repeat, shuffle, playlist]); // Added dependencies

  const playTrack = (track) => {
    if (!track) return;
    
    if (currentTrack?.id === track.id) {
      // If same track, toggle play/pause
      togglePlay();
    } else {
      // If different track, set it and play
      setCurrentTrack(track);
      setIsPlaying(true);
    }
  };

  const togglePlay = () => {
    if (!currentTrack) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(error => {
        console.error("Error playing audio:", error);
      });
    }
    setIsPlaying(!isPlaying);
  };

  const playNextTrack = () => {
    if (!playlist.length) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentTrack(playlist[nextIndex]);
    setIsPlaying(true);
  };

  const playPrevTrack = () => {
    if (!playlist.length) return;
    
    const currentIndex = playlist.findIndex(track => track.id === currentTrack?.id);
    const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1;
    setCurrentTrack(playlist[prevIndex]);
    setIsPlaying(true);
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const toggleRepeat = () => {
    setRepeat(!repeat);
  };

  const updatePlaylist = (newPlaylist) => {
    setPlaylist(newPlaylist);
  };

  return (
    <AudioContext.Provider
      value={{
        currentTrack,
        setCurrentTrack,
        isPlaying,
        setIsPlaying,
        playlist,
        shuffle,
        repeat,
        audio: audioRef.current,
        playTrack,
        togglePlay,
        playNextTrack,
        playPrevTrack,
        toggleShuffle,
        toggleRepeat,
        updatePlaylist
      }}
    >
      {children}
    </AudioContext.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};