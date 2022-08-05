import { model, Schema } from "mongoose";

const novaTabelaTarefa = new Schema({
    nome: {
        type: String,
        required: true
    }   
})


const Tarefa = model('Tarefa', novaTabelaTarefa)

export default Tarefa