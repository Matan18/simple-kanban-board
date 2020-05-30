const { app, BrowserWindow } = require('electron')

function createWindow() {
  let win = new BrowserWindow({
    width: 1050,
    height: 600,
    alwaysOnTop:false,
    webPreferences:{
      nodeIntegration:true
    },
    titleBarStyle:'hidden',
    autoHideMenuBar:true
  })
  win.loadFile('index.html')
}

app.whenReady().then(createWindow)

app.on('window-all-closed',()=>{
  if(process.platform!=='darwin'){
    app.quit();
  }
})
app.on('activate', ()=>{
  if(BrowserWindow.getAllWindows().length===0){
    createWindow();
  }
})