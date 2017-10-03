function component() {
    let element = document.createElement('div')
    element.innerHTML =['Hello', 'Webpack', "Goodbye", 'Webpack'].join(' ')
    return element
}

document.body.appendChild(component())