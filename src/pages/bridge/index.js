import React, { useState, useEffect } from 'react';
import { Button } from 'ui-neumorphism';
import {
  Grid, GridItem, Box,
  Heading, Text,
  Input, InputGroup, InputLeftElement, InputRightAddon
} from '@chakra-ui/react';
import styles from './index.less';
import bgWindow from '../../images/bridge/bg_window.png';
import { curveArrow } from '../../utils/svg';

/* Available network*/
const NetOptions = [
  {key: 'eth', name: 'ETH', icon: '', netId: '', },
  {key: 'bsc', name: 'BSC', icon: '', netId: '', },
  {key: 'heco', name: 'HECO', icon: '', netId: '', },
  // {key: 'polka', name: 'POLKA', icon: '', netId: '', },
]

const BridgeScreen = (props) => {
  //  global loading
  const [loading, setLoading] = useState(false)
  //  networks
  const [frNet, setFrNet] = useState(0)
  const [toNet, setToNet] = useState(1)
  //  form - input
  const [amount, setAmount] = useState('')
  const [balance, setBalance] = useState(5)

  //  render Dom
  return (
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
                <GridItem colSpan={1}>&nbsp;</GridItem>
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
              <Box bg="white" height="100%" borderRadius='.8rem' p='1rem' boxSizing='border-box'>
                <div>
                  <InputGroup>
                    <InputLeftElement color="brand.600">
                      <div className={styles.tokenType}>DNF</div>
                    </InputLeftElement>
                    <Input
                      is-full-width="true"
                      focusBorderColor="brand.600"
                      borderColor="brand.300"
                      placeholder="Amount"
                      autoFocus
                      style={{textIndent: '1rem'}}
                      _hover={{borderColor: 'inherit'}}
                      value={amount}  onChange={(v) => {setAmount(v.target.value)}}
                    />
                    <InputRightAddon>{
                      NetOptions[frNet].name
                    }</InputRightAddon>
                  </InputGroup>
                  <Text size="sm" color="brand.100">Available balance : ${balance} DNF</Text>
                </div>
                <div style={{margin: '3rem 0'}}>
                  Here put A switchIcon, position right
                </div>
                <div>
                  <InputGroup>
                    <InputLeftElement color="brand.600">
                      <div className={styles.tokenType}>DNF</div>
                    </InputLeftElement>
                    <Input
                      is-full-width="true"
                      focusBorderColor="brand.600"
                      borderColor="brand.300"
                      placeholder="Received"
                      isReadOnly
                      style={{textIndent: '1rem'}}
                      _hover={{borderColor: 'inherit'}}
                      value={amount}
                    />
                    <InputRightAddon>BSC</InputRightAddon>
                  </InputGroup>
                  <Text size="sm" color="brand.100">By now,You will received 100% DNF</Text>
                </div>
                <div style={{margin: '1rem 0'}}>
                  <Button onClick={() => {setAmount('')}}>Confirm</Button>
                  <Button>History</Button>
                </div>
              </Box>
            </GridItem>
          )}
        </Grid>
      </div>
    </div>
  )
}

export default BridgeScreen;
