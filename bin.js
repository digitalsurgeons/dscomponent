#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const ansi = require('ansi-escape-sequences')
const dedent = require('dedent')
const minimist = require('minimist')
const series = require('run-series')
const mapLimit = require('map-limit')

const lib = require('./')

const USAGE = `
  A command line utility to assist in the creation of DS Boilerplate component
  $ ${clr('dscomponent', 'bold')} ${clr('<component-name>', 'green')} [options]

  Options:
    -S, --skip        skip creating file. Options: css, js, twig
    -h, --help        print usage
    -v, --version     print version
    -q, --quiet       don't output any logs

`.replace(/\n$/, '').replace(/^\n/, '')

const NOCOMPONENT = `
  Please specify the component name:
    ${clr('$ dscomponent', 'cyan')} ${clr('<component-name>', 'green')}

  For example:
    ${clr('$ dscomponent', 'cyan')} ${clr('my-component', 'green')}

  Run ${clr('dscomponent --help', 'cyan')} to see all options.
`.replace(/\n$/, '').replace(/^\n/, '')

const argv = minimist(process.argv.slice(2), {
  alias: {
    skip: ['S', 's'],
    help: 'h',
    version: 'v',
    quiet: 'q'
  },
  boolean: [
    'help',
    'version',
    'quiet'
  ]
})

;(function main (argv) {
  const component = argv._[0]

  if (argv.help) {
    console.log(USAGE)
  } else if (argv.version) {
    console.log(require('./package.json').version)
  } else if (!component) {
    console.log(NOCOMPONENT)
    process.exit(1)
  } else {
    create(path.join(process.cwd(), component), argv)
  }
})(argv)

function create (dir, argv) {
  const written = []

  // psuedo schema for writing files
  // filename: method to writeFile
  const toWrite = {
    'index.twig': 'writeTwig',
    'styles.scss': 'writeCSS',
    'index.js': 'writeJS'
  }

  const cmds = [
    function (done) {
      print(`Creating a new component directory in ${clr(dir, 'green')}`)
      lib.mkdir(dir, done)
    }
  ]

  Object.keys(toWrite).forEach(function (filename) {
    if (filename === 'index.js' && argv.skip === 'js') return
    if (filename === 'index.twig' && argv.skip === 'twig') return

    var isStyles = argv.skip === 'css' || argv.skip === 'scss'
    if (filename === 'styles.scss' && isStyles) return

    const method = toWrite[filename]
    const component = argv._[0]
    const fn = function (done) {
      printFile(filename)
      const file = path.join(dir, filename)
      written.push(file)
      lib[method](component, file, done)
    }

    cmds.push(fn)
  })

  series(cmds, function (err) {
    if (err) {
      print('\nAborting installation. The following error occured:')
      print(`   ${clr(err.message, 'red')}\n`)
      mapLimit(written, 1, cleanFile, function (err) {
        if (err) throw err
        console.log('Cleanup completed, please try again sometime.')
        process.exit(1)
      })
    } else {
      var msg = dedent`
        Component created in ${clr(dir, 'green')}.
        ${clr('All done, good job!', 'magenta')}
      `.replace(/\n$/g, '')
      print('\n' + msg)
    }
  })

  function print (val) {
    if (!argv.quiet) console.log(val)
  }

  function printFile (filename) {
    print(`Creating file ${clr(filename, 'cyan')} in directory ${dir}`)
  }
}

function clr (text, color) {
  return process.stdout.isTTY ? ansi.format(text, color) : text
}

function cleanFile (file, cb) {
  console.log('Deleting generated file… ' + clr(path.basename(file), 'cyan'))
  rimraf(file, cb)
}
