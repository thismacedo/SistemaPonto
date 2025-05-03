namespace SistemaPontoBackend.Models
{
    public class Log
    {
        public int Id { get; set; }
        public string Acao { get; set; }
        public DateTime DataHora { get; set; }
        public int UsuarioId { get; set; }
        public Usuario Usuario { get; set; }
    }
}