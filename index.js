const fs = require('fs')
const path = require('path')
const dedent = require('dedent')
const mkdirp = require('mkdirp')

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
  const file = dedent`
    <section class='${component}'>
      <div class='${component}__container'>
        <!-- additional ${component} component code here -->
      </div>
    </section>\n
  `

  write(filename, file, cb)
}

exports.writeCSS = function (component, filename, cb) {
  // TODO: add logic for panels, buttons, mastheads, etc...
  const file = dedent`
    .${component} {
      background-color: rgba($white, 0.9);
      width: 100%;
    }

    .${component}__container {
      align-items: center;
      display: flex;
      justify-content: space-between;
      padding: 20px;
      padding-bottom: 20px;
      padding-top: 20px;
      width: 100%;

      @media (min-width: $medium-screen) {
        padding: 30px 20px;
      }
    }\n
  `

  write(filename, file, cb)
}

exports.writeJS = function (component, filename, cb) {
  // TODO: add logic for panels, buttons, mastheads, etc...
  const capitalize = component.replace(component.charAt(0), component.charAt(0).toUpperCase())
  const file = dedent`
    import $ from 'jquery'

    class ${capitalize} {
      constructor(element, options) {
        this.element = $(element)
      }

      init() {
        if (!this.element.length) {
          return
        }
      }
    }

    const ${component} = new ${capitalize}()

    ${component}.init()\n
  `

  write(filename, file, cb)
}

function write (filename, file, cb) {
  fs.writeFile(filename, file, function (err) {
    if (err) return cb(new Error('Could not write file ' + filename))
    cb()
  })
}