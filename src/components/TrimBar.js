import React, { useState, useRef } from 'react';
import useDebounce from '../utils/useDebounce';
import './TrimBar.scss';

const TrimBar = ({ size, height, onLeftResize, onRightResize, delay = 100 }) => {
	const [isResizing, setIsResizing] = useState(false);
	const [width, setWidth] = useState(size);
	const [left, setLeft] = useState(0);

	const initialX = useRef(0);
	const initialWidth = useRef(0);
	const initialLeft = useRef(0);
	const resizingWall = useRef('right');

	const debouncedLeftResize = useDebounce(() => {
		onLeftResize(left);
	}, delay);

	const debouncedRightResize = useDebounce(() => {
		onRightResize(width + left);
	}, delay);

	const startResize = (direction) => (event) => {
		setIsResizing(true);
		initialX.current = event.clientX;
		initialWidth.current = width;
		initialLeft.current = left;
		resizingWall.current = direction;
	};

	const resizing = (event) => {
		if (!isResizing) return;

		let offsetX = event.clientX - initialX.current;
		if (resizingWall.current === 'left') {
			const currLeft = initialLeft.current + offsetX;
			if (currLeft < 0) {
				return;
			}
			setWidth(initialWidth.current - offsetX);
			setLeft(currLeft);
			debouncedLeftResize();
		} else {
			const currWidth = initialWidth.current + offsetX;
			if (currWidth > size) {
				return;
			}
			setWidth(currWidth);
			debouncedRightResize();
		}
	};

	const stopResize = () => {
		setIsResizing(false);
	};

	return (
		<div
			className="resizable-container"
			style={{ width: `${width}px`, left: `${left}px`, height: `${height}px` }}
			onMouseMove={resizing}
			onMouseUp={stopResize}
			onMouseLeave={stopResize}
		>
			<div className="left-wall" onMouseDown={startResize('left')}></div>
			<div className="content" />
			<div className="right-wall" onMouseDown={startResize('right')}></div>
		</div>
	);
};

export default TrimBar;
