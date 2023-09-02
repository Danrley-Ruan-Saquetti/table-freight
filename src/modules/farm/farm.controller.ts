import { HeaderController } from '../header/header.controller.js'
import { HeaderModelArgs } from '../header/header.model.js'
import { PlantController } from '../plant/plant.controller.js'
import { PlantModelArgs } from '../plant/plant.model.js'
import { Farm } from './farm.model.js'
import {
    FarmRepository,
    FarmCreateArgs,
    FarmCreateManyArgs,
    FarmDeleteArgs,
    FarmDeleteManyArgs,
    FarmFindFirstArgs,
    FarmFindIndexArgs,
    FarmFindManyArgs,
    FarmFindManyIndexArgs,
    FarmUpdateArgs,
    FarmUpdateManyArgs,
} from './farm.repository.js'

export class FarmController {
    private readonly repository: FarmRepository
    private readonly plantController: PlantController
    private readonly headerController: HeaderController

    constructor() {
        this.repository = new FarmRepository()
        this.plantController = new PlantController()
        this.headerController = new HeaderController()
    }

    // Use Case
    createFarm(plants: (Omit<PlantModelArgs, 'farmId'> & { headers: Omit<HeaderModelArgs, 'tableId'>[] })[]) {
        const farm = this.create({ data: {} })

        const a = plants.map(plantArg => {
            this.plantController.createPlant({ ...plantArg, farmId: farm.id })
        })

        return farm
    }

    // Repository
    create(args: FarmCreateArgs) {
        return Farm.instance(this.repository.create(args))
    }

    createMany(args: FarmCreateManyArgs) {
        return this.repository.createMany(args).map(farm => Farm.instance(farm))
    }

    update(args: FarmUpdateArgs) {
        this.repository.update(args)
    }

    updateMany(args: FarmUpdateManyArgs) {
        this.repository.updateMany(args)
    }

    delete(args: FarmDeleteArgs) {
        this.repository.delete(args)
    }

    deleteMany(args: FarmDeleteManyArgs) {
        this.repository.deleteMany(args)
    }

    findMany(args: FarmFindManyArgs) {
        return this.repository.findMany(args).map(farm => Farm.instance(farm))
    }

    findFirstIncludeTables(args: FarmFindFirstArgs) {
        const farm = this.findFirst(args)

        if (!farm) { return null }

        return { ...farm, tables: this.plantController.findManyIncludeHeaders({ where: { farmId: { equals: farm.id } } }) }
    }

    findFirst(args: FarmFindFirstArgs) {
        const farm = this.repository.findFirst(args)

        return !farm ? farm : Farm.instance(farm)
    }

    findIndex(args: FarmFindIndexArgs) {
        return this.repository.findIndex(args)
    }

    findManyIndex(args: FarmFindManyIndexArgs) {
        return this.repository.findManyIndex(args)
    }
}
