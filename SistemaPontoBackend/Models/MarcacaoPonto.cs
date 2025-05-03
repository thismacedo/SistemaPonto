namespace SistemaPontoBackend.Models
{
    public class MarcacaoPonto
    {
        public int Id { get; set; }
        public int UsuarioId { get; set; }
        public DateTime DataHoraEntrada { get; set; }
        public DateTime? DataHoraSaida { get; set; }
        public Usuario Usuario { get; set; }
    }
}