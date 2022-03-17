import React, { useEffect, useState, useCallback } from 'react'
import { css } from 'emotion'
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { SimpleGrid, AspectRatio } from '@chakra-ui/react'
import CountDown from 'components/CountDown'
import { get } from 'utils/request'
import { toDecimal } from 'utils/web3Tools'
import { getImgLink } from 'utils/tools'
import { InstanceAuction721 } from 'constant/abi'
import busd_unit from 'images/market/busd.svg'
import dnft_unit from 'images/market/dnft_unit.png'


const AcutionCard =  (props) => {
  const {item, onHistory, onBid, onCheckout, tokenPrice, address} = props
  const {BUSD: busdPrice, DNFT: dnfPrice} = tokenPrice
  const { nft, auction } = item
  const endDuration = Math.max(auction.auctionLastTime, auction.startTime) * 1 + auction.durationTime * 1 - Math.round(new Date().getTime() / 1000)
  const unit = +auction.payMod === 0 ? 'DNF' : 'BUSD';

  const [lastUpdate, setUpdate] = useState(0)
  const [isFetching, setFetching] = useState(false)
  const [isJoined, setJoin] = useState(false)
  const [isClaimed, setClaim] = useState(false)
  const [stopFlag, setStop] = useState(false)
  const [stateVar, setVars] = useState({
    isStart: Date.now() > auction.startTime,
    isEnded: auction?.status > 1,
    minimum: toDecimal((Math.max(auction.auctionLastBid, auction.startingPrice) + auction.bidIncrement * 1).toString()),
  })

  const checkStatus = useCallback(async() => {
    console.log(`Prev-State${auction.lotId} | isJoined:${isJoined}|isClaimed:${isClaimed}`)
    setUpdate(Date.now())
    if (isFetching || isClaimed || stopFlag) {
      return
    }
    setFetching(true)
    try {
      if (window.ethterum) {
        setJoin(false)
        setClaim(false)
      } else {
        const contract = InstanceAuction721()
        const {lotId} = auction
        const bidInfo =  await contract.methods['getBidInfo'](lotId, address).call()
        // console.log(`bifInfo:${lotId}`, bidInfo)
				const knockedInfo = await contract.methods['getKnockedInfo'](lotId).call()
        // console.log(`knockedInfo:${lotId}`,knockedInfo)
        let _isClaim = false
        if (address === auction.address) { // consignorClaimed
          !isJoined && setJoin(true)
          _isClaim = !!knockedInfo?.[1]
          setClaim(_isClaim)
          setStop(_isClaim)
        } else if (bidInfo?.[3]) {  //  isWinner
          !isJoined && setJoin(true)
          _isClaim = !!knockedInfo?.[2]
          setClaim(_isClaim)
          setStop(_isClaim)
        } else if (bidInfo?.[1] > 0) { // buyer
          !isJoined && setJoin(true)
          _isClaim = !!bidInfo?.[2]
          setClaim(_isClaim)
          setStop(_isClaim)
        } else {
          setJoin(false)
          setClaim(false)
          setStop(true)
        }
        console.log(`Next-State${auction.lotId} | isJoined:${isJoined}|isClaimed:${isClaimed}`)
      }
    } catch {
      setJoin(false)
      setClaim(false)
    } finally {
      setFetching(false)
    }
  }, [isFetching, isJoined, isClaimed, stopFlag, address, stateVar])

  const updateItem = useCallback(async () => {
      console.log('stateVar', stateVar)
      setUpdate(Date.now())
      if (isFetching || stateVar.isEnded) {return}
      setFetching(true)
      try {
        const _res = await get(`/api/v1/auction/detail/${auction.lotId}`)
        console.log('_res', _res?.data?.data?.data)
        if (_res.status === 200) {
          const { auction } = _res?.data?.data?.data
          setVars({
            isStart: Date.now() > auction.startTime,
            isEnded: auction?.status > 1,
            minimum: toDecimal((Math.max(auction.auctionLastBid, auction.startingPrice) + auction.bidIncrement * 1).toString()),
          })
        }
      } catch (err) {
        console.log(err)
      } finally {
        setFetching(false)
      }
  }, [isFetching, isJoined, isClaimed, stopFlag, stateVar])

  useEffect(() => {
    console.log(`Time:${lastUpdate}|stopFlag:${stopFlag}`);
    if (stateVar.isEnded) {
      if (address && !stopFlag) {
        const timer = setTimeout(checkStatus, 10 * 1_000)
        return () => clearTimeout(timer)
      }
    } else {
        const timer2 = setTimeout(updateItem,  60 * 1_000)
        return () => clearTimeout(timer2)
    }
  }, [lastUpdate, address, stopFlag, stateVar])

  return (
    <SimpleGrid
      key={auction.lotId}
      className={styleItem}
      columns={[1, 1, 1, 1, 2]}
      width={['100%', '100%', '100%', '80%', '80%']}
      spacingX="40px"
      spacingY="20px"
    >
      <AspectRatio className="cover" ratio={3 / 4} maxWidth="400px">
        <img src={getImgLink(nft?.avatorUrl)} alt="" />
      </AspectRatio>
      <div className="content">
        <section>
          <h2>
            <span>{nft?.name}</span>
          </h2>
          <p>{nft?.description}</p>
        </section>
        {stateVar.isEnded ? (
          <div className="auctionEnded" cornertxt={isClaimed ? 'Claimed' : 'Auction End'}>
            <h3>Auction Ended</h3>
            <p>
              You are able to check the result of the auction by clicking the ”Checkout“ button,
              which means the participants of the auction can claim their invalid bid or the NFT.
            </p>
            <div>
              {
                isJoined && !isClaimed &&
                  <div
                    className="button success"
                    onClick={() => {onCheckout(item)}}
                  >Checkout</div>
              }
              <div
                className="button outline"
                onClick={() => {onHistory(item)}}
              >Bid History</div>
            </div>
          </div>
        ) : (
          <div>
            <div className="auctionInfo">
              <div className="left">
                <h4>Minimum Bid</h4>
                <strong>
                  <img src={unit === 'DNF' ? dnft_unit : busd_unit} />
                  <span>{`${Number(stateVar.minimum).toFixed(4)} ${unit}`}</span>
                </strong>
                <p className="subText">
                  ≈ ${Number(stateVar.minimum * (unit === 'DNF' ? dnfPrice : busdPrice)).toFixed(4)}
                </p>
              </div>
              <div className="right">
                <h4>Time Left</h4>
                <CountDown time={endDuration} key={auction?.lotId} />
              </div>
            </div>
            {
              stateVar.isStart ? (
                <div>
                  <div
                    className="button primary"
                    onClick={() => {onBid(item)}}
                  >Place Bid</div>
                  <div
                    className="button outline"
                    onClick={() => {onHistory(item)}}
                  >Bid History</div>
                </div>
              ) : (
                <div>Not started</div>
              )
            }
          </div>
        )}
      </div>
    </SimpleGrid>
  )
}

