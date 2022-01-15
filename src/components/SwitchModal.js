import React from 'react';
import { Dialog, Button } from 'element-react';
import { css, cx } from 'emotion';
import { useTranslation } from 'react-i18next';

const SwitchModal = (props) => {
  const { networkName, goToRightNetwork, onClose, visible } = props;
  const { t } = useTranslation();

  const getTipsByWallet = () => {
    if (window.ethereum?.selectedAddress) {
      return <span>{t('toast.selected.ethereum', {networkName})}</span>
    }
    if (window.walletProvider?.connected) {
      return <span>{t('toast.selected.walletProvider', {networkName})}</span>
    }
    if (window.onto?.selectedAddress) {
      return <span>{t('toast.selected.onto', {networkName})}</span>
    }
  };

  const renderButtonByWallet = () => {
    if (window.ethereum?.selectedAddress) {
      return <Button onClick={async () => {
        goToRightNetwork(window.ethereum);
      }}>{t('network.switch')}</Button>
    }
    if (window.walletProvider?.connected) {
      return <Button onClick={async () => {
        window.walletProvider.disconnect();
        onClose();
      }}>{t('network.disconnect')}</Button>
    }
    if (window.onto?.selectedAddress) {
      return null
    }
  }

  return (
    <Dialog
      size="tiny"
      className={styleSwitchModal}
      visible={visible}
      closeOnClickModal={false}
      closeOnPressEscape={false}
    >
      <Dialog.Body>
        {getTipsByWallet()}
      </Dialog.Body>
      <Dialog.Footer className='dialog-footer'>
        {renderButtonByWallet()}
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