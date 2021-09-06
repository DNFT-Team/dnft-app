import * as React from 'react';
import { motion, useCycle } from 'framer-motion';
import { css, cx } from 'emotion';
import { Icon } from '@iconify/react';
import { Divider, Flex, Box, Text, Avatar } from '@chakra-ui/react'
import { toast } from 'react-toastify';
import copy from 'copy-to-clipboard';
import { MENU_MAP } from 'routers/config';
import { MenuToggle } from './MenuToggle';
import Logo from 'images/home/dnftLogo.png';
import Head from 'images/asset/Head.svg';


const connectIconArray = [
  {
    name: 'github',
    url: 'https://github.com/DNFT-Team/',
    icon: 'jam:github-circle',
  },
  {
    name: 'telegram',
    url: 'https://t.me/dnftprotocol',
    icon: 'ri:telegram-line',
  },
  // {
  //   name: 'discord',
  //   url: 'https://discord.gg/pxEZB7ny',
  //   icon: 'jam:discord',
  // },
  {
    name: 'twitter',
    url: 'https://twitter.com/DNFTProtocol',
    icon: 'jam:twitter-circle',
  },
  {
    name: 'medium',
    url: 'https://medium.com/dnft-protocol',
    icon: 'jam:medium-circle',
  },
];

const variantsSidebar = {
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 20,
      restDelta: 0
    }
  },
  closed: {
    x: '100%',
    transition: {
      delay: 0.2,
      type: 'spring',
      stiffness: 400,
      damping: 40
    }
  }
};
const variantsBrand = {
  open: {
    opacity: 1,
    transition: { staggerChildren: 0.07, delayChildren: 0.4 }
  },
  closed: {
    opacity: 0,
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};
const variantsUl = {
  open: {
    transition: { staggerChildren: 0.07, delayChildren: 0.4 }
  },
  closed: {
    transition: { staggerChildren: 0.05, staggerDirection: -1 }
  }
};
const variantsLi = {
  open: {
    y: 0,
    opacity: 1,
    transition: {
      y: { stiffness: 1000, velocity: -100 }
    }
  },
  closed: {
    y: 50,
    opacity: 0,
    transition: {
      y: { stiffness: 1000 }
    }
  }
};

export const SideBar = ({address, location, skipTo}) => {
  const [isOpen, toggleOpen] = useCycle(false, true);

  return (
    <motion.div
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
    >
      <MenuToggle toggle={() => toggleOpen()} />
      <motion.nav className={styleNav} variants={variantsSidebar}>
        <motion.div className={styleBrandTitle} variants={variantsBrand}>
          <Avatar src={Logo} mr="1.5rem" width="2rem" height="2rem"/>
          <span>DNFT Protocol</span>
        </motion.div>
        <motion.div
          className={styleUserCard}
          variants={variantsLi}
        >
          <Flex color="white" alignItems="center">
            <Avatar src={Head} width="2rem" height="2rem" border="3px solid #fff"/>
            <Box flex="1" width="100%" px=".6rem"  boxSizing="border-box">
              <Text isTruncated>
                <Icon icon="mdi:content-copy" style={{marginRight: '.8rem', cursor: 'pointer'}} onClick={() => {
                  copy(address);
                  toast.success('The address is copied successfully!', { position: toast.POSITION.TOP_CENTER });
                }}/>
                Wallet Address
              </Text>
              <Text isTruncated>{address || '--'}</Text>
            </Box>
          </Flex>
        </motion.div>
        <Divider mt="3rem" mb="1rem"/>
        <motion.ul className={styleMenuUl} variants={variantsUl}>
          {MENU_MAP.map((item) => (
            <motion.li
              className={cx(
                styleMenuLi,
                location === item.path && styleMenuActive
              )}
              variants={variantsLi}
              whileHover={{ scale: 1.1, borderLeft: '3px solid #0049c6' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                toggleOpen(); skipTo(item)
              }}
            >
              <div className={styleMenuRow}>
                <img src={item.icon} alt="icon"/>
                {item.navName}
              </div>
              <Icon icon="ic:baseline-chevron-right"/>
            </motion.li>
          ))}
        </motion.ul>
        <div className={styleContactUs}>
          {connectIconArray.map((item, i) => (
            <a
              className="item"
              href={item.url} target='_blank'
              key={i} rel="noreferrer"
            >
              <Icon icon={item.icon} />
            </a>
          ))}
        </div>
      </motion.nav>
    </motion.div>
  );
};

const styleMenuActive = css`
  background: #0049c6;
  border-radius: 1.07rem;
`
const styleNav = css`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  //width: 280px;
  width: 20rem;
  background: #233071;
  z-index: 9998;
`
const styleBrandTitle = css`
  color: #FFFFFF;
  font-weight: bolder;
  display: inline-flex;
  align-items: center;
  justify-content: space-evenly;
  padding: .714rem 2.14rem .714rem 2rem;
  user-select: none;
  height: 4.571rem;
`
const styleUserCard = css`
  margin-top: 2rem;
  padding-left: 1.7857rem;
  width: 80%;
`
const styleMenuUl = css`
  padding: 1.7857rem;
  width: 80%;
  min-height: 50vh;
  overflow: auto;
`
const styleMenuLi = css`
  list-style: none;
  margin-bottom: 1.4286rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  svg{
    font-size: 2.2857rem;
    color: #FFFFFF;
  }
`
const styleMenuRow = css`
  color: #FFFFFF;
  display: flex;
  align-items: center;
  img{
    width: 2.857rem;
    height: 2.857rem;
    border-radius: 50%;
    display: inline-block;
    margin-right: 1.2rem;
  }
`
const styleContactUs = css`
  display: flex;
  flex-direction: row;
  gap: 2.12rem;
  justify-content: center;
  .item{
    text-decoration: none;
    font-size: 1.84rem;
    color: white;
    &:hover{
      svg{
        transform: scale(1.2);
      }
    }
  }
`;
