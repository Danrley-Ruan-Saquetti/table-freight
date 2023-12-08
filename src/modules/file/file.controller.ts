export class FileController {
    createFile({ content, type = 'text/csv', charset = 'ISO-8859-1' }: { content: BlobPart[]; charset?: string; type?: string }) {
        return new Blob(content, {
            type: `${type};charset=${charset};`,
        })
    }

    createObjectURL(obj: Blob | MediaSource) {
        return URL.createObjectURL(obj)
    }

    async getContentFile(file: Blob): Promise<string> {
        return new Promise((resolve, error) => {
            if (!file) {
                return { error: { msg: 'File not defined' } }
            }

            const reader = new FileReader()

            reader.readAsText(file, 'ISO-8859-1')

            // @ts-expect-error
            reader.onload = ({ target: { result } }) => {
                resolve(result as string)
            }
            reader.onerror =
                onerror ||
                function (err) {
                    error(err)
                }
        })
    }

    async createURLDownloadZip(files: { file: Blob; name: string }[]) {
        const zip = this.createFileZip(files)

        const url = await zip.generateAsync({ type: 'blob' }).then((zipBlob: Blob) => {
            const url = this.createObjectURL(zipBlob)

            return url
        })

        return url as string
    }

    createFileZip(files: { file: Blob; name: string }[]) {
        const zip = new JSZip()

        files.forEach(({ file, name }) => {
            zip.file(`${name}`, file)
        })

        return zip
    }
}
