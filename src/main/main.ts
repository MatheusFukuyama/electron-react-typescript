import { app, BrowserWindow, ipcMain } from "electron"
import isDev from "electron-is-dev"
import path from "path"
import url from "url"
import '../database'
import Tarefa from '../models/tarefa'

const productionUrl = path.resolve(__dirname, "../renderer/index.html")

const appUrl = isDev
  ? "http://localhost:3000"
  : url.format({
    pathname: productionUrl,
    protocol: "file:",
    slashes: true
  })

async function run() {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true
    }
  })
  await mainWindow.loadURL(appUrl)
  
}

ipcMain.on("nova-tarefa", async (e, args) => {
  const tarefa = new Tarefa(args)
  const tarefaAdicionada = await tarefa.save()
 
  const tarefas = await Tarefa.find()
  e.reply("listar-tarefa", JSON.stringify(tarefas))
})

ipcMain.on("alterar-tarefa", async (e, args) => {
  const tarefaEditada = await Tarefa.findOneAndUpdate({ _id: args._id}, args)

  const tarefas = await Tarefa.find()
  e.reply("listar-tarefa", JSON.stringify(tarefas))
})


ipcMain.on("deletar-tarefa", async (e, args) => {
  const tarefaRemovida = await Tarefa.deleteOne({ _id: args._id})
  const tarefas = await Tarefa.find()
  e.reply("listar-tarefa", JSON.stringify(tarefas))
})

ipcMain.on("listar-tarefa", async (e, args) => {
  const tarefas = await Tarefa.find()
  e.reply("listar-tarefa", JSON.stringify(tarefas))
})

app.whenReady().then(run)