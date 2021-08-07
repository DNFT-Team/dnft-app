import React from 'react';
import comHead from './dnft_head.png';
import comSoon from './coming_soon.gif';
const SoonModal = (props) => (
  <div style={{
    zIndex: 888,
    background: 'radial-gradient(rgba(0,0,0,0.9),transparent 70%,transparent 80%, transparent)',
    position: 'fixed',
    top: '64px',
    bottom: 0,
    left: '240px',
    right: 0,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }}>
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexFlow: 'column nowrap',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <img src={comHead} alt="DNFT" style={{
        width: '7%',
        height: '4%',
        minWidth: '82px',
        minHeight: '37px'
      }}/>
      <img src={comSoon} alt="Coming Soon" style={{
        width: '20%',
        height: '6%',
        minWidth: '342px',
        minHeight: '75px',
        margin: '4rem 0'
      }}/>
      <p style={{
        fontFamily: 'Poppins',
        fontWeight: 'bold',
        fontSize: '40px',
        lineHeight: '20px',
        textAlign: 'center',
        letterSpacing: '-0.015em',
        color: '#60EADA'
      }}>Coming Soon</p>
    </div>
  </div>
)
export default SoonModal
