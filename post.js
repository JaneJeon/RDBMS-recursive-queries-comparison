const Sequelize = require('sequelize'),
  faker = require('faker/locale/en'),
  randInt = limit => Math.floor(Math.random() * limit),
  length = parseInt(process.env.SLUG_LENGTH)

module.exports = db => {
  const Post = db.define(
    'post',
    {
      id: {
        type: Sequelize.STRING(length),
        primaryKey: true
      },
      parentId: {
        type: Sequelize.STRING(length),
        hierarchy: true
      },
      score: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: { notEmpty: true }
      }
    },
    {
      updatedAt: false,
      indexes: [{ fields: ['score'] }, { fields: ['createdAt'] }],
      hooks: {
        beforeValidate: async post => {
          // fake some data
          post.score = randInt(100)
          post.body = faker.lorem.paragraph()
        },
        beforeCreate: async post => {
          // create a unique, random 5-digit base58 id
          while (true) {
            const base58 =
              '123456789abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ'

            let id = ''
            for (let i = 0; i < length; i++) id += base58[randInt(58)]

            if ((await Post.findById(id)) === null) {
              post.id = id
              break
            }
          }
        }
      }
    }
  )

  Post.getFullTree = async () =>
    Post.findAll({
      hierarchy: true,
      attributes: { exclude: ['createdAt', 'score'] }
    })

  Post.getFullTreeByDate = async () =>
    Post.findAll({
      hierarchy: true,
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['createdAt', 'score'] }
    })

  Post.getFullTreeByScore = async () =>
    Post.findAll({
      hierarchy: true,
      order: [['score', 'DESC']],
      attributes: { exclude: ['createdAt', 'score'] }
    })

  Post.prototype.getTree = async function() {
    // TODO:
  }

  Post.prototype.getTreeByDate = async function() {
    // TODO:
  }

  Post.prototype.getTreeByScore = function() {
    // TODO:
  }

  return Post
}
