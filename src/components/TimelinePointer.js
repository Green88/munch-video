import React, { useEffect, useState, useCallback } from 'react';
import './VideoTimeline.scss';

const calculatePosition = (playbackTime, interval, thumbWidth, timelineWidth) => {
	const position = (playbackTime / interval) * thumbWidth;
	if (position > timelineWidth) {
		return timelineWidth;
	}
	if (position < 0) {
		return 0;
	}
	return position;
};

const TimelinePointer = ({ interval, thumbWidth, playbackTime, containerWidth, onMovingPointer }) => {
	const position = calculatePosition(playbackTime, interval, thumbWidth, containerWidth);
	const [isMoving, setIsMoving] = useState(false);
	const onStartMoving = (event) => {
		setIsMoving(true);
	};

	const handleMouseMove = useCallback((e) => {
		if (isMoving) {
			onMovingPointer(e.clientX);
		}
	}, [onMovingPointer, isMoving]);
	
	const handleMouseUp = useCallback(() => {
		setIsMoving(false);
	}, []);

	useEffect(() => {
		window.addEventListener('mousemove', handleMouseMove);
		window.addEventListener('mouseup', handleMouseUp);

		return () => {
			window.removeEventListener('mousemove', handleMouseMove);
			window.removeEventListener('mouseup', handleMouseUp);
		};
	}, [isMoving, handleMouseMove, handleMouseUp]);
	
	return (
		<div
			className='timeline-pointer'
			onMouseDown={onStartMoving}
			style={{ left: position }}
		/>
	);
};

export default TimelinePointer;
