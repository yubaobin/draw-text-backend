import { URL } from 'url'
/**
 * 判断是否对象
 * @param obj 
 * @returns 
 */
export const isObject = (obj: any) => {
    return Object.is(Object.prototype.toString.call(obj), '[object Object]')
}

/**
 * 获取url中的参数
 * @param urlPath 
 * @param key 
 * @returns 
 */
export const getUrlQuery = (urlPath: string, key: string): string | null => {
    const url = new URL(urlPath, 'https://www.')
    const params = new URLSearchParams(url.search.substring(1))
    return params.get(key)
}
