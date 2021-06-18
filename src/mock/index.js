import Mock from 'mockjs'

const AUCTION_LIST = (size=10)=>{
  return new Array(size).fill(1).map((e,i)=>({
    index: Mock.mock('@integer(100, 300)'),
    name: Mock.mock('@title'),
    desc: Mock.mock('@paragraph'),
    base: Mock.mock('@integer(1, 12)'),
    address: Mock.mock('@guid'),
    owner: Mock.mock('@guid'),
    creator: Mock.mock('@guid'),
    src: `https://unsplash.it/300/280?random=${i}`,
    state: i%2 ===0 ? 'closed' : 'open',
    ddl: i%2 ===0 ? '00:00:00:00' : '01:30:20:29',
    participants: 'Open',
    contract:'0x63bb2056ac993f30808a81e0141c137a229ec1b4',
    token: Mock.mock('@integer(100000, 200000)')
  }))
}

export default {
  getAuction: AUCTION_LIST
}
