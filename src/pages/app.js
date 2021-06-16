import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { store } from "reduxs/store";
import Router from "routers";
import { navRouter } from "routers/config";
import styles from "./app.less";
import { connect } from "react-redux";
import { withRouter, useHistory } from "react-router-dom";
import Logo from "images/home/dnftLogo.png";
import GlobalHeader from "components/globalHeader";
import {
  AppstoreOutlined,
  BookOutlined,
  CalendarOutlined,
  ContactsOutlined,
  DingdingOutlined,
  GithubOutlined,
  MediumOutlined,
  SnippetsOutlined,
  TwitterOutlined,
} from "@ant-design/icons";
import { css } from "emotion";
import { MSvg, twitterSvg, paperSvg, linkInSvg, githubSvg } from "../utils/svg";

const App = (props) => {
  const { t, i18n } = useTranslation();
  const {
    location: { pathname },
  } = props;
  const [tab, setTab] = useState(pathname);
  let history = useHistory();
  useEffect(() => {
    try {
      i18n.changeLanguage(store.getState().lng.lng.value);
    } catch (e) {
      i18n.changeLanguage("zh");
      console.log("getLngFromState error : ", e);
    }
  }, []);
  const handleTo = (value) => {
    history.push(value.path);
    setTab(value.path);
  };

  const navIconArray = [
    <AppstoreOutlined />,
    <BookOutlined />,
    <SnippetsOutlined />,
    <CalendarOutlined />,
    <ContactsOutlined />,
  ];

  const contectIconArray = [MSvg, twitterSvg, paperSvg, linkInSvg, githubSvg];
  return (
    <section className={styles.container}>
      <section className={styles.leftNav}>
        <img className={styles.logo} src={Logo} />
        <section className={styles.menu}>
          {navRouter.map((obj, index) => {
            const isActive = tab === obj.path;

            return (
              <nav
                onClick={() => handleTo(obj)}
                key={index}
                className={`${styles.nav} ${isActive && styles.navActive}`}
              >
                <div
                  className={`${styles.navImg} ${isActive && styles.navActive}`}
                >
                  {navIconArray[index]}
                </div>
                <span
                  className={`${styles.navText} ${
                    isActive && styles.navActive
                  }`}
                >
                  {obj.navName}
                </span>
              </nav>
            );
          })}
        </section>
        <section className={styleFootNoteContainer}>
          <div className={styleContactUs}>
            {contectIconArray.map((item) => item)}
          </div>
          <div className={styleFootNote}>
            <div>
              Powered by <b>DNFT Protocol</b>
            </div>
            <div>2021 DNFT All rights reserved</div>
          </div>
        </section>
      </section>
      <section className={styles.rightContainer}>
        <GlobalHeader />
        <Router />
      </section>
    </section>
  );
};
export default withRouter(connect()(App));

const styleFootNoteContainer = css`
  position: absolute;
  bottom: 5vh;
`;

const styleContactUs = css`
  display: flex;
  flex-direction: row;
  gap: 24px;
  margin-left: 20px;
`;

const styleFootNote = css`
  margin-top: 3vh;
  color: #c0beff;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 300;
`;