const styleItem = css`
	align-items: flex-start;
	justify-content: center;
	margin: 4vh auto 8vh;
	.cover {
		width: 100%;
		height: 100%;
		margin: 0 auto;
		border-radius: 20px;
		overflow: hidden;
		box-shadow: 0 0 16px 4px rgba(49, 78, 120, 0.8), 0 0 20px 1px rgba(255, 255, 255, 0.8);
	}
	.content {
		margin-top: 2rem;
		width: 100%;
		box-sizing: border-box;
		background: rgba(255, 255, 255, 0.2);
		border-radius: 20px;
		padding: 30px;
		position: relative;
		overflow: hidden;
		section {
			h2 {
				font-family: Archivo Black;
				font-size: 36px;
				color: #ffffff;
				margin: 0;
				display: flex;
				align-items: center;
				.action {
					height: 24px;
					width: 24px;
					background: rgba(0, 87, 217, 0.2);
					border: 1px solid #0057d9;
					padding: 10px 8px;
					border-radius: 10px;
					cursor: pointer;
					user-select: none;
					margin-left: 1rem;
				}
			}
			p {
				font-family: Barlow;
				font-style: normal;
				font-weight: normal;
				font-size: 14px;
				line-height: 20px;
				color: rgba(255, 255, 255, 0.7);
			}
		}
		.auctionInfo {
			background: #193864;
			border: 1px solid #002a67;
			border-radius: 10px;
			position: relative;
			display: flex;
			flex-direction: row wrap;
			justify-content: space-between;
			align-items: flex-start;
			box-sizing: border-box;
			padding: 15px;
			margin: 1rem 0;
			max-width: 500px;
			.left,
			.right {
				font-family: Barlow;
				font-style: normal;
				height: 100%;
				h4 {
					font-weight: 500;
					font-size: 14px;
					color: rgba(255, 255, 255, 0.5);
				}
				.subText {
					font-weight: 500;
					font-size: 12px;
					text-transform: uppercase;
					color: rgba(255, 255, 255, 0.8);
				}
			}
			.left {
				strong {
					display: flex;
					align-items: center;
					img {
						height: 20px;
						width: 20px;
						margin-right: 10px;
					}
				}
			}
			.right {
				h4 {
					margin-left: 1rem;
				}
			}
		}
		.auctionEnded {
			color: #ffffff;
			font-style: normal;
			font-weight: normal;
			&::after {
				content: attr(cornertxt);
				position: absolute;
				background: #ff2e6c;
				width: max-content;
				padding: 0 40px;
				text-align: center;
				right: 0;
				top: 0;
				transform: rotate(45deg) translate(31%, -15%);
			}
			h3 {
				font-family: Archivo;
				font-weight: 800;
				font-size: 18px;
				color: #ffffff;
				margin-top: 40px;
			}
			p {
				font-family: Barlow;
				font-size: 16px;
				margin: 34px 0 26px 0;
			}
		}
		.button.primary {
			margin-right: 20px;
		}
		.button.outline {
			background: rgba(0, 87, 217, 0.2);
			border: 1px solid #0057d9;
			margin-top: 20px;
		}
		.button.success {
			margin-right: 20px;
			background: #45b36b;
		}
	}
`

const mapStateToProps = ({ profile, home }) => ({
	address: profile.address,
	chainType: profile.chainType,
	net_env: profile.net_env,
	token: profile.token,
	tokenPrice: home.tokenPrice,
})

export default withRouter(connect(mapStateToProps)(AcutionCard))
