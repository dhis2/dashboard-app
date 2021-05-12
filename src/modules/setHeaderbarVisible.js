export const setHeaderbarVisible = show => {
    const header = document.getElementsByTagName('header')[0]
    if (show) {
        header.classList.remove('hidden')
    } else {
        header.classList.add('hidden')
    }
}
