import React, { useState, useMemo } from 'react'
import { css } from 'emotion'
import { getImgLink } from 'utils/tools'

import PlayIcon from 'images/common/play.svg'
import BackIcon from 'images/common/back.svg'

const Meta = (props) => {
  const {
    hideTrigger = false, // Hide the picture-video toggle button
    auto = false, //  Switch directly to video
    autoPlay = false  //  Does the video play automatically
  } = props
  const { animationUrl, avatorUrl, fileType } = props.data
  const [show, setShow] = useState(auto)

  const ImgWrapper = useMemo(() => (
    <img className={imgStyle} src={getImgLink(avatorUrl)} alt="" draggable="false" />
  ), [avatorUrl])

  const triggerVideo = (e) => {
    e?.preventDefault()
    e?.stopPropagation()
    e.nativeEvent?.stopImmediatePropagation()
    animationUrl && setShow(!show)
  }

  if (
    !animationUrl ||
    !fileType ||
    fileType?.includes('image')
  ) {
    return ImgWrapper
  }

  if (
    !!animationUrl ||
    fileType?.includes('video') ||
    fileType?.includes('audio')
  ) {
    return (
      <div className={videoBoxStyle}>
        {
          show
          ? <video className={videoStyle} src={getImgLink(animationUrl)} controls autoPlay={autoPlay} />
          : ImgWrapper
        }
        {
          !!animationUrl && !hideTrigger && !show &&
          (<div title="Play" className={playBtn} onClick={triggerVideo} />)
        }
        {
          !hideTrigger && show &&
          (<div title="Back" className={backBtn} onClick={triggerVideo} />)
        }
      </div>
    )
  }

  return <div>No Assets</div>
}
export default Meta

const imgStyle = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  position: absolute;
`
const videoStyle = css`
  width: 100%;
  height: 100%;
  object-fit: cover;
  background-color: #f7f7f7;
`
const videoBoxStyle = css`
width: 100%;
height: 100%;
position: absolute;
`
const playBtn = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  border-radius: 100%;
  cursor: pointer;
  transition: all .3s ease;
  background-color: rgba(0,57,141,0.6);
  background-image: url('${PlayIcon}');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  padding: 48px;
  &:hover{
    background-color: rgba(0,57,141,0.8);
    transform: translate(-50%,-50%) scale(1.2);
  }
`
const backBtn = css`
  position: absolute;
  top: 24px;
  left: 24px;
  border-radius: 100%;
  cursor: pointer;
  transition: all .3s ease;
  background-color: rgba(0,57,141,0.6);
  background-image: url('${BackIcon}');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  padding: 24px;
  opacity: 0.8;
  &:hover{
    background-color: rgba(0,57,141,0.8);
    transform: scale(1.2);
    opacity: 1;
  }
`

