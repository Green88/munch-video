export const getVideoRatio = (url) => {
	return new Promise((resolve, reject) => {
	  const video = document.createElement('video');
	  video.src = url;
  
	  video.onloadedmetadata = function() {
		const ratio = this.videoWidth / this.videoHeight;
		resolve(ratio);
	  };
  
	  video.onerror = function() {
		reject(new Error("Error loading video metadata"));
	  };
	});
};
