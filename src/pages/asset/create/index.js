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
import React, { useEffect, useState, useCallback } from 'react';
import globalConf from 'config/index';
import CreateCollectionModal from '../../../components/CreateCollectionModal';
import { post } from 'utils/request';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { useHistory } from 'react-router';
import { ipfs_post } from 'utils/ipfs-request';
import { toast } from 'react-toastify';
import { Icon } from '@iconify/react'
import { createNFTContract1155, createNFTContract721 } from '../../../utils/contract';
import { createNFTAbi1155, createNFTAbi721 } from '../../../utils/abi';
import Web3 from 'web3';
import globalConfig from '../../../config';

const CreateNFT = (props) => {
  const { dispatch, datas, location, address, chainType, token, categoryList } = props;

  const [options, setOptions] = useState([]);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [form, setForm] = useState({
    supply: 1,
    contractType: '721'
  });

  const [nftUrl, setNftUrl] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const currentNetEnv = globalConfig.net_env;
  const currentNetName = globalConfig.net_name;

  let history = useHistory();

  const paramsMap = {
    name: 'name',
    collectionId: 'collection',
    category: 'category',
    contractType: 'contact type',
    supply: 'supply'
  }

  const cateType = [
    // { label: 'Lasted', value: 'LASTED' },
    { label: 'Virtual Reality', value: 'VIRTUAL_REALITY' },
    { label: 'Domain', value: 'DOMAIN' },
    { label: 'Art', value: 'ART' },
    { label: 'Cooection', value: 'COOECTION' },
    { label: 'Sports', value: 'SPORTS' },
    { label: 'Game', value: 'GAME' },
  ];

  const contractType = [
    { label: '1155', value: '1155' },
    { label: '721', value: '721' },
  ];

  const uploadFile = async (file) => {
    try {
      setIsUploadLoading(true)
      const fileData = new FormData();
      fileData.append('file', file);

      const { data } = await ipfs_post('/v0/add', fileData);
      return data;
    } catch (e) {
      console.log(e, 'e');
    } finally {
      setIsUploadLoading(false)
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
      let list = data?.data?.content || []
      setOptions(
        list.map((item) => ({
          label: item.name,
          value: item.id,
        }))
      );
    } catch (e) {
      console.log(e, 'e');
      setOptions([]);
    }
  };

  const goToRightNetwork = useCallback(async (ethereum) => {
    if (history.location.pathname !== '/asset/create') {
      return;
    }
    try {
      if (currentNetEnv === 'testnet') {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x61',
              chainName: 'Smart Chain Test',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
              },
              rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
            },
          ],
        });
      } else {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x38',
              chainName: 'Smart Chain',
              nativeCurrency: {
                name: 'BNB',
                symbol: 'bnb',
                decimals: 18,
              },
              rpcUrls: ['https://bsc-dataseed.binance.org/'],
            },
          ],
        });
      }

      return true;
    } catch (error) {
      console.error('Failed to setup the network in Metamask:', error);
      return false;
    }
  }, []);

  const createNFT = async () => {
    if (!['BSC'].includes(chainType)) {
      goToRightNetwork(window.ethereum);
      return;
    }

    let inValidParam = Object.entries(paramsMap).find((item) => {
      if (item[0] === 'supply' && form.contractType == '721') {
        return false
      }
      return form[item[0]] === undefined;
    });

    if (!nftUrl) {
      toast.dark('please upload NFT', {
        position: toast.POSITION.TOP_CENTER,
      });
      return;
    }

    if (inValidParam) {
      toast.dark(`please input ${inValidParam[1]}`, {
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

        let createNFTResult;
        let contractAddress = form.contractType == 1155 ?  createNFTContract1155[currentNetName] : createNFTContract721[currentNetName]

        if (form.contractType == 1155) {
          const myContract = new window.web3.eth.Contract(
            createNFTAbi1155,
            contractAddress
          );
          const fee = await myContract.methods.bnbFee().call()

          createNFTResult = await myContract.methods
            .create(
              address,
              form.supply,
              `${globalConf.ipfsDown}${nftUrl}`,
              '0x0000000000000000000000000000000000000000000000000000000000000000',
            )
            .send({
              from: address,
              value: fee
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
                avatorUrl: `${globalConf.ipfsDown}${nftUrl}`,
              },
              token
            );
            history.push('/asset')
          }
        } else {
          const myContract = new window.web3.eth.Contract(
            createNFTAbi721,
            contractAddress
          );
          const fee = await myContract.methods.bnbFee().call()

          createNFTResult = await myContract.methods
            .create(
              address,
              `${globalConf.ipfsDown}${nftUrl}`,
            )
            .send({
              from: address,
              value: fee
            });
          console.log(createNFTResult, 'createNFTResult')

          if (createNFTResult.transactionHash) {

            const result = await post(
              '/api/v1/nft/',
              {
                ...form,
                address: address,
                supply: 1,
                chainType: chainType,
                hash: createNFTResult.transactionHash,
                tokenId: createNFTResult.events.Transfer.returnValues.tokenId,
                tokenAddress: contractAddress,
                avatorUrl: `${globalConf.ipfsDown}${nftUrl}`,
              },
              token
            );
            history.push('/asset')
          }
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
          'DNFT strongly recommends that you better manage and display your NFTs by creating the collection！We will support the share-url to the collection in the next release.'
        }
        type='warning'
      />
      <div className={styleContainer}>
        <h1>
          <Icon className={styleBackArrow} icon="ic:round-arrow-back-ios-new" onClick={() => {history.push('/asset')}}/>
          Create New NFT
        </h1>
        <Upload
          className={styleUploadContainer}
          drag
          multiple={false}
          withCredentials
          showFileList={false}
          action='https://www.mocky.io/v2/5185415ba171ea3a00704eed/posts/'
          httpRequest={async (e) => {
            let result = await uploadFile(e.file);
            setNftUrl(result.Hash)
          }}
          onRemove={() => {
            setNftUrl(undefined)
          }}
          tip={
            <div className='el-upload__tip'>
              Drag or choose your file to upload
            </div>
          }
        >
          {isUploadLoading ? (
            <Loading />
          ) : (
            <React.Fragment>
              {nftUrl ? (
                <img
                  style={{ marginBottom: '.6rem' }}
                  src={globalConf.ipfsDown + nftUrl}
                  alt="avatar"
                />
              ) : (
                <React.Fragment>
                  <i className='el-icon-upload2'></i>
                  <div className="el-upload__text">
                    PNG, GIF, WEBP, MP4 or MP3. Max 1Gb.
                  </div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
        </Upload>
        <h3>Item Details</h3>
        {renderFormItem(
          'Name - Max 30 char',
          <Input
            placeholder='e. g. David'
            maxLength={30}
            onChange={(value) => {
              setForm({
                ...form,
                name: value,
              });
            }}
          />
        )}
        {renderFormItem(
          'Description - Max 500 char',
          <Input
            type='textarea'
            placeholder='Description'
            maxLength={500}
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
          <div style={{display: 'flex'}}>
            <Select
              placeholder='Please choose'
              defaultValue={form.collectionId}
              value={form.collectionId}
              className={styleCollection}
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
          'Contact Type',
          <Select
            value={form.contractType}
            placeholder='Please choose'
            onChange={(value) => {
              setForm({
                ...form,
                contractType: value,
              });
            }}
          >
            {contractType.map((el) => <Select.Option
              key={el.value}
              label={el.label}
              value={el.value}
            />
            )}
          </Select>
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
            {categoryList?.slice(1)?.map((el) => (
              <Select.Option key={el} label={el} value={el} />
            ))}
          </Select>
        )}
        {form.contractType != '721' && renderFormItem(
          'Supply',
          <InputNumber
            defaultValue={1}
            min={1}
            max={10000}
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

const mapStateToProps = ({ profile, market }) => ({
  address: profile.address,
  chainType: profile.chainType,
  categoryList: market.category,
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
  .el-textarea__inner {
    font-family: Arial;
  }
  @media (max-width: 900px) {
    margin: 16px 0;
  }

  h1 {
    color: #23262f;
    font-size: 38px;
    margin: 0 0 20px 0;
    padding: 0;
    display: flex;
    @media (max-width: 900px) {
      font-size: 18px;
    }

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
  .el-upload{
    width: 100%;
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      color: #777e90;
      background-color: #f4f5f6;
      min-height: 182px;
      width: 500px;
      justify-content: center;
      border-radius: 10px;
      border: none;
      height: auto;
      @media (max-width: 900px) {
        width: inherit;
      }
      .el-upload__text {
        margin-top: 10px;
      }
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
  overflow: initial;
  display: flex;
  align-items: center;
  position: sticky;
  top: 84px;
  z-index: 2;
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
  @media (max-width: 900px) {
    padding:0 10px 0 0 ; 
  }
`;

const styleCollection = css`  
  .el-select-dropdown__empty {
    width: 0;
    overflow: hidden;
    &:before {
      content: "No Data";
      display: block;
      position: absolute;
      top: 50%;
      left: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
  }
`
