function component() {
    let element = document.createElement('div')
    element.innerHTML =['Hello', 'Webpack'].join(' ')
    return element
}

document.body.appendChild(component())