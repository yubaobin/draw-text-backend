import fs from 'fs'
/**
 * 检测文件夹
 * @param path 
 */
 export function checkFolder (path: string): Promise<any> {
    return new Promise((resolve: any, reject: any) => {
        try {
            const stat = fs.statSync(path)
            if (stat.isDirectory()) {
                resolve()
            } else {
                fs.mkdir(path, function (err) {
                    if (err) {
                        reject(err)
                    } else {
                        resolve()
                    }
                })
            }
        } catch (e) {
            fs.mkdir(path, function (err) {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        }
    })
}

/**
 * 删除文件
 */
export function deleteFile (filepath: string) {
    return new Promise((resolve: any, reject: any) => {
        fs.unlink(filepath, function (err: Error | null) {
            if (err) {
                reject(err)
            } else {
                resolve
            }
        })
    })
}

/**
 * 文件后嘴
 * @param name 
 */
export function getFileSuffix (name: string): string {
    if (!name) return ''
    const index: number = name.lastIndexOf('.')
    return name.substring(index)
}

/**
 * 获取文件conente-type
 * @param filename 
 * @returns 
 */
 export function getContentType (filename: string): string {
    const suffix = getFileSuffix(filename)
    let contentType: string = ''
    switch (suffix) {
        case '.jpg':
        case '.jpeg':
        case '.jfif':
        case '.jpe':
            contentType = 'image/jpeg'
            break
        case '.png':
            contentType = 'image/png'
            break
        case '.svg':
            contentType = 'image/svg+xml'
            break
        case '.tiff':
        case '.tif':
            contentType = 'image/tiff'
            break
        case '.gif':
            contentType = 'image/gif'
            break
        case '.ico':
            contentType = 'image/x-ico'
            break
        case '.wbmp':
            contentType = 'image/vnd.wap.wbmp'
            break
        case '.fax':
            contentType = 'image/fax'
            break
        case '.net':
            contentType = 'image/pnetvue'
            break
        case '.rp':
            contentType = 'image/vnd.rn-realpix'
            break
        default:
            contentType = 'application/octet-stream'
            break
    }
    return contentType
}
