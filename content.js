setTimeout(() => {
  const containsText = (pattern) => (element) => {
    const matches = element.innerText.match(pattern)
    return matches ? true : false
  }
  const isClose = (string) => {
    return /close|dismiss/i.test(string)
  }
  const isPositiveButton = (element) => {
    return containsText(/\sOK|accept|Yes|agree/i)(element)
      || isClose(element.getAttribute('aria-label'))
  }
  const findPositiveButtons = (element) => {
    const positiveButtons = []
    element.querySelectorAll('button,a').forEach(button => {
      if (isPositiveButton(button)) {
        positiveButtons.push(button)
      }
    })
    return positiveButtons
  }

  const hasCookies = containsText(/cookie/i)
  const divs = []

  document.querySelectorAll('div,p,span').forEach(element => {
    if (hasCookies(element)) {
      // remove any ancestors, we want to narrow down
      divs.forEach((div, i) => {
        if (div.contains(element)) {
          divs.splice(i, 1)
        }
      })
      divs.push(element)
    }
  })

  if (divs.length) {
    // Walk up the tree and find a positive button.
    let continueSearch = true

    divs.forEach(element => {
      if (continueSearch) {
        do {
          element = element.parentElement
          if (element) {
            const positiveButtons = findPositiveButtons(element)

            switch (positiveButtons.length) {
              case 0:
                 break
               case 1:
                 positiveButtons[0].click()
                 continueSearch = false
                 return
               default:
                 console.log('I do not know which button to press.', positiveButtons)
            }
          }
        } while (element)
      }
    })
  }
}, 3000)
