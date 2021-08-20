import React, { useState, useEffect } from 'react';
import styles from './index.less';
import {TextField, Button } from 'ui-neumorphism';
import bgWindow from '../../images/bridge/bg_window.png'
import {curveArrow} from '../../utils/svg'
import {Grid, GridItem, Box, Heading, Text} from '@chakra-ui/react'

const BridgeScreen = (props) =>
  //  render Dom
  (
    <div className="d-fullWidth">
      <div className={styles.main}>
        <Grid
          gap={4}
          h="497px"
          bg="brand.900"
          templateColumns="repeat(10, 1fr)"
        >
          {(

            /* Banner Left/Top */
            <GridItem colSpan={[10, 10, 10, 5, 4]} p={['1.785rem', '1.785rem', '1.785rem', '2rem', '3.785rem']} color="white">
              <Heading as="h4" className={styles.title}>Bridge</Heading>
              <Text color="brand.100" className={styles.subTitle} isTruncated>
                Swift, easy and reliable solution to cross your DNF over chains
              </Text>
              <Grid
                gap={4}
                templateColumns="repeat(5, 1fr)"
              >
                <GridItem colSpan={2}>
                  <div className={styles.winDL}>
                    <img src={bgWindow} alt=""/>
                    <div className={styles.winArrow}>{curveArrow('1')}</div>
                  </div>
                </GridItem>
                <GridItem colSpan={1}> </GridItem>
                <GridItem colSpan={2} >
                  <div className={styles.winDR}>
                    <img src={bgWindow} alt=""/>
                    <div className={styles.winArrow}>{curveArrow('2')}</div>
                  </div>
                </GridItem>
              </Grid>
            </GridItem>
          )}
          {(

            /* Cross-Chain Form */
            <GridItem colSpan={[10, 10, 10, 5, 6]} p={['1.785rem', '1.785rem', '1.785rem', '2rem', '3.785rem']} bg="brand.900">
              <Box bg="rgb(227 235 245)" height="100%" borderRadius='.8rem' p='1rem' boxSizing='border-box'>
                <div>
                  <TextField placeholder="amount" />
                  <p>Available balance : 100,000,000 DNF</p>
                </div>
                <div>
                 Here put A switchIcon, position right
                </div>
                <div>
                  <TextField placeholder="accept" />
                  Here needs a Select
                </div>
                <div>
                  <Button>Confirm</Button>
                  <Button>History</Button>
                </div>
              </Box>
            </GridItem>
          )}
        </Grid>
      </div>
    </div>
  )

export default BridgeScreen;
