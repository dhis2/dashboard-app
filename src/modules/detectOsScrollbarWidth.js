const className = '__horizontal-scrollbar-height-test__'
const styles = `
    .${className} {
        position: absolute;
        top: -9999px;
        width: 100px;
        height: 100px;
        overflow-y: scroll;
    }
`

export function detectOsScrollbarWidth() {
    const style = document.createElement('style')
    style.innerHTML = styles

    const el = document.createElement('div')
    el.classList.add(className)

    document.body.appendChild(style)
    document.body.appendChild(el)

    const scrollbarWidth = el.offsetWidth - el.clientWidth

    document.body.removeChild(style)
    document.body.removeChild(el)

    return scrollbarWidth
}
