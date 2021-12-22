import React from 'react';
import { Dialog, Button } from 'element-react';
import { css, cx } from 'emotion';

const SwitchModal = (props) => {
  const { networkName, goToRightNetwork, onClose, visible } = props;
  const isMetamask = window.ethereum.selectedAddress;

  return (
    <Dialog
      size="tiny"
      className={styleSwitchModal}
      visible={visible}
      closeOnClickModal={false}
      closeOnPressEscape={false}
    >
      <Dialog.Body>
        {isMetamask ? (
          <span>
            You’ve connected to unsupported networks, please switch to{' '}
            {networkName} network.
          </span>
        ) : (
          <span>
            You’ve connected to unsupported networks, please switch to{' '}
            {networkName} network and reconnect wallet.
          </span>
        )}
      </Dialog.Body>
      <Dialog.Footer className='dialog-footer'>
        <Button onClick={async () => {
          if (window.ethereum.selectedAddress) {
            goToRightNetwork(window.ethereum);
          } else if (window.walletProvider) {
            window.walletProvider.disconnect();
            onClose();
          } else if (window.onto) {
            // window.onto.disconnect();
            onClose();
          }
        }}>{window.ethereum.selectedAddress ? 'Switch Network' : 'Disconnect'}</Button>
      </Dialog.Footer>
    </Dialog>);
};

export default SwitchModal;

const styleSwitchModal = css`
  @media (max-width: 900px) {
    width: calc(100% - 32px);
  }
  border-radius: 10px;
  width: 400px;
  padding: 40px 30px 30px 30px;
  .el-dialog__header {
    display: none;
  }
  .el-dialog__body {
    padding: 0;
    font-family: Archivo Black;
    color: #000000;
    font-size: 18px;
    line-height: 30px;
    span {
      display: flex;
      text-align: center;
    }
  }
  .dialog-footer {
    padding: 0;
    text-align: center;
    margin-top: 16px;
    button {
      background: rgba(0, 87, 217, 1);
      color: #FCFCFD;
      font-size: 16px;
      border-radius: 10px;
      font-family: Archivo Black;
      padding: 18px 24px;
    }
  }
`