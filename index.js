#!/usr/bin/env node

const fs = require('fs')
const program = require('commander')
let data = {}

program
  .version('1.0.1')
  .description(
    'A command line utility to assist in the creation of DS Boilerplate component'
  )
  // program.js will be set to false if --no-js specified
  .option('--no-js', 'Remove index.js')
  // first and only argument is name of component
  .arguments('<name>')
  // store name in data object
  .action(name => {
    data.name = name
  })
  .parse(process.argv)

// directory paths
const parentDir = `${process.cwd()}/components`
const childDir = `${parentDir}/${data.name}`

// if no components folder then create first
if (!fs.existsSync(parentDir)) {
  fs.mkdirSync(parentDir)
}

// then create component directory
if (!fs.existsSync(childDir)) {
  fs.mkdirSync(childDir)
}

// create twig file
fs.openSync(`${childDir}/index.twig`, 'w')

// create styles file
fs.openSync(`${childDir}/styles.scss`, 'w')

// create JS file if required
if (program.js) {
  fs.openSync(`${childDir}/index.js`, 'w')
}

console.log(`${data.name} component created`)
