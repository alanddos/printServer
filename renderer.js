const ipc = electron.ipcRenderer

const updateBtn = document.getElementById('clear')

updateBtn.addEventListener('click', function () {
  ipc.send('stdout')
})

ipc.on('stdou_reply', function (event, arg) {    
    console.log('Chegou no reply')
    results.innerHTML = event
})