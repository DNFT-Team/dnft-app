import React, { useState, useEffect } from 'react';
import styles from './index.less';
import {TextField } from 'ui-neumorphism';
import bgWindow from '../../images/bridge/bg_window.png'
import {curveArrow} from '../../utils/svg'
import {Grid, GridItem, Heading, Text} from '@chakra-ui/react'
// 892/1630

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
          <GridItem colSpan={[10, 10, 10, 4]} p={['1.785rem', '1.785rem', '3.785rem']} color="white">
            <div>
              <Heading as="h4" className={styles.title}>Bridge</Heading>
              <Text color="brand.100" className={styles.subTitle} isTruncated>Cross the DNF from chain to chain</Text>
              <Grid
                gap={4}
                templateColumns="repeat(5, 1fr)"
              >
                <GridItem colSpan={2}>
                  <div className={styles.winDL}>
                    <img src={bgWindow} alt=""/>
                    <div className={styles.winDLArrow}>{curveArrow('1')}</div>
                  </div>
                </GridItem>
                <GridItem colSpan={1}> </GridItem>
                <GridItem colSpan={2} >
                  <div className={styles.winDR}>
                    <img src={bgWindow} alt=""/>
                    <div className={styles.winDRArrow}>{curveArrow('2')}</div>
                  </div>
                </GridItem>
              </Grid>
            </div>
          </GridItem>
          <GridItem colSpan={[10, 10, 10, 6]}>
            <TextField placeholder="amount" />
            <TextField placeholder="accept" />
          </GridItem>
        </Grid>
      </div>
    </div>
  )

export default BridgeScreen;
