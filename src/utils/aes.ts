import CryptoJS from 'crypto-js'
/**
 * 本项目的密码加密
 * @param {String | Number} key 需要加密的字符串
 */
export const aesEncrypt = (key: string): string => {
	if (key) {
		const salt = 'chinatelecom@web'
		const parsedSalt = CryptoJS.enc.Utf8.parse(salt)
		const password = CryptoJS.enc.Utf8.parse(key)
		const result: string = CryptoJS.AES.encrypt(password, parsedSalt, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		}).toString()
		return result
	} else {
		return ''
	}
}

/**
 * 解密
 * @param {*} encrypted 需要解密字符串
 * @returns 解密后的字符串
 */
export const aesDecrypt = (encrypted: string) => {
	if (encrypted) {
		const salt = 'chinatelecom@web'
		const parsedSalt = CryptoJS.enc.Utf8.parse(salt)
		const result = CryptoJS.AES.decrypt(encrypted, parsedSalt, {
			mode: CryptoJS.mode.ECB,
			padding: CryptoJS.pad.Pkcs7
		})
		return CryptoJS.enc.Utf8.stringify(result).toString()
	} else {
		return ''
	}
}
