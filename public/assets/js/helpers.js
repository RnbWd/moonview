const fs = require('fs')
const path = require('path')
const sizeOf = require('image-size')
let tree = require('./tree')

const helpers = {
  // gets a flat array of a dir; calls an action on each file.
  walk (dir, fileTypes, action, maxFiles) {
    if (typeof action !== 'function') {
      // if 2nd param is not a fn, make it so.
      action = function (error, file) {
        if (error) throw error
      }
    }

    let assetList = []

    if (dir.constructor === Array) { // test if dir is an array
      assetList = dir
        // run the callback (action) on each file.
        // TODO: sort out error with i=0 breaking it if assigned to var / let
      for (let i = 0; i < assetList.length; i++) {
        action(assetList, i)
      }
    } else {
      fs.readdir(dir, function (err, list) {
        if (err) throw err
        if (!maxFiles) maxFiles = list.length

        // loop through each file, and check if extension name is of the right type.
        // push these to a new array.
        list.forEach((file) => {
          fileTypes.forEach((type) => {
            if (path.extname(file) === type) assetList.push(file)
          })
        })

        // loop over the assetList and turn the files into string'd paths.
        assetList = assetList.map((file) => {
          return dir + '/' + file
        })

        // run the callback (action) on each file.
        for (let i = 0; i < maxFiles; i++) {
          action(assetList, i)
        }
      })
    }
  },

  toggleFonts (font) {
    let editor = document.getElementById('editor')
    editor.style.fontFamily = font
    console.log(font)
  },

  toggleBackground (image) {
    // default background properties/
    document.body.style.backgroundSize = 'cover'
    document.body.style.backgroundRepeat = 'no-repeat'

    let tiled = sizeOf(image)

    if (tiled.width < 1000) {
      document.body.style.backgroundSize = 'auto'
      document.body.style.backgroundRepeat = 'repeat'
    }

    document.body.style.backgroundImage = `url(${image})`
  },

  toggleAudio (file) {
    let audio = new Audio(file)

    if (tree.selectedAudio.currentTime > 0) { // if file is playing
      tree.selectedAudio.pause() // pause the file.
    }

    tree.selectedAudio = audio // asign new file
    tree.selectedAudio.play() // play new file.

    /* TODO: change this to a few if /elses that:
      - on clicking already playing file: pause / resume
    */
  },

  fireKeySound (file) {
    // enable key sounds
    // Create an array of audio objects for triggering
    let j = 0
    let audioBuffer = []
    for (let i = 0; i < 50; i++) audioBuffer.push(new Audio(file))

    // on fire, count up j, if it hits the buffer , reset j.

    document.onkeydown = function () {
      j++
      if (j === audioBuffer.length) j = 0

      // cut off the note in favor of the new note? not sure if I should keep this in.
      // audioBuffer[j].pause()
      // audioBuffer[j].curentTime = 0

      audioBuffer[j].playbackRate = 1 + Math.random() * 1

      audioBuffer[j].play()
      console.log(audioBuffer[j].playbackRate)
    }

  },

  createButtons (assetList, timesCalled, mount, text, type, action) {
    // callback block; runs for every file in `assetList`
    mount.innerHTML += `<button id="${type}-${text}"> ${text} </button>`

    // once all buttons are made, create an array of them.
    if (timesCalled + 1 === assetList.length) {
      let arr = Array.from(mount.childNodes) // es6 nodelist -> arr.
      let assetArray = []

      // strip non-essential childNodes (ie. non button elements).
      arr.forEach((el) => {
        if (el.nodeName === 'BUTTON') {
          assetArray.push(el)
        }
      })

      console.log(arr);

      // add an event listener to each item in `list`
      for (let i = 0; i < arr.length; i++) {
        (function (index) { // closure for unique event listeners.
          arr[index].addEventListener('click', () => {
            action(assetList[index])
          })
        })(i)
      }
    }
  },

  createCancelButton (mount, type, action) {
    mount.innerHTML += `<button id="cancel-${type}">x</button>`
    mount.addEventListener('click', action)
  }
}

module.exports = helpers
