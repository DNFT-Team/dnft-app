import {
  Alert,
  Dialog,
  Input,
  InputNumber,
  Select,
  Upload,
} from 'element-react';
import { css } from 'emotion';
import React, { useEffect, useState } from 'react';
import CreateCollectionModal from '../../../components/CreateCollectionModal';
import { post } from 'utils/request';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { ipfs_post } from 'utils/ipfs-request';
import { toast } from 'react-toastify';

const CreateNFT = (props) => {
  const { dispatch, datas, location, address, chainType, token } = props;

  const [options, setOptions] = useState([]);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [form, setForm] = useState({
    supply: 1
  })

  let history = useHistory();

  const cateType = [
    { label: 'Lasted', value: 'LASTED' },
    { label: 'Virtual reality', value: 'VIRTUAL_REALITY' },
    { label: 'Domain', value: 'DOMAIN' },
    { label: 'Art', value: 'ART' },
    { label: 'Cooection', value: 'COOECTION' },
    { label: 'Sports', value: 'SPORTS' },
    { label: 'Game', value: 'GAME' },
  ];

  const uploadFile = async (file) => {
    try {
      const fileData = new FormData();
      fileData.append('file', file);

      const { data } = await ipfs_post(
        '/api/v0/add',
        fileData
      );

      setForm({
        ...form,
        avatorUrl: data.Hash
      })
    } catch (e) {
      console.log(e, 'e')
    }
  };

  const getCollectionList = async () => {
    try {
      const { data } = await post(
        '/api/v1/collection/batch',
        {
          address: '0x39ba0111ae2b073552c4ced8520a5bcb93437628',
          sortOrder: 'ASC',
          sortTag: 'createTime',
          page: 0,
          size: 10,
        },
        token
      );
      setOptions(
        data?.data?.content?.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      );
    } catch (e) {
      console.log(e, 'e')
    }
  };

  const createNFT = async () => {
    if (!['ETH', 'BSC', 'HECO'].includes(chainType)) {
      toast.dark('Wrong network', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    try {
      const result = await post(
        '/api/v1/nft/',
        {
          ...form,
          address: '0x39ba0111ae2b073552c4ced8520a5bcb93437628',
          chainType: chainType,
          hash: new Date().valueOf()
        },
        token
      );
      console.log(result, 'result')
      history.push('/asset');
    } catch (e) {
      console.log(e, 'e')
    }
  }

  useEffect(() => {
    if (token) {
      getCollectionList();
    }
  }, [token]);

  const renderFormItem = (label, item) =>
    <div className={styleFormItemContainer}>
      <div className='label'>{label}</div>
      {item}
    </div>

  return (
    <React.Fragment>
      <Alert
        className={styleAlert}
        title={
          "You have not created the collection yet.   OpenSea will include a link to this URL on this item's detail page"
        }
        type='warning'
      />

      <div className={styleContainer}>
        <h1>Create new NFT</h1>
        <Upload
          className={styleUploadContainer}
          drag
          multiple={false}
          withCredentials
          action="https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/"
          limit={1}
          httpRequest={(e) => {
            uploadFile(e.file)
          }}
          tip={
            <div className='el-upload__tip'>
              Drag or choose your file to upload
            </div>
          }
        >
          <i className='el-icon-upload2'></i>
          <div className='el-upload__text'>
            PNG, GIF, WEBP, MP4 or MP3. Max 1Gb.
          </div>
        </Upload>
        <h3>Item Details</h3>
        {renderFormItem('Name', <Input placeholder='e. g. David' onChange={(value) => {
          setForm({
            ...form,
            name: value
          })
        }}/>)}
        {renderFormItem(
          'Description',
          <Input
            type='textarea'
            placeholder='e. g. David'
            autosize={{ minRows: 4, maxRows: 4 }}
            onChange={(value) => {
              setForm({
                ...form,
                description: value
              })
            }}
          />
        )}
        {renderFormItem(
          'Collection',
          <Select
            placeholder='please choose'
            onChange={(value) => {
              if (value === 'other') {
                setShowCreateCollection(true);
                return;
              }

              setForm({
                ...form,
                collectionId: value
              })
            }}
          >
            <Select.Option key='other' label='New collection +' value='other'/>
            {options.map((el) =>
              <Select.Option
                key={el.value}
                label={el.label}
                value={el.value}
              />
            )}
          </Select>
        )}
        {renderFormItem(
          'Category',
          <Select placeholder='please choose' onChange={(value) => {
            setForm({
              ...form,
              category: value
            })
          }}>
            {cateType.map((el) => {
              <Select.Option
                key={el.value}
                label={el.label}
                value={el.value}
              />
            })}
          </Select>
        )}
        {renderFormItem('Supply', <InputNumber defaultValue={1} min={1} onChange={(value) => {
          setForm({
            ...form,
            supply: value
          })
        }}/>)}
        {renderFormItem('BlockChain', <Input disabled placeholder={chainType} />)}
        <div className={styleCreateNFT} onClick={createNFT}>Create</div>
      </div>
      {showCreateCollection && (
        <CreateCollectionModal
          address={address}
          chainType={chainType}
          token={token}
          onSuccess={(res) => {
            //  do your callback here
            console.log(res);
          }}
          onClose={() => {
            setShowCreateCollection(false);
          }}
        />
      )}
    </React.Fragment>
  );
};

const mapStateToProps = ({ profile }) => ({
  address: profile.address,
  chainType: profile.chainType,
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(CreateNFT));

const styleContainer = css`
  display: flex;
  flex-direction: column;
  margin: 16px auto;
  h1 {
    color: #23262f;
    font-size: 38px;
    margin: 0 0 20px 0;
    padding: 0;
  }
  h3 {
    color: #23262f;
    font-size: 16px;
    padding: 0;
    margin: 0 0 40px 0;
  }
`;

const styleUploadContainer = css`
  margin-bottom: 40px;
  .el-upload-dragger {
    display: flex;
    flex-direction: column;
    color: #777e90;
    background-color: #f4f5f6;
    height: 182px;
    width: 500px;
    justify-content: center;
    border-radius: 10px;
    border: none;
    .el-upload__text {
      margin-top: 10px;
    }
  }
`;

const styleFormItemContainer = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  .label {
    margin-bottom: 10px;
  }
`;

const styleCreateNFT = css`
  background-color: #0049c6;
  color: white;
  padding: 18px 42px;
  font-size: 16px;
  border-radius: 10px;
  cursor: pointer;
  width: fit-content;
`;

const styleAlert = css`
  background-color: #feddbd;
  color: #e27525;
  height: 60px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 84px;
  z-index: 2;
  .el-icon-close {
    top: 24px;
  }
`;
