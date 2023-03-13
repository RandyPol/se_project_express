const ClothingItem = require('../models/clothingItem')

module.exports.getClothingItems = (req, res) => {
  ClothingItem.find({})
    .then((clothingItems) => res.send({ data: clothingItems }))
    .catch((err) => res.status(500).send({ message: err.message }))
}

module.exports.createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body
  ClothingItem.create({ name, weather, imageUrl })
    .then((clothingItem) => res.send({ data: clothingItem }))
    .catch((err) => res.status(500).send({ message: err.message }))
}

module.exports.deleteClothingItem = (req, res) => {
  const { clothingItemId } = req.params
  ClothingItem.findByIdAndRemove(clothingItemId)
    .then((clothingItem) => {
      if (!clothingItem) {
        return res.status(404).send({ message: 'Clothing item not found' })
      }
      return res.send({ data: clothingItem })
    })
    .catch((err) => res.status(500).send({ message: err.message }))
}
