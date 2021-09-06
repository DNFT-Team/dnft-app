import {
  Alert,
  Button,
  Input,
  InputNumber,
  Select,
  Upload,
  Loading
} from 'element-react';
import { css } from 'emotion';
import React, { useEffect, useState } from 'react';
import globalConf from 'config/index';
import CreateCollectionModal from '../../../components/CreateCollectionModal';
import { post } from 'utils/request';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { ipfs_post } from 'utils/ipfs-request';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react'
import { createNFTContract } from '../../../utils/contract';
import { createNFTAbi } from '../../../utils/abi';
import Web3 from 'web3';

const CreateNFT = (props) => {
  const { dispatch, datas, location, address, chainType, token } = props;

  const [options, setOptions] = useState([]);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [form, setForm] = useState({
    supply: 1,
  });
  const [isLoading, setIsLoading] = useState(false);

  let history = useHistory();

  const cateType = [
    // { label: 'Lasted', value: 'LASTED' },
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

      const { data } = await ipfs_post('/v0/add', fileData);

      setForm({
        ...form,
        avatorUrl: data.Hash,
      });
    } catch (e) {
      console.log(e, 'e');
    }
  };

  const getCollectionList = async () => {
    try {
      const { data } = await post(
        '/api/v1/collection/batch',
        {
          address: address,
          sortOrder: 'ASC',
          sortTag: 'createTime',
          page: 0,
          size: 100,
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
      console.log(e, 'e');
    }
  };

  const createNFT = async () => {
    if (!['BSC'].includes(chainType)) {
      toast.dark('Wrong network', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    try {
      setIsLoading(true);
      if (window.ethereum) {
        let ethereum = window.ethereum;
        window.web3 = new Web3(ethereum);
        await ethereum.enable();

        const contractAddress = createNFTContract;
        const myContract = new window.web3.eth.Contract(
          createNFTAbi,
          contractAddress
        );
        const createNFTResult = await myContract.methods
          .create(
            address,
            form.supply,
            `${globalConf.ipfsDown}${form.avatorUrl}`,
            '0x0000000000000000000000000000000000000000000000000000000000000000',
          )
          .send({
            from: address,
          });
        if (createNFTResult.transactionHash) {
          const result = await post(
            '/api/v1/nft/',
            {
              ...form,
              address: address,
              chainType: chainType,
              hash: createNFTResult.transactionHash,
              tokenId: createNFTResult.events.TransferSingle.returnValues.id,
              tokenAddress: contractAddress,
              avatorUrl: `${globalConf.ipfsDown}${form.avatorUrl}`,
            },
            token
          );
          history.push('/asset')
        }
      }
    } finally {
      setIsLoading(false)
    }
  };

  useEffect(() => {
    if (token) {
      getCollectionList();
    }
  }, [token]);

  const renderFormItem = (label, item) => (
    <div className={styleFormItemContainer}>
      <div className='label'>{label}</div>
      {item}
    </div>
  );

  return (
    <React.Fragment>
      <Alert
        className={styleAlert}
        title={
          'You have not created the collection yet. DNFT will include a link to this URL on this item\'s detail page'
        }
        type='warning'
      />
      <div className={styleContainer}>
        <h1>
          <Icon className={styleBackArrow} icon="ic:round-arrow-back-ios-new" onClick={() => {history.push('/asset')}}/>
          Create new NFT
        </h1>
        <Upload
          className={styleUploadContainer}
          drag
          multiple={false}
          withCredentials
          action='https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/'
          limit={1}
          httpRequest={(e) => {
            uploadFile(e.file);
          }}
          fileList={form?.file ? [form?.file] : undefined}
          tip={
            <div className='el-upload__tip'>
              Drag or choose your file to upload
            </div>
          }
        >
          {form.avatorUrl ? <img style={{marginBottom: '.6rem'}} src={globalConf.ipfsDown + form.avatorUrl} alt="avatar"/> : ''}
          <i className='el-icon-upload2'></i>
          <div className='el-upload__text'>
            PNG, GIF, WEBP, MP4 or MP3. Max 1Gb.
          </div>
        </Upload>
        <h3>Item Details</h3>
        {renderFormItem(
          'Name',
          <Input
            placeholder='e. g. David'
            onChange={(value) => {
              setForm({
                ...form,
                name: value,
              });
            }}
          />
        )}
        {renderFormItem(
          'Description',
          <Input
            type='textarea'
            placeholder='description'
            autosize={{ minRows: 4, maxRows: 4 }}
            onChange={(value) => {
              setForm({
                ...form,
                description: value,
              });
            }}
          />
        )}
        {renderFormItem(
          'Collection',
          <div style={{
            display: 'flex'
          }}>
            <Select
              placeholder='Please choose'
              defaultValue={form.collectionId}
              value={form.collectionId}
              style={{flex: 1, marginRight: '8px'}}
              onChange={(value) => {
                setForm({
                  ...form,
                  collectionId: value,
                });
              }}
            >
              {options.map((el) => (
                <Select.Option key={el.value} label={el.label} value={el.value} />
              ))}
            </Select>
            <Button onClick={() => {
              setShowCreateCollection(true);
            }}>+ Add</Button>
          </div>
        )}
        {renderFormItem(
          'Category',
          <Select
            placeholder='Please choose'
            onChange={(value) => {
              setForm({
                ...form,
                category: value,
              });
            }}
          >
            {cateType.map((el) => <Select.Option
              key={el.value}
              label={el.label}
              value={el.value}
            />
            )}
          </Select>
        )}
        {renderFormItem(
          'Supply',
          <InputNumber
            defaultValue={1}
            min={1}
            onChange={(value) => {
              setForm({
                ...form,
                supply: value,
              });
            }}
          />
        )}
        {renderFormItem(
          'BlockChain',
          <Input disabled placeholder={chainType} />
        )}
        <div style={{opacity: isLoading ? 0.5 : 1}} className={styleCreateNFT} onClick={createNFT}>
          <Loading loading={isLoading} />
          Create
        </div>
      </div>
      {showCreateCollection && (
        <CreateCollectionModal
          formDs={{ address, chainType }}
          token={token}
          isNew
          onSuccess={(res) => {
            setShowCreateCollection(false);
            getCollectionList();
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
  background: #FFFFFF;
  padding: .8rem;
  border-radius: 12px;
  h1 {
    color: #23262f;
    font-size: 38px;
    margin: 0 0 20px 0;
    padding: 0;
    display: flex;
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
  .circular {
    width: 24px;
    height: 24px;
    left: -45px;
    position: relative;
    top: 24px;
  }
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
const styleBackArrow = css`
  position: sticky;
  padding: 1rem;
  border-radius: 10px;
  top: 10px;
  left: 10px;
  height: 24px;
  width: 24px;
  color: #b3bac6;
  cursor: pointer;
  transition: all .3s ease-in-out;
  &:hover{
    color: #0834e8;
    opacity: .8;
  }
`;
