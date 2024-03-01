const Animal = require('../models/Animal');

exports.getAll = () => Animal.find({}).lean();

exports.create = (ownerId, friendlyData) => Animal.create({ ...friendlyData, owner: ownerId }); 

exports.getOne = (animalId) => Animal.findById(animalId).lean();

exports.donate = async (userId, animalId) => {
    const friendly = await Animal.findById(animalId); 
    
    friendly.donations.push(userId);

    return await friendly.save();
}

exports.getOne = (animalId) => Animal.findById(animalId).lean();

exports.edit = (animalId, friendlyData) => Animal.findByIdAndUpdate(animalId, friendlyData, { runValidators: true });

exports.delete = (animalId) => Animal.findByIdAndDelete(animalId);

exports.search = async (location) => {
    let friendly = await this.getAll();

    if (location){
        friendly = friendly.filter(x => x.location.toLowerCase() == location.toLowerCase());
    }
    return friendly;
};