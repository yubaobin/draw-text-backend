import { URL } from 'url'
import os from 'os'
/**
 * 判断是否对象
 * @param obj 
 * @returns 
 */
export function isObject (obj: any) {
    return Object.is(Object.prototype.toString.call(obj), '[object Object]')
}

/**
 * 获取url中的参数
 * @param urlPath 
 * @param key 
 * @returns 
 */
export function getUrlQuery (urlPath: string, key: string): string | null {
    const url = new URL(urlPath, 'https://www.')
    const params = new URLSearchParams(url.search.substring(1))
    return params.get(key)
}

/**
 * 获取IP地址
 * @returns 
 */
export function getIpAddress (): string {
    let ifaces = os.networkInterfaces()
    let result: string = 'localhost'
    for (let dev in ifaces) {
        let iface = ifaces[dev]
        if (iface) {
            for (let i = 0; i < iface.length; i++) {
                let { family, address, internal } = iface[i]

                if (family === 'IPv4' && address !== '127.0.0.1' && !internal) {
                    result = address
                }
            }
        }
    }
    return `http://${result}`
}

/**
 * 延时
 * @param time 
 * @returns 
 */
export function delay (time: number = 0) {
    return new Promise((resolve: any) => {
        setTimeout(() => {
            resolve()
        }, time)
    })
}
