import React from 'react';
import { css } from 'emotion';
import { Button } from '@chakra-ui/react';

export const Btn = (props) => {
  const { children, bgColor } = props;
  return (
    <Button
      className={styleBtn}
      h={['48px', '48px', '48px', '40px']}
      bg={bgColor || '#0057d9'}
      sx={{
        '&': {
          color: 'white',
          background: bgColor || '#0057D9',
        },
      }}
      fontSize={'16px'}
      borderRadius={'10px'}
      {...props}
    >
      {children}
    </Button>
  );
};
const styleBtn = css`
  margin: 0 auto;
  background: #0057d9;
  font-family: Archivo Black;
  border-radius: 10px;
  outline: none;
  color: #fcfcfd;
  border: 0;
    /* &:hover {
        color: #fff;
        background: #0057D9;
    } */
`;
