import React, { useMemo, useState } from "react";
import { Dialog, Input } from "element-react";
import styles from "./index.less";
import { css } from "emotion";
import {
  ethSvg,
  assetSvg,
  downArrowSvg,
  netEthSvg,
  bscNetSvg,
  heroNetSvg,
  polkadotNetSvg,
  dnftNetSvg,
  bscSvg,
  hecoSvg,
  polkadotSvg,
  dnftSvg,
} from "../../utils/svg";
import { useHistory } from "react-router";

const GlobalHeader = (props) => {
  let history = useHistory();

  const [isNetListVisible, setIsNetListVisible] = useState(false);
  const [currentNetIndex, setCurrentNetIndex] = useState(0);

  const netArray = [
    {
      name: "Ethereum Mainnet",
      icon: netEthSvg,
      shortName: ["ETH", "Ethereum"],
      shortIcon: ethSvg,
    },
    {
      name: "Bsc Mainnet",
      icon: bscNetSvg,
      shortName: ["BSC", "Bsc"],
      shortIcon: bscSvg,
    },
    {
      name: "Heco Mainnet",
      icon: heroNetSvg,
      shortName: ["HECO", "Heco"],
      shortIcon: hecoSvg,
    },
    {
      name: "Polkadot Mainnet",
      icon: polkadotNetSvg,
      shortName: ["DOT", "Polkadot"],
      shortIcon: polkadotSvg,
    },
    {
      name: "DNFT Mainnet",
      icon: dnftNetSvg,
      shortName: ["DNFT", "Dnft"],
      shortIcon: dnftSvg,
    },
  ];

  const renderModal = useMemo(() => {
    return (
      <Dialog
        customClass={styleModalContainer}
        title="Switch to"
        visible={isNetListVisible}
        onCancel={() => {
          setIsNetListVisible(false);
        }}
      >
        <Dialog.Body>
          {netArray.map((item, index) => {
            return (
              <div
                className={styleNetItem}
                style={{ border: index === netArray.length - 1 && "none" }}
                onClick={() => {
                  setIsNetListVisible(false);
                  setCurrentNetIndex(index);
                }}
              >
                <span className={styleNetIcon}>{item.icon}</span>
                <span>{item.name}</span>
              </div>
            );
          })}
        </Dialog.Body>
      </Dialog>
    );
  }, [netArray]);

  return (
    <header className={styleHeader}>
      <div className={styleSearchContainer}>
        <i className="el-icon-search"></i>
        <Input placeholder={"Search Art,Game or Fun"} />
      </div>
      <div className={styles.actionContainer}>
        <div
          className={actionItem}
          onClick={() => {
            history.push("asset");
          }}
        >
          {assetSvg}
        </div>
        <div
          className={actionItem}
          onClick={() => {
            setIsNetListVisible(true);
          }}
        >
          {netArray[currentNetIndex].shortIcon}
        </div>
        <div
          className={styleNetContainer}
          onClick={() => {
            setIsNetListVisible(true);
          }}
        >
          <div className={styleNetContainer}>
            <span className={styleNetName}>
              {netArray[currentNetIndex].shortName[0]}
            </span>
            {downArrowSvg}
          </div>
          <div style={{ color: "#8F9BBA" }}>
            {netArray[currentNetIndex].shortName[1]}
          </div>
        </div>
      </div>
      {renderModal}
    </header>
  );
};
export default GlobalHeader;

const styleHeader = css`
  display: flex;
  height: 64px;
  padding: 24px 30px 24px 56px;
  position: sticky;
  top: 0;
  z-index: 100;
  background: white;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.05);
  input {
    &:focus {
      outline: none;
    }
  }
`;

const actionItem = css`
  display: flex;
  background: #1c2656;
  border-radius: 42px;
  height: 42px;
  width: 42px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  margin-left: 30px;
  margin-right: 10px;
  filter: drop-shadow(2px 3px 10px rgba(0, 0, 0, 0.25));
  cursor: pointer;
`;

const styleNetContainer = css`
  position: relative;
  top: -2px;
  cursor: pointer;
  width: 90px;
  svg {
    position: relative;
    top: -4px;
  }
`;
const styleNetName = css`
  font-weight: bold;
  margin-right: 24px;
`;

const styleModalContainer = css`
  width: 650px;
  border-radius: 10px;

  .el-dialog__headerbtn .el-dialog__close {
    color: #233a7d;
    font-size: 24px;
  }
  .el-dialog__title {
    color: #233a7d;
    font-size: 24px;
  }
  .el-dialog__body {
    padding: 20px 16px;
  }
`;

const styleNetItem = css`
  display: flex;
  align-items: center;
  height: 70px;
  border-bottom: 1px solid #dddddd;
  font-size: 18px;
  color: #233a7d;
  font-weight: bold;
  padding: 0 20px;
  cursor: pointer;
  &:hover {
    background: #f6f7f9;
  }
`;

const styleNetIcon = css`
  margin-right: 20px;
`;

const styleSearchContainer = css`
  display: flex;
  flex: 2;
  border-right: 1px solid #cdcfd4;
  align-items: center;
  font-size: 28px;
  margin-bottom: 16px;
  padding-top: 12px;
  .el-input__inner {
    border: none;
    font-size: 14px;
    margin-left: 20px;
    width: 100%;
    color: #8f9bba;
  }
`;
