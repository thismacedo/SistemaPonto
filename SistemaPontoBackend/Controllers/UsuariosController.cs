using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaPontoBackend.Data;
using SistemaPontoBackend.Models;

namespace SistemaPontoBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuariosController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsuariosController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            var usuario = await _context.Usuarios
                .FirstOrDefaultAsync(u => u.Email == model.Email && u.Senha == model.Senha);

            if (usuario == null)
                return Unauthorized(new { message = "Email ou senha incorretos." });

            return Ok(new { usuario.Id, usuario.Nome, usuario.IsAdmin });
        }
    }

    public class LoginModel
    {
        public string Email { get; set; }
        public string Senha { get; set; }
    }
}