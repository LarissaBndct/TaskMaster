export interface Tarefa {
  id: number;
  descricao: string;
  data: string;        // <-- deixa string aqui!
  prioridade: number;
  concluida: boolean;
}

