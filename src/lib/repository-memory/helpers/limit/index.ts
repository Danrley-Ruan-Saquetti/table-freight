import { Types } from '../index.js'

export function limitDocumentsResult<M extends Types.DocumentDefaultArgs>(documents: Types.Document<M>[], limit: Types.LimitArgs) {
    return documents.splice(0, limit)
}
