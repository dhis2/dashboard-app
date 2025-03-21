export const setHeaderbarVisible = (show) => {
    // Header in the current iframe
    const iframeHeader = document.getElementsByTagName('header')[0]

    // Header provided by the global shell
    const globalShellHeader = window.top.document.querySelector(
        '.global-shell-header'
    )

    const setGlobalHeaderStyle = (value) => {
        globalShellHeader.style.display = value
    }

    if (show) {
        globalShellHeader
            ? setGlobalHeaderStyle('block')
            : iframeHeader?.classList.remove('hidden')
    } else {
        globalShellHeader
            ? setGlobalHeaderStyle('none')
            : iframeHeader?.classList.add('hidden')
    }
}
