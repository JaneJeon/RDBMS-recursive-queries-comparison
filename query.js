require('dotenv').config()

const ora = require('ora'),
  ms = require('pretty-ms'),
  fs = require('fs'),
  Post = require('./post')(require('./db')),
  randInt = limit => Math.floor(Math.random() * limit)
;(async () => {
  const spinner = ora('fetching full unordered tree').start()
  let start = new Date()

  for (let i = 0; i < process.env.ITERS; i++)
    var result1 = await Post.findAll({
      hierarchy: true,
      attributes: { exclude: ['createdAt'] }
    })

  const duration1 = ms((new Date() - start) / process.env.ITERS)
  spinner.text = 'fetching full tree by date'
  start = new Date()

  for (let i = 0; i < process.env.ITERS; i++)
    var result2 = await Post.findAll({
      hierarchy: true,
      attributes: { exclude: ['createdAt'] },
      order: [['createdAt', 'DESC']]
    })

  const duration2 = ms((new Date() - start) / process.env.ITERS)
  spinner.text = 'fetching full tree by score'
  start = new Date()

  for (let i = 0; i < process.env.ITERS; i++)
    var result3 = await Post.findAll({
      hierarchy: true,
      attributes: { exclude: ['createdAt'] },
      order: [['score', 'DESC']]
    })

  const duration3 = ms((new Date() - start) / process.env.ITERS)
  spinner.text = 'updating scores of the tree'

  // simulate update-heavy workload, with hot rows
  const keys = await Post.findAll({
      attributes: ['id'],
      limit: parseInt(process.env.HOT_ROWS)
    }),
    updates = []

  start = new Date()
  for (let i = 0; i < process.env.UPDATES; i++) {
    updates.push(
      (async () =>
        (await Post.findById(keys[randInt(keys.length)].id)).increment(
          'score'
        ))()
    )
  }

  await Promise.all(updates)
  const duration4 = ms(new Date() - start)

  spinner.succeed(
    `fetching full unordered tree: ${duration1}\n` +
      `fetching full tree by date: ${duration2}\n` +
      `fetching full tree by score: ${duration3}\n` +
      `total rows: ${(await Post.findAndCountAll()).count}, ` +
      `iters: ${process.env.ITERS}\n` +
      `updating ${process.env.UPDATES} records: ${duration4}`
  )

  fs.writeFile(
    process.env.REPORT,
    `${JSON.stringify(result1)}\n` +
      `${JSON.stringify(result2)}\n` +
      `${JSON.stringify(result3)}`,
    () => {
      process.exit(0)
    }
  )
})()
