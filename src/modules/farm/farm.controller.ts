import { PlantController } from '../plant/plant.controller.js'
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
    FarmFindArgs,
    FarmUpdateArgs,
    FarmUpdateManyArgs,
} from './farm.repository.js'

export class FarmController {
    private readonly repository: FarmRepository
    private readonly plantController: PlantController

    constructor() {
        this.repository = new FarmRepository()
        this.plantController = new PlantController()
    }

    create(args: FarmCreateArgs) {
        return Farm.instanceOf(this.repository.create(args))
    }

    createMany(args: FarmCreateManyArgs) {
        return this.repository.createMany(args).map(farm => Farm.instanceOf(farm))
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
        return this.repository.findMany(args).map(farm => Farm.instanceOf(farm))
    }

    findFirst(args: FarmFindFirstArgs) {
        const farm = this.repository.findFirst(args)

        return !farm ? farm : Farm.instanceOf(farm)
    }

    findIndex(args: FarmFindIndexArgs) {
        return this.repository.findIndex(args)
    }

    findManyIndex(args: FarmFindManyIndexArgs) {
        return this.repository.findManyIndex(args)
    }
}
