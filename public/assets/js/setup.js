const help = require('./helpers')
const tree = require('./tree')
const createMenu = require('./menu')

// mounting points for buttons for audio, sounds, bgs etc.
let loopButtons = document.getElementById('loop-buttons')
let backgroundButtons = document.getElementById('background-buttons')
let fontButtons = document.getElementById('font-buttons')
let keySoundButtons = document.getElementById('keySound-buttons')

let loopCancel = document.getElementById('loop-cancel')
let backgroundCancel = document.getElementById('background-cancel')
// let fontCancel = document.getElementById('font-cancel')
let keySoundCancel = document.getElementById('keySound-cancel')

// sidebar controls / toggles etc
let sidebar = document.getElementById('editor-controls')
let openSidebar = document.getElementById('sidebar-open')
let closeSidebar = document.getElementById('sidebar-close')

const setup = function() {
  // create menu:
  createMenu()

  // create sidebar buttons
  createButtons()

  // toggle sidebar button
  openSidebar.addEventListener('click', () => {
    sidebar.style.visibility = 'visible'
    openSidebar.style.visibility= 'hidden'
  })

  closeSidebar.addEventListener('click', () => {
    sidebar.style.visibility = 'hidden'
    openSidebar.style.visibility= 'visible'
  })
}


function createButtons() {
  // create audio buttons
  help.walk(tree.audio, ['.wav', '.mp3'], (assetList, count) => {
    help.createButtons(assetList, count, loopButtons, count + 1, 'loop', help.toggleAudio)
  })

  help.createCancelButton(loopCancel, 'loop', function () {
    if (tree.selectedAudio !== '') {
      tree.selectedAudio.pause()
    }
    tree.selectedAudio = ''

    loopButtons.childNodes.forEach(function(child) {
      child.classList.remove('on')
    })
  })

  // create background buttons
  help.walk(tree.bg, ['.jpeg', '.jpg', '.png'], (assetList, count) => {
    help.createButtons(assetList, count, backgroundButtons, count + 1, 'bg', help.toggleBackground)
  })

  help.createCancelButton(backgroundCancel, 'background', function () {
    document.body.style.background = tree.defaultBackground

    backgroundButtons.childNodes.forEach(function(child) {
      child.classList.remove('on')
    })
  })

  // create font buttons
  help.walk(tree.fonts, null, (assetList, count) => {
    help.createButtons(assetList, count, fontButtons, count + 1, 'font', help.toggleFonts)
  })

  // Create typing sound buttons:
  help.walk(tree.keySounds, ['.wav', '.mp3'], (assetList, count) => {
    help.createButtons(assetList, count, keySoundButtons, count + 1, 'keySound', help.fireKeySound)
  })

  help.createCancelButton(keySoundCancel, 'keySound', function () {
    document.onkeydown = '' // turn off key sounds.
      // var buttonRow = keySoundCancel.parentNode;
      // console.log(buttonRow.childNodes);
      keySoundButtons.childNodes.forEach(function(child) {
        child.classList.remove('on')
      })


  })
}

module.exports = setup
