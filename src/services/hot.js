import request from '@/utils/request';
export async function getHotIsUpsRank(sort_type) {
    return request(`https://dncapi.bqrank.net/api/v2/coin/maxchange?isup=1&filtertype=0&sort_type=${sort_type}&webp=1`);
}
export async function getHotIsDownsRank(sort_type) {
    return request(`https://dncapi.bqrank.net/api/v2/coin/maxchange?isup=0&filtertype=0&sort_type=${sort_type}&webp=1`);
}
export async function getHotCoinVolRank(sort_type) {
    return request(` https://dncapi.bqrank.net/api/v2/ranking/coinvol?page=1&per_page=10&sort=${sort_type}&webp=1`);
}
export async function getHotTurnoverRank() {
    return request(`https://dncapi.bqrank.net/api/v2/ranking/turnover?pagesize=10&webp=1`);
}
