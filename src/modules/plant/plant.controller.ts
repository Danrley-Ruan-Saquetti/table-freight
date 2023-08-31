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
} from './plant.repository.js'

export class PlantController {
    private readonly repository: PlantRepository

    constructor() {
        this.repository = new PlantRepository()
    }

    create(args: PlantCreateArgs) {
        return new Plant(this.repository.create(args))
    }

    createMany(args: PlantCreateManyArgs) {
        return this.repository.createMany(args).map(plant => new Plant(plant))
    }

    findMany(args: PlantFindManyArgs) {
        return this.repository.findMany(args).map(plant => new Plant(plant))
    }

    findFirst(args: PlantFindFirstArgs) {
        const plant = this.repository.findFirst(args)

        return !plant ? plant : new Plant(plant)
    }
}
