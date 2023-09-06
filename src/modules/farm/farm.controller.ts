import { HeaderController } from '../header/header.controller.js'
import { HeaderModelArgs } from '../header/header.model.js'
import { PlantController } from '../plant/plant.controller.js'
import { PlantModelArgs } from '../plant/plant.model.js'
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
import { FarmService } from './farm.service.js'
import { FarmModelArgs } from './farm.model.js'
import { EnumProcess, ProcessInstance } from './process/index.js'
import { ProcessController } from '../process/process.controller.js'

export class FarmController {
    private readonly repository: FarmRepository
    private readonly plantController: PlantController
    private readonly headerController: HeaderController
    private readonly processController: ProcessController

    constructor() {
        this.repository = new FarmRepository()
        this.plantController = new PlantController()
        this.headerController = new HeaderController()
        this.processController = new ProcessController()
    }

    // Use Case
    createFarm({
        plants = [],
        name,
        process = [],
    }: FarmModelArgs & {
        plants?: (Omit<PlantModelArgs, 'farmId'> & { headers: Omit<HeaderModelArgs, 'tableId'>[] })[]
        process?: { type: EnumProcess; params?: any[] }[]
    }) {
        const farm = this.create({ data: { name } })
        const farmService = new FarmService(farm.id)

        farmService.insertPlant(...plants)
        farmService.insertProcess(...process)

        return farmService
    }

    getFarm(farmId: number) {
        const farm = this.findFirst({ where: { id: { equals: farmId } } })

        if (!farm) {
            throw new Error('Farm not found')
        }

        return new FarmService(farm.id)
    }

    // Repository
    create(args: FarmCreateArgs) {
        return this.repository.create(args)
    }

    createMany(args: FarmCreateManyArgs) {
        return this.repository.createMany(args)
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
        return this.repository.findMany(args)
    }

    findFirst(args: FarmFindFirstArgs) {
        const farm = this.repository.findFirst(args)

        return farm
    }

    findIndex(args: FarmFindIndexArgs) {
        return this.repository.findIndex(args)
    }

    findManyIndex(args: FarmFindManyIndexArgs) {
        return this.repository.findManyIndex(args)
    }
}
