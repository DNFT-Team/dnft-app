import React from 'react';
import { css } from 'emotion';
import { Button } from 'element-react';

export const Btn = (props) => {
  const { children } = props;
  return (
    <Button className={styleBtn} {...props}>
      {children}
    </Button>
  );
};
const styleBtn = css`  
    height: 40px;
    margin: 0 auto;
    background: #0057D9;
    border-radius: 5px;
    font-size: 16px;
    font-family: Archivo Black;
    border-radius: 10px;
    outline: none;
    color: #FCFCFD;
    border: 0;
    &:hover {
        color: #fff;
        background: #0057D9;
    }
    @media (max-width: 900px) {
        height: 48px;
    }
`;
