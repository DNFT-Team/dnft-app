import React from 'react';
import { css } from 'emotion';
import helper from '../../config/helper';
import { Link, Flex } from '@chakra-ui/react';
import { Icon } from '@iconify/react';

const Title = (props) => {
  const { title, linkHelper } = props;
  return (
    <Flex marginBottom={'20px'} alignItems='center'>
      <span className={headerTitle}>{title}</span>
      {
        linkHelper &&
        <div style={{ fontSize: '.8rem', display: 'flex', alignItems: 'center' }}>
          <Link
            href={linkHelper.youtubeLink}
            isExternal
            className={headerLink}
          >
            <Icon
              icon='logos:youtube-icon'
              fontSize={14}
              style={{ marginRight: '10px' }}
            />{' '}
            {linkHelper.youtubeTitle}
          </Link>
          <Link
            href={linkHelper.bookLink}
            isExternal
            className={headerLink}

          >
            <Icon
              icon='simple-icons:gitbook'
              fontSize={18}
              style={{ marginRight: '10px', color: '#1d90e6' }}
            />
            {linkHelper.bookTitle}
          </Link>
        </div>
      }
    </Flex>
  );
};
export default Title;
const headerTitle = css`
  margin-bottom: 10px;
  font-family: Archivo Black, sans-serif;
  font-style: normal;
  font-weight: normal;
  color: #000000;
  margin-right: 30px;
  font-size: 3rem;
  line-height: 3rem;
  display: flex;
  align-items: center;
  @media (max-width: 900px) {
    font-size: 2rem;
    margin-right: 10px;
    margin-bottom: 0px;
  }
`;
const headerLink = css`
  color: #0057D9!important;
  font-style: italic;
  display: flex;
  align-items: center;
  margin-right: 20px;
  @media (max-width: 900px) {
    margin-right: 10px;
  }
`;
