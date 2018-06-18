require('dotenv').config()

const ora = require('ora'),
  ms = require('pretty-ms'),
  db = require('./db'),
  Post = require('./post')(db)
;(async () => {
  const spinner = ora(`connecting to ${process.env.DIALECT}`).start()

  try {
    await db.sync()
  } catch (err) {
    spinner.fail(err.toString())
    process.exit(1)
  }

  spinner.text = 'generating top-level posts'
  const start = new Date()
  let parents = [await Post.create()],
    next = []

  for (let i = 1; i <= process.env.DEPTH; i++) {
    spinner.text = `generating depth ${i} posts`
    for (let j = 0; j < parents.length; j++)
      for (let k = 0; k < process.env.BREADTH; k++) {
        const child = await Post.create()
        await child.setParent(parents[j])
        await child.save()
        next.push(child)
      }

    parents = next
    next = []
  }

  const duration = new Date() - start,
    count = (await Post.findAndCountAll()).count

  spinner.succeed(`${count} posts created, ${ms(duration / count)} per post`)
  process.exit(0)
})()
