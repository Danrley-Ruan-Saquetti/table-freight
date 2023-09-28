export class FileController {
    createFile({ content, type = 'text/csv', charset = 'ISO-8859-1' }: { content: BlobPart[]; charset?: string; type?: string }) {
        return new Blob(content, {
            type: `${type};charset=${charset};`,
        })
    }

    createObjectURL(obj: Blob | MediaSource) {
        return URL.createObjectURL(obj)
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
