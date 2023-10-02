import React, { useState, useEffect, useRef, useMemo } from 'react';
import { getVideoRatio } from '../utils/video';
import { VIDEO_WIDTH } from '../utils/contants';

const VideoPlayer = ({ src, onPlaybackTimeUpdate, manualTimeline, start, end }) => {
	const videoRef = useRef(null);
	const [videoRatio, setVideoRatio] = useState(1);

	useEffect(() => {
		getVideoRatio(src)
			.then(setVideoRatio)
			.catch(console.error);
	}, [src]);

	useEffect(() => {
		if (videoRef?.current && manualTimeline !== 0) {
			videoRef.current.currentTime = manualTimeline;
		}
	}, [manualTimeline]);

	useEffect(() => {
		const video = videoRef?.current;
		if (video) {
			const handleTimeUpdate = () => {
				const playbackTime = video.currentTime;
				onPlaybackTimeUpdate(playbackTime);
				if (end && playbackTime >= end) {
					video.pause();
				}
			};
			video.addEventListener('timeupdate', handleTimeUpdate);
			return () => {
				video.removeEventListener('timeupdate', handleTimeUpdate);
			};
		}
	}, [onPlaybackTimeUpdate, videoRef]);

	const timeSuffix = useMemo(() => {
		if (start === 0 && end === 0) return '';
		if (start) return `#t=${start}`;
		if (end) return `#t=,${end}`;
		return `#t=${start},${end}`;
	}, [start, end]);

	return (
		<video
			ref={videoRef}
			width={VIDEO_WIDTH}
			height={VIDEO_WIDTH/videoRatio}
			controls
			src={`${src}${timeSuffix}`}
		/>
	);
};

export default VideoPlayer;
