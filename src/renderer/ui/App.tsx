import React, { ReactElement, useEffect, useState } from "react"
import { getDate } from "../../common/getDate"
import { ipcRenderer } from "electron"

import styles from "./App.module.scss"
import logo from "../public/logo192.png"

export const App: React.FC = () => {

  interface Tarefa {
    _id: string,
    nome: string,
  }


  const [nome, setNome] = useState<string>("")
  const [listaTarefas, setListaTarefas] = useState<Tarefa[]>([])
  const [editar, setEditar] = useState<Boolean>(false)
  const [tarefa, setTarefa] = useState<Tarefa>()

  const enviarDados = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if(editar) {
      const tarefaAlterada = {...tarefa}
      tarefaAlterada.nome = nome
      ipcRenderer.send("alterar-tarefa", tarefaAlterada)
      setEditar(false)
    } else {
      ipcRenderer.send('nova-tarefa', {
        nome: nome
      })
    }

    setNome("")
    ipcRenderer.send('listar-tarefa', {})
    
  }

  const alterarTarefa = (tarefa: Tarefa) => {
    setNome(tarefa.nome)

    setEditar(true)
    setTarefa(tarefa)
  }

  const deletarTarefa = (tarefa: Tarefa) => {
    ipcRenderer.send("deletar-tarefa", tarefa)
  }

  const renderTarefa = () => {
    return listaTarefas.map((tarefa, index) => {

        return <li key={index}>

                  <p id="tarefaBox" >{tarefa.nome}</p>

                  <div className={styles.wrap}>
                    <button className={styles.editar} onClick={ (e) => alterarTarefa(tarefa)}>
                        Editar
                    </button>
                    <button className={styles.deletar} onClick={ (e) => deletarTarefa(tarefa)}>
                        Deletar
                    </button>
                  </div>
                </li>

    })
  }

  const handleChangesNome = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNome(event.target.value)
  }


  ipcRenderer.on('listar-tarefa', (e, args) => {
    setListaTarefas(JSON.parse(args));
  })


  useEffect(() => {
    ipcRenderer.send('listar-tarefa', {})
  }, [])


  return (
    <div className={styles.app}>
      <main>
        <h1>TO-DO LIST</h1>

        <form onSubmit={(e)=> enviarDados(e)}>
          <label>
              <input type="text" id="nome" value={nome} placeholder="Nome da tarefa..." onChange={e => handleChangesNome(e)} />
          </label>
          <button type="submit">Salvar</button>
        </form>

        <hr />

        <ul>
          {
            renderTarefa()          
          }
        </ul>
      </main>
    </div>
  )
}
