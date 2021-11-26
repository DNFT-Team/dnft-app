import React, {useMemo} from 'react';
import { css, cx } from 'emotion';
import { noDataSvg } from 'utils/svg';

const styleNoDataContainer = css`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  flex-direction: column;
  padding: 2rem 0;
  color: #233a7d;
`;
const styleTable = css`
  width: 100%;
  margin: 0 auto;
  thead {
    background: #F7F7F7;
    color: #8F9BBA;
    font-family: SF Pro Display,sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
  }
  th,td{
    text-align: center;
    white-space: pre-wrap;
    overflow: hidden;
    word-break: break-word;
    max-width: 30px;
    padding: 15px;
    &:first-child{
      text-align: left;
    }
    &:last-child{
      text-align: right;
    }
  }
  td{
    font-family: Poppins,sans-serif;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.2px;
    color: #171725;
  }
  .ellipsis{
    text-overflow: ellipsis;
    white-space: nowrap !important;
  }
  .numTd{
    font-family: Roboto,sans-serif;
    font-style: normal;
    font-weight: bold;
    font-size: 16px;
    line-height: 24px;
    letter-spacing: 0.1px;
    color: #FF313C;
  }
`

const TradeTable = (props) => {
  const {data, cols} = props
  const isEmpty = data.length <= 0 || cols.length <= 0
  const renderNoData = useMemo(
    () => (
      <div className={styleNoDataContainer}>
        <div>{noDataSvg}</div>
      </div>
    ),
    []
  );
  return isEmpty ? renderNoData : (
    <table className={styleTable}>
      <thead>
        <tr>
          {cols.map((e, i) => (<th key={'th' + i}>{e.title}</th>))}
        </tr>
      </thead>
      <tbody>
        {data.map((r, ri) => (
          <tr key={'tbTr' + ri}>
            {cols.map((rc, rci) => (
              <td
                key={`td_${ri}_${rci}`}
                className={cx(rc.ellipsis && 'ellipsis', rc.isNum && 'numTd')}
              >{rc.cell ? rc.cell(r[rc.key]) : r[rc.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
export default TradeTable
