import React, { useState, useRef, useCallback, RefObject } from 'react';
import PhotoPreview from '@/components/PhotoPreview';
import Camera from '@/components/Camera';
import { Button, message, Space, Row, Col } from 'antd';
import styles from './style.less';
import { history, useLocation } from 'umi';

// 整体尺寸以预览的高度为基准
const PREVIEW_HEIGHT = 184;

const App: React.FC = () => {
  const [actionCount, setActionCount] = useState(0);
  const [isCamera, setIsCamera] = useState(true);
  const location = useLocation();
  const onPhotoConfirm = useCallback(
    (canvasRef: RefObject<HTMLCanvasElement>) => {
      if (canvasRef && canvasRef.current) {
        // 输出dataUrl
        message.success('已输出dataUrl到控制台');
        console.log(canvasRef.current.toDataURL('image/png'));
      }
    },
    [],
  );
  const onSnapPhoto = useCallback(() => {
    setActionCount((count) => count + 1);
  }, []);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleOnError = () => {
    setIsCamera(false);
  };
  return (
    <div className={styles.container}>
      <Row>
        <Col xs={24} md={12}>
          <div className={styles.photoPreviewWrapper}>
            <PhotoPreview
              height={PREVIEW_HEIGHT}
              videoRef={videoRef}
              canvasRef={canvasRef}
              actionCount={actionCount}
            />
            <p className={styles.title}>生成头像</p>
            {isCamera ? (
              <p className={styles.subtitle}>点击确定后会生成dataUrl</p>
            ) : (
              <p className={styles.subtitle}>未检测到摄像头</p>
            )}
            <div className={styles.actions}>
              <Button
                type="primary"
                size="large"
                disabled={!isCamera}
                onClick={() => onPhotoConfirm(canvasRef)}
              >
                确定
              </Button>
            </div>
          </div>
        </Col>
        <Col xs={24} md={12}>
          <div className={styles.cameraWrapper}>
            <Camera
              width={270}
              height={270}
              videoRef={videoRef}
              onError={handleOnError}
            />
            <div className={styles.actions}>
              <Space>
                <Button
                  type="primary"
                  disabled={!isCamera}
                  size="large"
                  onClick={onSnapPhoto}
                >
                  拍摄
                </Button>
                {/* <Button size="large" onClick={() => history.push('/testcenter')}>
              取消
            </Button> */}
              </Space>
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default App;
