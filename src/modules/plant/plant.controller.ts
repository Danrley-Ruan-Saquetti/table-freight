import { Plant } from './plant.model.js'
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
    PlantFindArgs,
    PlantUpdateArgs,
    PlantUpdateManyArgs,
} from './plant.repository.js'

export class PlantController {
    private readonly repository: PlantRepository

    constructor() {
        this.repository = new PlantRepository()
    }

    create(args: PlantCreateArgs) {
        return Plant.instanceOf(this.repository.create(args))
    }

    createMany(args: PlantCreateManyArgs) {
        return this.repository.createMany(args).map(plant => Plant.instanceOf(plant))
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
        return this.repository.findMany(args).map(plant => Plant.instanceOf(plant))
    }

    findBydIds(ids: number[]) {
        return this.repository.findBydIds(ids).map(plant => Plant.instanceOf(plant))
    }

    findFirst(args: PlantFindFirstArgs) {
        const plant = this.repository.findFirst(args)

        return !plant ? plant : Plant.instanceOf(plant)
    }

    findIndex(args: PlantFindIndexArgs) {
        return this.repository.findIndex(args)
    }

    findManyIndex(args: PlantFindManyIndexArgs) {
        return this.repository.findManyIndex(args)
    }
}
