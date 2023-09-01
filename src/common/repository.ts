import { ModelSchema as ModelSchemaAbstract } from '../lib/repository-memory/index.js'

export class ModelSchema<T extends object = any> extends ModelSchemaAbstract<T> {
    constructor(name: string) {
        super(name)
    }
}