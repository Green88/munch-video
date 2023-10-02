import React, { useState, useEffect, useRef } from 'react';
import { getVideoRatio } from '../utils/video';
import TrimBar from './TrimBar';
import TimelinePointer from './TimelinePointer';
import { INTERVAL, THUMB_WIDTH } from '../utils/contants';
import './VideoTimeline.scss';

const VideoTimeline = ({ src, playbackTime, onTimelineManualUpdate, onStartChange, onEndChange }) => {
	const timelineRef = useRef(null);
	const [thumbnails, setThumbnails] = useState([]);
	const [imageRatio, setImageRatio] = useState(null);
	const [timelineWidth, setTimelineWidth] = useState(0);

	useEffect(() => {
		getVideoRatio(src)
			.then(setImageRatio)
			.catch(console.error);
	}, [src]);

	useEffect(() => {
		const offScreenVideo = document.createElement('video');
		const canvas = document.createElement('canvas');
		const context = canvas.getContext('2d');
		const extractedThumbnails = [];
		offScreenVideo.src = src;
		offScreenVideo.preload = 'auto';

		offScreenVideo.addEventListener('loadedmetadata', function() {
			const totalThumbnails = Math.floor(offScreenVideo.duration / INTERVAL);
			let currentIndex = 0;

			const handleSeeked = () => {
				context.drawImage(offScreenVideo, 0, 0, canvas.width, canvas.height);
				extractedThumbnails.push({
					url: canvas.toDataURL(),
					index: currentIndex,
					time: offScreenVideo.currentTime
				});
				currentIndex++;

				if (currentIndex < totalThumbnails) {
					offScreenVideo.currentTime = currentIndex * INTERVAL;
				} else {
					offScreenVideo.removeEventListener('seeked', handleSeeked);
					setThumbnails(extractedThumbnails);
					setTimelineWidth(THUMB_WIDTH * extractedThumbnails.length);
				}
			};

			offScreenVideo.addEventListener('seeked', handleSeeked);

			offScreenVideo.currentTime = currentIndex * INTERVAL;
		});
		return () => {
			offScreenVideo.removeEventListener('loadedmetadata', () => {});
		}
	}, [src]);

	const handleStartResize = (value) => {
		const startIndex = Math.floor(value / THUMB_WIDTH);
		const start = thumbnails[startIndex].time;
		onStartChange(start);
	};
	
	const handleEndResize = (value) => {
		const endIndex = Math.floor(value / THUMB_WIDTH);
		const end = thumbnails[endIndex].time;
		onEndChange(end);
	};

	const onMovingPointer = (xValue) => {
		if (timelineRef.current) {
			const { left } = timelineRef.current.getBoundingClientRect();
			const relativeX = xValue - left;
			const time = (relativeX / THUMB_WIDTH) * INTERVAL;
			onTimelineManualUpdate(time);
		}
	};

	return (
		<div className='video-timeline' ref={timelineRef}>
			<TimelinePointer interval={INTERVAL} thumbWidth={THUMB_WIDTH} playbackTime={playbackTime} containerWidth={timelineWidth} onMovingPointer={onMovingPointer} />
			<div style={{ position: 'relative', overflow: 'hidden', width: `${timelineWidth}px` }}>
				<div className='thumbnails-list'>
					{thumbnails.map((thumb, index) => (
						<img height={THUMB_WIDTH/imageRatio} width={THUMB_WIDTH} key={index} src={thumb.url} alt={`Thumbnail ${index}`} />
					))}
				</div>
				{timelineWidth && (
					<div className='ruler-wrapper' style={{ width: `${timelineWidth}px` }}>
						<TrimBar delay={200} height={(THUMB_WIDTH/imageRatio) - 8} size={timelineWidth} onLeftResize={handleStartResize} onRightResize={handleEndResize} />
					</div>
				)}
			</div>
		</div>
	);
};

export default VideoTimeline;
