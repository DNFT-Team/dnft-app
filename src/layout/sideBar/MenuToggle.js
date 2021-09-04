import * as React from 'react';
import { motion } from 'framer-motion';
import { css } from 'emotion';

const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="currentColor"
    strokeLinecap="round"
    {...props}
  />
);

export const MenuToggle = ({ toggle }) => (
  <div onClick={toggle} className={styleToggle} >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: 'M 2 2.5 L 20 2.5', color: '#112DF2' },
          open: { d: 'M 3 16.5 L 17 2.5', color: '#fff' }
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1, color: '#112DF2' },
          open: { opacity: 0, color: '#fff' }
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: 'M 2 16.346 L 20 16.346', color: '#112DF2' },
          open: { d: 'M 3 2.5 L 17 16.346', color: '#fff' }
        }}
      />
    </svg>
  </div>
);
const styleToggle = css`
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  position: relative;
`
