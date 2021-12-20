import {
  Dialog, Button,
  Input, InputNumber,
  Select, Upload, Loading,
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
import { getObjectURL } from 'utils/tools';
import { toast } from 'react-toastify';
import {
  createNFTContract1155,
  createNFTContract721,
} from '../../../utils/contract';
import { createNFTAbi1155, createNFTAbi721 } from '../../../utils/abi';
import Web3 from 'web3';
import globalConfig from '../../../config';
import LoadingIcon from '../../../images/asset/loading.gif'
const CreateNFTModal = (props) => {
  const { dispatch, datas, collectionId, location, address, chainType, token, categoryList, onClose } =
    props;
  const [options, setOptions] = useState([]);
  const [showCreateCollection, setShowCreateCollection] = useState(false);
  const [form, setForm] = useState({
    supply: 1,
    contractType: '721',
    collectionId: collectionId,
  });
  console.log(form,'collectionIdcollectionIdcollectionIdcollectionId')
  const [nftUrl, setNftUrl] = useState();
  const [nftFile, setNftFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadLoading, setIsUploadLoading] = useState(false);
  const currentNetEnv = globalConfig.net_env;
  const currentNetName = globalConfig.net_name;

  let history = useHistory();

  const paramsMap = {
    name: 'name',
    collectionId: 'collection',
    category: 'category',
    contractType: 'contract type',
    supply: 'supply',
  };

  const contractType = [
    { label: '1155', value: '1155' },
    { label: '721', value: '721' },
  ];
  const uploadFile = async (file) => {
    setNftUrl('')
    setNftFile(null)
    setIsUploadLoading(true);
    try {
      const imgUrl = getObjectURL(file)
      imgUrl && setNftFile(file)
      return imgUrl
    } catch (e) {
      console.log(e, 'e');
    } finally {
      setIsUploadLoading(false);
    }
  };

  const beforeUpload = (file) => {
    const isLt10M = file.size / 1024 / 1024 < 10;
    if (!isLt10M) {
      toast.warn('The size of the uploaded NFT image cannot exceed 10MB!', {
        position: toast.POSITION.TOP_CENTER,
      });
      return false;
    }
  }

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
      let list = data?.data?.content || [];
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
    if (history.location.pathname !== '/asset') {
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
        return false;
      }
      return form[item[0]] === undefined;
    });

    if (!nftFile) {
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
      //  upload ipfs
      toast.info('Step 1. Upload NFT To IPFS...');
      const fileData = new FormData();
      fileData.append('file', nftFile);
      const { data } = await ipfs_post('/v0/add', fileData);
      const ipfsHash = data?.['Hash']
      console.log('ipfsHash', ipfsHash);
      if (!ipfsHash) {
        toast.error('NFT upload failed!');
        return
      }
      toast.success('NFT upload success!');
      toast.info('Step 2. Mint NFT via contract...');
      //  mint nft
      let wallet = window.ethereum.selectedAddress ? window.ethereum : window.walletProvider;
      if (wallet) {
        window.web3 = new Web3(wallet);
        await wallet.enable();

        let createNFTResult;
        let contractAddress =
          form.contractType == 1155
            ? createNFTContract1155[currentNetName]
            : createNFTContract721[currentNetName];

        if (form.contractType == 1155) {
          const myContract = new window.web3.eth.Contract(
            createNFTAbi1155,
            contractAddress
          );
          const fee = await myContract.methods.bnbFee().call();

          createNFTResult = await myContract.methods
            .create(
              address,
              form.supply,
              `${globalConf.ipfsDown}${ipfsHash}`,
              '0x0000000000000000000000000000000000000000000000000000000000000000'
            )
            .send({
              from: address,
              value: fee,
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
                avatorUrl: `${globalConf.ipfsDown}${ipfsHash}`,
              },
              token
            );
            onClose(true);
          }
        } else {
          const myContract = new window.web3.eth.Contract(
            createNFTAbi721,
            contractAddress
          );
          const fee = await myContract.methods.bnbFee().call();

          createNFTResult = await myContract.methods
            .create(address, `${globalConf.ipfsDown}${ipfsHash}`)
            .send({
              from: address,
              value: fee,
            });

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
                avatorUrl: `${globalConf.ipfsDown}${ipfsHash}`,
              },
              token
            );
            onClose(true);
          }
        }
      }
    } catch (e) {
      console.log(e, 'e')
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      getCollectionList();
    }
  }, [token]);

  const renderFormItem = (label, item, isRequired) => (
    <div className={styleFormItemContainer}>
      <div className='label'>{label}<span style={{color: '#FF2E2E'}}>{isRequired && '*'}</span></div>
      {item}
    </div>
  );

  return (
    <React.Fragment>
      <Dialog
        customClass={styleModalContainer}
        title='Create NFT'
        visible
        closeOnClickModal={false}
        onCancel={() => {
          onClose();
        }}
      >
        <Dialog.Body>
          <div className={styleContainer}>
            <Upload
              className={styleUploadContainer}
              drag
              multiple={false}
              withCredentials
              showFileList={false}
              action=''
              beforeUpload={(file) => beforeUpload(file)}
              httpRequest={async (e) => {
                let result = await uploadFile(e.file);
                setNftUrl(result);
              }}
              onRemove={() => {
                setNftUrl(undefined);
              }}
            >
              {isUploadLoading ? (
                <Loading />
              ) : (
                <React.Fragment>
                  {nftUrl ? (
                    <img style={{ marginBottom: '.6rem' }} src={nftUrl} alt='' />
                  ) : (
                    <React.Fragment>
                      <i className='el-icon-upload2' />
                      <div className='el-upload__text'>
                        PNG, GIF
                      </div>
                      {/* <div className='el-upload__text'>
                        Recommended size: 300 (W) X 300 (H)
                      </div> */}
                    </React.Fragment>
                  )}
                </React.Fragment>
              )}
            </Upload>
            {renderFormItem(
              'Name',
              <Input
                placeholder='e. g. David (Maximum 30 char)'
                maxLength={30}
                onChange={(value) => {
                  setForm({
                    ...form,
                    name: value,
                  });
                }}
              />, true
            )}
            {renderFormItem(
              'Description',
              <Input
                type='textarea'
                placeholder='Description (Maximum 500 char)'
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
              <div style={{ display: 'flex' }}>
                <Select
                  placeholder='Please choose'
                  defaultValue={form.collectionId}
                  value={form.collectionId}
                  className={styleCollection}
                  style={{ flex: 1, marginRight: '8px' }}
                  onChange={(value) => {
                    setForm({
                      ...form,
                      collectionId: value,
                    });
                  }}
                >
                  {options.map((el) => (
                    <Select.Option
                      key={el.value}
                      label={el.label}
                      value={el.value}
                    />
                  ))}
                </Select>
                <Button
                  onClick={() => {
                    setShowCreateCollection(true);
                  }}
                >
                  + Add
                </Button>
              </div>, true
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
              </Select>, true
            )}
            <div style={{display: 'flex', gap: '20px'}}>
              {renderFormItem(
                'Contract Type',
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
                  {contractType.map((el) => (
                    <Select.Option
                      key={el.value}
                      label={el.label}
                      value={el.value}
                    />
                  ))}
                </Select>, true
              )}
              {form.contractType != '721' &&
                renderFormItem(
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
                  />, true
                )}
            </div>
            <div
              style={{ opacity: isLoading ? 0.5 : 1 }}
              className={styleCreateNFT}
              onClick={createNFT}
            >
              <Loading loading={isLoading} />
              Create
            </div>
          </div>
        </Dialog.Body>
      </Dialog>
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
      {isLoading && <div className={styleLoadingIconContainer}>
        <img src={LoadingIcon}/>
      </div>}
    </React.Fragment>
  );
};

