const fs = require('fs')
const path = require('path')
const dedent = require('dedent')
const mkdirp = require('mkdirp')
const cama = require('cama')

exports.mkdir = function(dir, cb) {
  mkdirp(dir, function(err) {
    if (err) return cb(new Error('Could not create directory ' + dir))
    fs.readdir(dir, function(err, files) {
      if (err) return cb(new Error('Could not read directory ' + dir))
      if (files.length)
        return cb(
          new Error('Directory contains files. This might create conflicts.')
        )
      cb()
    })
  })
}

exports.writeTest = function(component, filename, cb) {
  // TODO: add logic for panels, buttons, mastheads, etc...
  const data = dedent`
    import React from 'react'
    import renderer from 'react-test-renderer'
    import ${component} from './index'
    
    describe('${component}', () => {
      it('renders correctly', () => {
        const component = renderer.create(
          <${component} />
        )
        let tree = component.toJSON()
        expect(tree).toMatchSnapshot()
      })
    })
    \n
  `

  write(filename, data, cb)
}

exports.writeStyles = function(component, filename, cb) {
  // TODO: add logic for panels, buttons, mastheads, etc...
  const data = dedent`
    import styled from 'styled-components'
    import { colors } from '../../lib/settings'
    
    export const Root = styled.div({
      display: 'flex'
    })
  `

  write(filename, data, cb)
}

exports.writeComponent = function(component, filename, cb) {
  const capitalize = component.replace(
    component.charAt(0),
    component.charAt(0).toUpperCase()
  )
  const ctor = cama(capitalize)
  const data = dedent`
    import { Root } from './styles'

    export default () => (
      <Root>
        Hello World
      </Root>
    )\n
  `

  write(filename, data, cb)
}

function write(filename, data, cb) {
  fs.writeFile(filename, data, function(err) {
    if (err) return cb(new Error('Could not write file ' + filename))
    cb()
  })
}
