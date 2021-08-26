import React, { useState } from 'react';
import {Button} from '@chakra-ui/react'
import {useHistory} from 'react-router-dom';

const IGOScreen = (props) => {
  let history = useHistory();
  return (
    <div>
      <p>Here is grand new land</p>
      <Button onClick={() => {history.push('/igo/syncBtc')}}>SyncBtc</Button>
    </div>
  )
}
export default IGOScreen