const mapStateToProps = ({ profile, market }) => ({
  address: profile.address,
  chainType: profile.chainType,
  categoryList: market.category,
  token: profile.token,
});
export default withRouter(connect(mapStateToProps)(CreateNFTModal));


const styleLoadingIconContainer = css`
  position: absolute;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  z-index: 1000000000;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 158px;
    height: 145px;
    overflow: hidden;
    border-radius: 20px;
  }
`
const styleModalContainer = css`
  max-width: 564px;
  width: calc(100% - 40px);
  border-radius: 10px;
  height: 80vh;
  overflow: auto;

  .el-dialog__headerbtn .el-dialog__close {
    color: #233a7d;
    font-size: 12px;
  }
  .el-dialog__title {
    color: #11142d;
    font-size: 18px;
    font-weight: 500;
    font-family: Poppins;
  }
  .el-dialog__header {
    padding: 20px 32px 12px 32px;
  }
  .el-dialog__body {
    padding: 0 32px 32px 32px;
  }
  .el-input-number {
    width: 100%;
  }
`;

const styleContainer = css`
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 12px;
  .el-textarea__inner {
    font-family: Arial;
    background: #F4F5F6;
    border: none;
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
  margin-bottom: 18px;
  .el-upload {
    width: 100%;
    .el-upload-dragger {
      display: flex;
      flex-direction: column;
      color: #777e90;
      background-color: #f4f5f6;
      min-height: 182px;
      width: 204px;
      justify-content: center;
      border-radius: 10px;
      border: none;
      height: auto;
      @media (max-width: 900px) {
        width: 100%;
      }

      .el-upload__text {
        margin-top: 10px;
        padding: 0 40px;
        font-size: 12px;
      }
    }
  }
`;

const styleFormItemContainer = css`
  display: flex;
  flex-direction: column;
  margin-bottom: 30px;
  flex: 1;
  .label {
    margin-bottom: 10px;
    font-family: Inter;
  }
`;

const styleCreateNFT = css`
  background-color: rgba(17, 45, 242, 1);
  color: white;
  padding: 12px;
  font-size: 16px;
  border-radius: 5px;
  cursor: pointer;
  text-align: center;
  .circular {
    width: 24px;
    height: 24px;
    left: -45px;
    position: relative;
    top: 24px;
  }
`;

const styleCollection = css`
  .el-select-dropdown__empty {
    width: 0;
    overflow: hidden;
    &:before {
      content: 'No Data';
      display: block;
      position: absolute;
      top: 50%;
      left: 0;
      height: 100%;
      width: 100%;
      overflow: hidden;
    }
  }
`;
