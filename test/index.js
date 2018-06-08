const os = require('os')
const fs = require('fs')
const path = require('path')
const test = require('tape')
const rimraf = require('rimraf')
const dedent = require('dedent')
const gitConfig = require('git-config')

const lib = require('../')

test('makes a directory', function (t) {
  t.plan(1)
  const tmpdir = path.join(os.tmpdir(), 'cooldir')

  lib.mkdir(tmpdir, function () {
    fs.readdir(tmpdir, function (err, files) {
      if (err) t.fail(err)
      rimraf(tmpdir, function (err) {
        if (err) t.fail(err)
        t.pass('creates directory (cleans up test dir after)')
      })
    })
  })

})

test('writes a twig file', function (t) {
  t.plan(2)

  const expectedFile = dedent`
    <section class='coolcomponent'>
      <!-- component-name markup goes here-->
    </section>\n
  `
  writeAndClean(t, {
    method: 'writeTwig',
    filename: 'index.twig',
    filetype: 'twig',
    expected: expectedFile
  })

})

test('writes a scss file', function (t) {
  t.plan(2)

  const expectedFile = dedent`
    .coolcomponent {
      /* component styles go here */
    }\n
  `
  writeAndClean(t, {
    method: 'writeCSS',
    filename: 'styles.scss',
    filetype: 'scss',
    expected: expectedFile
  })

})

test('writes a js file', function (t) {
  t.plan(2)

  const expectedFile = dedent`
    import $ from 'jquery'

    class Coolcomponent {
      constructor(element, options) {
        this.element = $(element)
      }

      init() {
        if (!this.element.length) {
          return
        }
      }
    }

    const coolcomponent = new Coolcomponent()

    coolcomponent.init()\n
  `
  writeAndClean(t, {
    method: 'writeJS',
    filename: 'index.js',
    filetype: 'js',
    expected: expectedFile
  })

})

test('writes a readme', function (t) {
  t.plan(2)

  gitConfig(function (err, config) {
    if (err) return t.fail()

    const expectedFile = dedent`
      # Author: ${config.user.name}
    `
    writeAndClean(t, {
      method: 'writeReadMe',
      filename: 'README.md',
      filetype: 'md',
      expected: expectedFile
    })
  })
})

function writeAndClean (t, opts) {
  const tmpdir = path.join(os.tmpdir(), 'cooldir')
  const tmpfile = path.join(tmpdir, opts.filename)

  lib.mkdir(tmpdir, function () {
    lib[opts.method]('coolcomponent', tmpfile, function (err) {
      if (err) t.fail(err)
      fs.readFile(tmpfile, function (err, file) {
        if (err) t.fail(err)
        t.equal(file.toString(), opts.expected)
        rimraf(tmpdir, function (err) {
          if (err) t.fail(err)
          t.pass(`creates ${opts.filetype} file (cleans up test dir after)`)
        })
      })
    })
  })
}