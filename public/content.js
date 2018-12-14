chrome.runtime.onMessage.addListener(request => {
    switch (request.message) {
      case 'terminate extension':
        SMASH_EXTENSION.terminateExtension();
        break;
      case 'initialize extension':
        SMASH_EXTENSION.initializeExtension();
        break;
    }
  }
);


const SMASH_EXTENSION = (() => {

  const initializeExtension = () => {
    ui.createHammer();
    event.visibilityChange();
    event.mouseOver();
    event.mouseMove();
  };

  const terminateExtension = () => {
    chromeCore.sendMessage('terminate');
    event.terminateVisibilityChange();
    event.terminateMouseOver();
    event.terminateMouseMove();
    ui.removeHammer();
  };

  const event = {
    visibilityChange() {
      document.addEventListener('visibilitychange', handler.visibilityChange);
    },
    terminateVisibilityChange() {
      document.removeEventListener('visibilitychange', handler.visibilityChange);
    },
    mouseOver() {
      document.addEventListener('mouseover', handler.mouseOver);
    },
    terminateMouseOver() {
      document.removeEventListener('mouseover', handler.mouseOver);
    },
    mouseMove() {
      document.addEventListener('mousemove', handler.mouseMove);
    },
    terminateMouseMove() {
      document.removeEventListener('mousemove', handler.mouseMove)
    },
    mouseOut(target) {
      target.addEventListener('mouseout', handler.mouseOut);
    },
    terminateMouseOut(target) {
      target.removeEventListener('mouseout', handler.mouseOut)
    },
    clickOnHiding(target) {
      target.addEventListener('click', handler.clickOnHiding);
    },
    terminateClickOnHiding(target) {
      target.removeEventListener('click', handler.clickOnHiding)
    },
  };

  const handler = {
    visibilityChange() {
      if (document.visibilityState === 'hidden') {
        terminateExtension()
      }
    },
    mouseOver({target}) {
      if (target.parentElement && target.className !== ui.classForHammer) {
        event.mouseOut(target);
        event.clickOnHiding(target);
        ui.addHoverStyle(target);
      }
    },
    mouseMove(event) {
      ui.moveHammer(event);
    },
    mouseOut({target}) {
      event.terminateMouseOut(target);
      event.terminateClickOnHiding(target);
      ui.removeHoverStyle(target);
    },
    clickOnHiding(event) {
      event.preventDefault();
      ui.hideElement(event.target);
    },
  };

  const ui = {
    rootStyle: document.documentElement.style,
    classForHammer: '__hammer',
    classForHovered: '__hammer__target',
    classForHiding: '__out__bottom',

    createHammer() {
      const hammerWrap = document.createElement('span');
      const hammer = document.createTextNode('🔨');

      hammerWrap.className = this.classForHammer;
      hammerWrap.appendChild(hammer);
      document.body.appendChild(hammerWrap);
    },
    removeHammer() {
      const hammers = document.getElementsByClassName(this.classForHammer);
      for (let hammer of hammers) {
        hammer.remove();
      }
    },
    addHoverStyle(target) {
      target.classList.add(this.classForHovered);
    },
    removeHoverStyle(target) {
      target.classList.remove(this.classForHovered);
    },
    moveHammer(event) {
      this.rootStyle.setProperty('--hammer-position-x', event.pageX + 2 + 'px');
      this.rootStyle.setProperty('--hammer-position-y', event.pageY - 21 + 'px');
    },
    hideElement(target) {
      target.classList.add(this.classForHiding);
      setTimeout(() => target.style.display = 'none', 500)
    },
  };

  const chromeCore = {
    sendMessage(message) {
      chrome.runtime.sendMessage({message})
    },
  };

  return Object.freeze({
    initializeExtension,
    terminateExtension,
  })
})();