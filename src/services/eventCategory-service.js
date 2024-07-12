import ECRepository from "../repositories/eventCategory-repository.js";

export default class ECService {
    getAllAsync = async () => {
        const repo = new ECRepository();
        const ECArray = await repo.getAllAsync();
        return ECArray;
    }

    getByIdAsync = async (id) => {
        const repo = new ECRepository()
        const ECId = await repo.getByIdAsync(id)
        return ECId;
    }

    createCategoryAsync = async (cat) => {
        const repo = new ECRepository()
        const catCreada = await repo.createCategoryAsync(cat)
        return catCreada;
    }

    updateCategoryAsync = async (cat) => {
        const repo = new ECRepository()
        const catUpdateada = await repo.updateCategoryAsync(cat)
        return catUpdateada;
    }

    deleteCategoryAsync = async (id) => {
        const repo = new ECRepository();
        const catDeleteada = await repo.deleteCategoryAsync(id)
        return catDeleteada;
    }

}