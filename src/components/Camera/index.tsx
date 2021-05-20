import React, { useEffect, RefObject, useState } from 'react';
import styles from './style.less';

/**
 * width：摄像头可是区域的宽度
 * height：摄像头可是区域的高度
 * videoRef：video元素的ref对象
 */
interface CameraProps {
  width: number;
  height: number;
  videoRef: RefObject<HTMLVideoElement>;
  onError: () => void;
}
const Camera: React.FC<CameraProps> = ({
  width,
  height,
  videoRef,
  onError,
}) => {
  const [isSupportMedia, setIsSupportMedia] = useState(true);
  useEffect(() => {
    if (!videoRef.current) {
      return;
    }
    const video = videoRef.current!;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then((stream) => {
          // video.src = window.URL.createObjectURL(stream);
          video.srcObject = stream;
          video.play();
        })
        .catch((err) => {
          setIsSupportMedia(false);
          onError();
        });
    } else {
      setIsSupportMedia(false);
      onError();
    }
  }, []);

  return (
    <div className={styles.camera} style={{ width: width, height: height }}>
      {isSupportMedia && <video ref={videoRef}></video>}
      <div className={styles.highlight}></div>
    </div>
  );
};

export default Camera;
