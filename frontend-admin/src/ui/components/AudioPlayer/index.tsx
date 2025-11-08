import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import ReactHowler from 'react-howler';
import { Slider } from '@mui/material';
import { Pause, PlayArrow } from '@mui/icons-material';
import cn from 'classnames';

interface PlayerState {
  isPlaying: boolean;
  progress: number;
  duration: number | undefined;
}

interface Props {
  src: string;
  className?: string;
  /**
   * @default {false}
   */
  withDuration?: boolean;
  initialPlayerState?: PlayerState;
}

export const AudioPlayer: React.FC<Props> = ({
  src,
  className,
  withDuration = false,
  initialPlayerState = { isPlaying: false, progress: 0, duration: undefined },
}) => {
  const [playerState, setPlayerState] =
    useState<PlayerState>(initialPlayerState);
  const { isPlaying, progress, duration } = playerState;

  const howlerRef = useRef<ReactHowler>(null);
  const durationRef = howlerRef.current?.duration();

  const normalizedDuration = useMemo(() => {
    if (!duration) return '00:00';
    const minutes = (duration / 60).toFixed();
    const seconds = (duration % 60).toFixed();
    return `${minutes.length < 2 ? `0${minutes}` : minutes}:${
      seconds.length < 2 ? `0${seconds}` : seconds
    }`;
  }, [duration]);

  const handlePlayPauseClick = () => {
    setPlayerState(prev => ({ ...prev, isPlaying: !isPlaying }));
  };

  const handleProgressChange = useCallback(
    (_: Event, val: number | number[]) => {
      if (Array.isArray(val)) return;

      if (!duration) return;
      const seekTime = duration * (val / 100);
      howlerRef.current?.seek(seekTime);
      setPlayerState(prev => ({ ...prev, progress: val + 3 }));
    },
    [duration],
  );

  useEffect(() => {
    setPlayerState(prev => ({ ...prev, duration: durationRef }));
    let progressUpdater: ReturnType<typeof setInterval>;

    progressUpdater = setInterval(() => {
      const position = howlerRef.current?.seek();
      if (progress === position) return clearInterval(progressUpdater);
      return setPlayerState(prev => ({ ...prev, progress: position! }));
    }, 400);

    if (!isPlaying) {
      clearInterval(progressUpdater);
    }

    return () => clearInterval(progressUpdater);
  }, [durationRef, isPlaying, progress]);

  useEffect(() => {
    setPlayerState({
      isPlaying: false,
      progress: 0,
      duration: howlerRef.current?.duration(),
    });
  }, [src]);

  return (
    <>
      <div className={cn('flex items-center w-max', className)}>
        <span
          className="flex items-center justify-center border border-main_grey bg-menu_dark rounded-full p-2 cursor-pointer"
          onClick={handlePlayPauseClick}
        >
          {isPlaying ? <Pause /> : <PlayArrow />}
        </span>
        <div className="flex items-center ml-4">
          <Slider
            value={progress}
            onChange={handleProgressChange}
            sx={{ minWidth: 400 }}
          />
          {withDuration && (
            <span className="mx-4 text-sm">{normalizedDuration}</span>
          )}
        </div>
      </div>

      <ReactHowler ref={howlerRef} src={src} playing={isPlaying} html5 />
    </>
  );
};
