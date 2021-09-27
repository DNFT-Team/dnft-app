import React from 'react';
import { useHistory } from 'react-router-dom';
import './style.css';
import layer2 from 'images/gallery/img_93719_0_1.png'

const GalleryScreen = (props) => {
  let history = useHistory();
  return (
    <div className="gallery">
      <span className="nft-gallery">NFT Gallery</span>
      <span className="article">
            With the rapid development of digital technology, the tools and media used for art expression are also
            changing in the direction of digitization. NFT's artworks can now be exhibited in a special exhibition
            gallery.
      </span>
      <div className="wrapper-inner-4">
        <div className="group-7" style={{backgroundImage: `url("${layer2}")`}} />
        <span className="nft-gallery-1">NFT Gallery</span>
        <span className="info">Enter and Find Your Perfect Artwork.</span>
        <div className="enter-wrapper" onClick={() => {
          history.push('/gallery/unityView')
        }}>
          <span className="enter">Enter</span>
        </div>
      </div>
      <span className="summary">
            We do not own your private keys and cannot access your funds without your confirmation.
      </span>
    </div>
  );
};

export default GalleryScreen;
