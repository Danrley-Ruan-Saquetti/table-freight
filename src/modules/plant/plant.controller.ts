import { HeaderController } from '../header/header.controller.js'
import { HeaderModelArgs } from '../header/header.model.js'
import { Plant, PlantModelArgs } from './plant.model.js'
import {
    PlantRepository,
    PlantCreateArgs,
    PlantCreateManyArgs,
    PlantDeleteArgs,
    PlantDeleteManyArgs,
    PlantFindFirstArgs,
    PlantFindIndexArgs,
    PlantFindManyArgs,
    PlantFindManyIndexArgs,
    PlantUpdateArgs,
    PlantUpdateManyArgs,
} from './plant.repository.js'

export class PlantController {
    private readonly repository: PlantRepository
    private readonly headerController: HeaderController

    constructor() {
        this.repository = new PlantRepository()
        this.headerController = new HeaderController()
    }

    // Use Case
    createPlant({ farmId, name, table, type, headers }: PlantModelArgs & { headers: Omit<HeaderModelArgs, 'tableId'>[] }) {
        const plant = this.create({ data: { farmId, name, table, type } })

        this.headerController.createMany({
            data: headers.map(header => ({ ...header, tableId: plant.id }))
        })

        return plant
    }

    // Repository
    create(args: PlantCreateArgs) {
        return Plant.instance(this.repository.create(args))
    }

    createMany(args: PlantCreateManyArgs) {
        return this.repository.createMany(args).map(plant => Plant.instance(plant))
    }

    update(args: PlantUpdateArgs) {
        this.repository.update(args)
    }

    updateMany(args: PlantUpdateManyArgs) {
        this.repository.updateMany(args)
    }

    delete(args: PlantDeleteArgs) {
        this.repository.delete(args)
    }

    deleteMany(args: PlantDeleteManyArgs) {
        this.repository.deleteMany(args)
    }

    findMany(args: PlantFindManyArgs) {
        return this.repository.findMany(args).map(plant => Plant.instance(plant))
    }

    findManyIncludeHeaders(args: PlantFindManyArgs) {
        return this.repository.findMany(args).map(plant => ({ ...plant, headers: this.headerController.findMany({ where: { tableId: { equals: plant.id } } }) }))
    }

    findBydIds(ids: number[]) {
        return this.repository.findBydIds(ids).map(plant => Plant.instance(plant))
    }

    findFirst(args: PlantFindFirstArgs) {
        const plant = this.repository.findFirst(args)

        return !plant ? plant : Plant.instance(plant)
    }

    findFirstIncludeHeaders(args: PlantFindFirstArgs) {
        const plant = this.repository.findFirst(args)

        if (!plant) { return null }

        return { ...plant, headers: this.headerController.findMany({ where: { tableId: { equals: plant.id } } }) }
    }

    findIndex(args: PlantFindIndexArgs) {
        return this.repository.findIndex(args)
    }

    findManyIndex(args: PlantFindManyIndexArgs) {
        return this.repository.findManyIndex(args)
    }
}
