import request from '@/utils/request';
import {stringify} from 'qs';
export async function getType(payload) {
    return request(`http://api.nftable.org/type?${stringify(payload)}`);
}
export async function getProduct(payload) {
    return request(`http://api.nftable.org/project?${stringify(payload)}`);
}
export async function getProductSearch(payload) {
    return request(`http://api.nftable.org/search?${stringify(payload)}`);
}