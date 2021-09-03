import * as React from 'react';
import { motion, useCycle } from 'framer-motion';
import { css } from 'emotion';
import { Icon } from '@iconify/react';
import {Divider, Flex, Box, Text} from '@chakra-ui/react'
import { MENU_MAP } from 'routers/config';
import { MenuToggle } from './MenuToggle';
import Logo from 'images/home/dnftLogo.png';

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

export const SideBar = () => {
  const [isOpen, toggleOpen] = useCycle(false, true);

  return (
    <motion.div
      initial={false}
      animate={isOpen ? 'open' : 'closed'}
    >
      <MenuToggle toggle={() => toggleOpen()} />
      <motion.nav className={styleNav} variants={variantsSidebar}>
        <motion.div className={styleBrandTitle} variants={variantsBrand}>
          <img src={Logo} alt="DNFT" style={{width: '2rem', height: '2rem', marginRight: '1.5rem'}}/>
          <span>DNFT Protocol</span>
        </motion.div>
        <motion.div
          className={styleUserCard}
          variants={variantsLi}
        >
          <Flex color="white" alignItems="center">
            <img src={Logo} alt="" style={{width: '2rem', height: '2rem'}}/>
            <Box flex="1" width="100%" px=".6rem"  boxSizing="border-box">
              <Text isTruncated>Alice</Text>
              <Text isTruncated>0xf16D2789cF63EDB255A5EB2805D8edA78b4EOOOO</Text>
            </Box>
          </Flex>
        </motion.div>
        <Divider mt="3rem" mb="1rem"/>
        <motion.ul className={styleMenuUl} variants={variantsUl}>
          {MENU_MAP.map((item, i) => (
            <motion.li
              className={styleMenuLi}
              variants={variantsLi}
              whileHover={{ scale: 1.1, borderLeft: '3px solid #0049c6' }}
              whileTap={{ scale: 0.95 }}
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

const styleNav = css`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  height: 100vh;
  width: 280px;
  background: #233071;
  z-index: 9998;
`
const styleBrandTitle = css`
  color: #FFFFFF;
  font-weight: bolder;
  display: inline-flex;
  align-items: center;
  justify-content: space-evenly;
  margin: .3rem .8rem 2rem .8rem;
  user-select: none;
`
const styleUserCard = css`
  margin-top: 2rem;
  padding-left: 25px;
  width: 80%;
`
const styleMenuUl = css`
  padding: 25px;
  width: 80%;
  min-height: 50vh;
  overflow: auto;
`
const styleMenuLi = css`
  list-style: none;
  margin-bottom: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  svg{
    font-size: 32px;
    color: #FFFFFF;
  }
`
const styleMenuRow = css`
  color: #FFFFFF;
  display: flex;
  align-items: center;
  img{
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: inline-block;
    margin-right: 1.2rem;
  }
`
const styleContactUs = css`
  display: flex;
  flex-direction: row;
  gap: 24px;
  justify-content: center;
  .item{
    text-decoration: none;
    font-size: 23px;
    color: white;
    &:hover{
      svg{
        transform: scale(1.2);
      }
    }
  }
`;
