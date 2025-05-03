using Microsoft.EntityFrameworkCore;
using SistemaPontoBackend.Models;

namespace SistemaPontoBackend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Usuario> Usuarios { get; set; }
        public DbSet<MarcacaoPonto> MarcacoesPonto { get; set; }
        public DbSet<Log> Logs { get; set; }
    }
}