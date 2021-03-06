const fs = require('fs')
const dedent = require('dedent')
const mkdirp = require('mkdirp')
const cama = require('cama')
var gitConfig = require('git-config')

exports.mkdir = function (dir, cb) {
  mkdirp(dir, function (err) {
    if (err) return cb(new Error('Could not create directory ' + dir))
    fs.readdir(dir, function (err, files) {
      if (err) return cb(new Error('Could not read directory ' + dir))
      if (files.length) return cb(new Error('Directory contains files. This might create conflicts.'))
      cb()
    })
  })
}

exports.writeTwig = function (component, filename, cb) {
  // TODO: add logic for panels, buttons, mastheads, etc...
  const data = dedent`
    <section class='${component}'>
      <!-- component-name markup goes here-->
    </section>\n
  `

  write(filename, data, cb)
}

exports.writeCSS = function (component, filename, cb) {
  // TODO: add logic for panels, buttons, mastheads, etc...
  const data = dedent`
    .${component} {
      /* component styles go here */
    }\n
  `

  write(filename, data, cb)
}

exports.writeJS = function (component, filename, cb) {
  // TODO: add logic for panels, buttons, mastheads, etc...
  const capitalize = component.replace(component.charAt(0), component.charAt(0).toUpperCase())
  const ctor = cama(capitalize)
  const data = dedent`
    import $ from 'jquery'

    class ${ctor} {
      constructor(element, options) {
        this.element = $(element)
      }

      init() {
        if (!this.element.length) {
          return
        }
      }
    }

    const ${cama(component)} = new ${ctor}()

    ${cama(component)}.init()\n
  `

  write(filename, data, cb)
}

exports.writeReadMe = function (component, filename, cb) {
  gitConfig(function (err, config) {
    if (err) return cb(err)
    const data = dedent`
      # Author: ${config.user.name}
    `
    write(filename, data, cb)
  })
}

function write (filename, data, cb) {
  fs.writeFile(filename, data, function (err) {
    if (err) return cb(new Error('Could not write file ' + filename))
    cb()
  })
}
