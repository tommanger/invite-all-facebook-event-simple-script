var tags = document.getElementsByTagName('i')
let url = 'url("https://static.xx.fbcdn.net/rsrc.php/v3/yh/r/DkJXGpXdSuw.png")'

for (var i = 0, len = tags.length; i < len; i++) {
    let biUrl = document.defaultView.getComputedStyle(tags[i], null).getPropertyValue('background-image');
    if (biUrl === url) {
        tags[i].click()
    }
}
