using System;
using System.ComponentModel.DataAnnotations;

namespace api.Entities
{
    public class Tarefa
    {
        [Key]
        public int Id { get; set; }

        public string Descricao { get; set; }

        public DateTime Data { get; set; }

        public int Prioridade { get; set; } // 1 = baixa, 2 = média, 3 = alta

        public bool Concluida { get; set; } = false; // Adicionado
    }
}
