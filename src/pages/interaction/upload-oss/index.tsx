import { useState, useEffect } from 'react';
import OSS, { ObjectMeta } from 'ali-oss';
import { Upload, Modal, message } from 'antd';
import { UploadChangeParam, UploadProps, RcFile } from 'antd/es/upload';
import { PlusOutlined } from '@ant-design/icons';
import request from 'rc-upload/lib/request';
import styles from './style.less';

const client = new OSS({
  region: 'oss-cn-hangzhou',
  accessKeyId: ALIYUN_ID,
  accessKeySecret: ALIYUN_SECRET,
  bucket: 'tingyus',
});

interface ObjectMetaExt extends ObjectMeta {
  url: string;
}
const uploadButton = (
  <div>
    <PlusOutlined />
    <div style={{ marginTop: 8 }}>Upload</div>
  </div>
);

const customProgress = {
  strokeColor: {
    '0%': '#108ee9',
    '100%': '#87d068',
  },
  strokeWidth: 3,
  format: (percent?: number) => `${parseFloat(percent!.toFixed(2))}%`,
};

interface UploadState {
  previewVisible: boolean;
  previewImage?: string;
  previewTitle?: string;
  waitingFileList: UploadChangeParam['fileList'];
}
const App: React.FC = () => {
  const [remoteFilelist, setRemoteFilelist] = useState<
    { name: string; url: string }[]
  >([]);
  const [state, setState] = useState<UploadState>({
    previewVisible: false,
    previewImage: '',
    previewTitle: '',
    waitingFileList: [],
  });

  async function getRemoteList() {
    try {
      let result = await client.list(
        {
          'max-keys': 20,
        },
        {},
      );
      setRemoteFilelist(signatureUrl(result.objects as ObjectMetaExt[]));
    } catch (err) {
      console.log(err);
    }
  }

  const handlePreview: UploadProps['onPreview'] = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj!);
    }
    setState((prevState) => {
      return {
        ...prevState,
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle:
          file.name || file.url?.substring(file.url.lastIndexOf('/') + 1),
      };
    });
  };

  const handleBeforeUpload = (file: RcFile) => {
    const isImage = file.type && file.type.indexOf('image/') === 0;
    if (!isImage) {
      message.error(`${file.name}不是图片`);
    }
    return isImage ? true : Upload.LIST_IGNORE;
    // return false;
  };

  const handleChange = (info: UploadChangeParam) => {
    setState((prevState) => {
      return {
        ...prevState,
        waitingFileList: info.fileList,
      };
    });
  };

  const handleCancel = () =>
    setState((prevState) => {
      return {
        ...prevState,
        previewVisible: false,
      };
    });

  const handleRequest: UploadProps['customRequest'] = async (options) => {
    // options.onProgress({ percent: 0 });
    const file = options.file as RcFile;
    const result = await client.put(`reactcases/${file.name}`, file);
    // options.onProgress({ percent: 100 });
    if (result.name) {
      request(options);
      // options.onSuccess();
      message.success('上传成功');
      getRemoteList();
    } else {
      message.success('上传失败');
    }
  };

  useEffect(() => {
    getRemoteList();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.main}>
        <div className={styles.controller}>
          <Upload
            // action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            maxCount={1}
            fileList={state.waitingFileList}
            onPreview={handlePreview}
            onChange={handleChange}
            beforeUpload={handleBeforeUpload}
            progress={customProgress}
            customRequest={handleRequest}
          >
            {uploadButton}
          </Upload>
          <Modal
            visible={state.previewVisible}
            title={state.previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="" style={{ width: '100%' }} src={state.previewImage} />
          </Modal>
        </div>
        <div className={styles.gallery}>
          {remoteFilelist.map((file, idx) => {
            return (
              <a
                key={idx}
                className={styles.picture}
                href={file.url}
                target="_blank"
              >
                <img src={file.url} alt="" />
                <div className={styles.tips}>点击下载</div>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default App;

function signatureUrl(list: ObjectMetaExt[]) {
  return list.map((item) => {
    return {
      name: item.name,
      url: client.signatureUrl(item.name, {
        expires: 24 * 60 * 60, // 设置过期时间，默认值为1800秒。
      }),
    };
  });
}

function getBase64(file: RcFile): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}
