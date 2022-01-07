import React from 'react';
import { css } from 'emotion';
import helper from '../../config/helper';
import { Link, Flex, Box, Text } from '@chakra-ui/react';
import { Icon } from '@iconify/react';

const Title = (props) => {
  const { title, linkHelper } = props;
  return (
    <Flex marginBottom={'20px'} alignItems='center'>
      <Box fontSize={['2rem', '2rem', '2rem', '3rem']} mb={[0, 0, 0, '10px']} mr={['10px', '10px', '10px', '30px']} className={headerTitle}>{title}</Box>
      {
        linkHelper &&
        <div style={{ fontSize: '.8rem', display: 'flex', alignItems: 'center' }}>
          <Link
            href={linkHelper.youtubeLink}
            isExternal
            className={headerLink}
            mr={['10px', '10px', '10px', '20px']}
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
  font-family: Archivo Black, sans-serif;
  font-style: normal;
  font-weight: normal;
  color: #000000;
  line-height: 3rem;
  display: flex;
  align-items: center;
`;
const headerLink = css`
  color: #0057D9!important;
  font-style: italic;
  display: flex;
  align-items: center;
`;
