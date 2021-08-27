import React from 'react';
import { useHistory } from 'react-router-dom';
import { css } from 'emotion';
import { Button, Box, Grid, GridItem } from '@chakra-ui/react';
import { toast } from 'react-toastify';

const IGOScreen = (props) => {
  let history = useHistory();

  const gameList = [
    { title: 'SyncBtc', description: 'Get Nft while syncing the tokens', avatarUrl: '', skipTo: '/igo/syncBtc', start_at: '', end_at: '' },
    { title: 'Gamify-Age', description: 'Bunch of games are on their way, keep watching.', avatarUrl: '', start_at: '', end_at: '' }
  ]

  const handlePlay = (item) => {
    if (item.skipTo) {
      history.push(item.skipTo)
    } else {
      toast('Coming soon!', {position: toast.POSITION.TOP_CENTER})
    }
  }

  return (
    <div className={styleIgo}>
      <h3>Game List</h3>
      <p className="describe">
        <strong>Gamify</strong>
        to adapt (a task) so that it takes on the form of a game
      </p>
      <Grid className="cardList"  gap={10} height="max-content"  templateColumns="repeat(10, 1fr)">
        {
          gameList.map((g) => (
            <GridItem colSpan={[10, 10, 10, 5, 5]}>
              <Box className="cardBox" bg="brand.100" p=".8rem">
                <div className="avatar">{g.avatarUrl}</div>
                <h4>{g.title}</h4>
                <p>{g.description}</p>
                <Button colorScheme="custom" onClick={() => {handlePlay(g)}}>Play</Button>
              </Box>
            </GridItem>
          ))
        }
      </Grid>
      <p className="describe">We do not own your private keys and cannot access your funds without your confirmation.</p>
    </div>
  )
}
export default IGOScreen

const styleIgo = css`
  margin: 1.357rem;
  border-radius: 1.429rem;
  min-height: 50vh;
  text-align: center;
  background: #FFFFFF;
  padding: 6.42rem 0;
  h3 {
    color: rgba(35, 38, 47, 1);
    font-family: DM Sans, sans-serif;
    font-weight: bold;
    font-size: 3.429rem;
    line-height: 4rem;
    letter-spacing: .2rem;
  }
  .describe {
    width: 100%;
    align-items: center;
    text-align: center;
    color: rgba(119, 126, 144, 1);
    font-family: Poppins, sans-serif;
    font-size: 1rem;
    line-height: 1.714rem;
    box-sizing: border-box;
    strong{
      color: rgba(35, 38, 47, 1);
      margin: 0 .4rem;
    }
  }
  .cardList{
    padding: 1.5rem 0;
    box-sizing: border-box;
    width: 80%;
    margin: 5.357rem auto;
    .cardBox{
      border-radius: 1.429rem;
      width: 100%;
      .avatar{
        border-radius: 1.429rem;
        background: #2C386F;
        width: 100%;
        height: 10rem;
      }
    }
  }
`
