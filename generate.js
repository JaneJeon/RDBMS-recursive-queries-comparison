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
  let parents = [],
    next = []

  const start = new Date()
  for (let i = 0; i < process.env.BREADTH; i++)
    parents.push(await Post.create())

  for (let i = 2; i <= process.env.DEPTH; i++) {
    spinner.text = `generating depth ${i} posts`
    for (parent of parents)
      for (let j = 0; j < process.env.BREADTH; j++) {
        const child = await Post.create()
        await child.setParent(parent)
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
