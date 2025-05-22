import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Tarefa } from './models/tarefa';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'TaskMaster';
  http = inject(HttpClient);
  url = 'http://localhost:5163';

  tarefas: Tarefa[] = [];
  novaTarefa: Tarefa = { id: 0, descricao: '', data: '', prioridade: 1, concluida: false };
  filtroBusca = '';
  filtroData = '';
  filtroPrioridade = '';
  modoEdicao = false;
  modalAberto = false;

  ngOnInit(): void {
    this.obterTarefas();
  }

  obterTarefas() {
    this.http.get<Tarefa[]>(`${this.url}/Tarefa`)
      .subscribe(tarefas => this.tarefas = tarefas);
  }

  get tarefasFiltradas() {
    return this.tarefas
      .filter(t =>
        (!this.filtroBusca || t.descricao.toLowerCase().includes(this.filtroBusca.toLowerCase())) &&
        (!this.filtroData || t.data.startsWith(this.filtroData)) &&
        (!this.filtroPrioridade || t.prioridade == +this.filtroPrioridade)
      )
      .sort((a, b) => b.prioridade - a.prioridade);
  }

  getPrioridadeTexto(prioridade: number): string {
    switch (prioridade) {
      case 1: return 'Baixa';
      case 2: return 'Média';
      case 3: return 'Alta';
      default: return '';
    }
  }

  limparFiltros() {
    this.filtroBusca = '';
    this.filtroData = '';
    this.filtroPrioridade = '';
  }

  abrirModal(editar = false, tarefa?: Tarefa) {
    this.modoEdicao = editar;
    if (editar && tarefa) {
      this.novaTarefa = { ...tarefa };
    } else {
      this.resetarNovaTarefa();
    }
    this.modalAberto = true;
  }

  fecharModal() {
    this.modalAberto = false;
    this.resetarNovaTarefa();
  }

  salvarTarefa() {
    // Garante que 'concluida' vai como boolean
    this.novaTarefa.concluida = !!this.novaTarefa.concluida;

    if (this.modoEdicao) {
      this.atualizarTarefa(this.novaTarefa);
    } else {
      this.criarTarefa();
    }
    this.fecharModal();
  }

  criarTarefa() {
    this.http.post<Tarefa>(`${this.url}/Tarefa`, this.novaTarefa)
      .subscribe(() => this.obterTarefas());
  }

  atualizarTarefa(tarefa: Tarefa) {
    this.http.put(`${this.url}/Tarefa/${tarefa.id}`, tarefa)
      .subscribe(() => {
        // ✅ Atualiza o item localmente após salvar
        const index = this.tarefas.findIndex(t => t.id === tarefa.id);
        if (index !== -1) {
          this.tarefas[index] = { ...tarefa };
        }
      });
  }

  deletarTarefa(id: number) {
    this.http.delete(`${this.url}/Tarefa/${id}`)
      .subscribe(() => this.obterTarefas());
  }

  resetarNovaTarefa() {
    this.novaTarefa = { id: 0, descricao: '', data: '', prioridade: 1, concluida: false };
  }
}
