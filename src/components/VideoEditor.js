import React, { useState } from 'react';
import VideoPlayer from './VideoPlayer';
import VideoTimeline from './VideoTimeline';
import { VIDEO_URL, INTERVAL } from '../utils/contants';
import './VideoEditor.scss';


const VideoEditor = () => {
	const [playbackTime, setPlaybackTime] = useState(0);
	const [manualTimeline, setManualTimeline] = useState(0);
	const [start, setStart] = useState(0);
	const [end, setEnd] = useState(0);
	const handlePlaybackTimeUpdate = (time) => {
		setPlaybackTime(time);
	};
	const handleManualUpdate = (time) => {
		setManualTimeline(time);
	};
	const handleStartChange = (time) => {
		setStart(time);
		if (playbackTime < time) {
			setPlaybackTime(time + INTERVAL);
		}
	};
	const handleEndChange = (time) => {
		setEnd(time);
		if (playbackTime > time) {
			setPlaybackTime(time - INTERVAL);
		}
	};
	return (
		<div className='video-editor'>
			<VideoPlayer
				src={VIDEO_URL}
				onPlaybackTimeUpdate={handlePlaybackTimeUpdate}
				manualTimeline={manualTimeline}
				start={start}
				end={end}
			/>
			<VideoTimeline
				src={VIDEO_URL}
				playbackTime={playbackTime}
				onTimelineManualUpdate={handleManualUpdate}
				onStartChange={handleStartChange}
				onEndChange={handleEndChange}
			/>
		</div>
	);
};

export default VideoEditor;
