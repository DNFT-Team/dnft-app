import React from 'react';
import { useHistory } from 'react-router-dom';
import { css } from 'emotion';
import { Heading, Text, Button, Box, Grid, GridItem } from '@chakra-ui/react';
import { toast } from 'react-toastify';
import ParticlesBg from 'particles-bg';
import comingSoon from 'components/SoonModal/coming_soon.gif';
import igoAvatar from 'images/igo/igoAvatar.png';

const IGOScreen = (props) => {
  let history = useHistory();

  const gameList = [
    { title: 'SyncBtc', description: 'Get NFT while syncing the tokens', avatarUrl: igoAvatar, skipTo: '/igo/syncBtc' },
    { title: 'GameFi-Age', description: 'Bunch of games are on their way', avatarUrl: comingSoon, isComing: true }
  ]

  const handlePlay = (item) => {
    if (!item.isComing && item.skipTo) {
      history.push(item.skipTo)
    } else {
      toast('Coming soon!', {position: toast.POSITION.TOP_CENTER})
    }
  }

  let config = {
    num: [4, 7],
    rps: 0.1,
    radius: [5, 30],
    life: [1.5, 3],
    v: [2, 3],
    tha: [-40, 40],
    alpha: [0.4, 0],
    scale: [.1, 0.4],
    position: 'all',
    color: ['random', '#ff0000'],
    cross: 'dead',
    // emitter: "follow",
    random: 15
  };

  if (Math.random() > 0.85) {
    config = Object.assign(config, {
      onParticleUpdate: (ctx, particle) => {
        ctx.beginPath();
        ctx.rect(
          particle.p.x,
          particle.p.y,
          particle.radius * 2,
          particle.radius * 2
        );
        ctx.fillStyle = particle.color;
        ctx.fill();
        ctx.closePath();
      }
    });
  }

  return (
    <div className={styleIgo}>
      <div className="content">
        <Heading as="h3"  fontSize={['1.8rem', '2.6rem', '3rem', '3rem', '3.429rem']}>IGO</Heading>
        <Text className="describe" fontSize={['.6rem', '.8rem', '.8rem', '1rem', '1.2rem']}>
          <strong>GameFi</strong>
          to have fun in games and earn tokens
        </Text>
        <Grid className="cardList"  gap={10} height="max-content"  templateColumns="repeat(10, 1fr)">
          {
            gameList.map((g) => (
              <GridItem colSpan={[10, 10, 10, 5, 5]}>
                <Box className="cardBox" p=".8rem">
                  <div className={g.isComing ? 'avatar isComing' : 'avatar'} style={{backgroundImage: "url('" + g.avatarUrl + "')"}} />
                  <h4>
                    <strong>{g.title}: </strong>
                    {g.description}
                  </h4>
                  <Button colorScheme="custom" onClick={() => {handlePlay(g)}}
                    p="1.2rem 2.8rem" my="2.1rem"
                    minWidth="10rem" fontWeight="bolder">Play</Button>
                </Box>
              </GridItem>
            ))
          }
        </Grid>
        <p className="describe">Hadouken! Lok-Tar Ogar! Fire in the hole.</p>
      </div>
      <ParticlesBg type="custom" config={config} bg className="particlesBg"/>
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
  position: relative;
  z-index: 0;
  .content{
    min-height: calc(100vh - 30rem);
    display: flex;
    flex-flow: column nowrap;
    justify-content: center;
    align-items: center;
    h3 {
      color: rgba(35, 38, 47, 1);
      font-family: DM Sans, sans-serif;
      font-weight: bold;
      letter-spacing: .2rem;
    }
    .describe {
      width: 100%;
      align-items: center;
      text-align: center;
      color: rgba(119, 126, 144, 1);
      font-family: Poppins, sans-serif;
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
      width: max-content;
      min-width: 60%;
      margin: 5.357rem auto;
      background: transparent;
      .cardBox{
        border-radius: 20px;
        width: 100%;
        border: 2px solid #E6E8EC;
        .avatar{
          border-radius: 1.429rem;
          width: 100%;
          height: 18rem;
          background-size: contain;
          background-position: center;
          background-repeat: no-repeat;
        }
        .isComing{
          background-color: #1B225C;
          background-repeat: repeat;
          background-position: center;
        }
        h4{
          font-family: Poppins, sans-serif;
          font-style: normal;
          font-weight: normal;
          font-size: 1.2rem;
          margin: 1.6rem 0 3rem 0;
          line-height: 1.4rem;
          align-items: center;
          text-align: center;
          color: #1B2559;
        }
      }
    } 
  }
`
