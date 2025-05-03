using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SistemaPontoBackend.Data;
using SistemaPontoBackend.Models;
using ClosedXML.Excel;
using System.IO;


namespace SistemaPontoBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MarcacoesPontoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public MarcacoesPontoController(AppDbContext context)
        {
            _context = context;
        }

/* thismacedo - O problema aqui é que o endpoint espera um int diretamente no corpo da 
                requisição, mas o script.js está enviando um objeto JSON com o usuarioId.


        [HttpPost("entrada")]
        public async Task<IActionResult> RegistrarEntrada([FromBody] int usuarioId)
        {
            var marcacao = new MarcacaoPonto
            {
                UsuarioId = usuarioId,
                DataHoraEntrada = DateTime.Now
            };

            _context.MarcacoesPonto.Add(marcacao);
            await _context.SaveChangesAsync();
            return Ok(marcacao);
        }
*/

        [HttpPost("entrada")]
        public async Task<IActionResult> RegistrarEntrada([FromBody] MarcacaoPontoModel model)
        {
            if (model.UsuarioId <= 0)
                return BadRequest("UsuarioId inválido");

            var marcacao = new MarcacaoPonto
            {
                UsuarioId = model.UsuarioId,
                DataHoraEntrada = DateTime.Now
            };

            _context.MarcacoesPonto.Add(marcacao);
            await _context.SaveChangesAsync();
            return Ok(marcacao);
        }

        public class MarcacaoPontoModel
        {
            public int UsuarioId { get; set; }
        }

        [HttpPost("saida/{id}")]
        public async Task<IActionResult> RegistrarSaida(int id)
        {
            if (id <= 0)
                return BadRequest("ID da marcação inválido");

            var marcacao = await _context.MarcacoesPonto.FindAsync(id);
            if (marcacao == null)
                return NotFound("Marcação não encontrada");

            marcacao.DataHoraSaida = DateTime.Now;
            await _context.SaveChangesAsync();
            return Ok(marcacao);
        }

        [HttpGet("usuario/{usuarioId}")]
        public async Task<IActionResult> GetMarcacoesUsuario(int usuarioId)
        {
            var marcacoes = await _context.MarcacoesPonto
                .Where(m => m.UsuarioId == usuarioId)
                .ToListAsync();
            return Ok(marcacoes);


        }

        [HttpGet("admin")]
        public async Task<IActionResult> GetTodasMarcacoes()
        {
            var marcacoes = await _context.MarcacoesPonto
                .Include(m => m.Usuario)
                .ToListAsync();
            return Ok(marcacoes);
        }
        /*
            thismacedo
            testando o end point abaixo, para extrair relatórios das marcações
            em csv, xls usando pacote - ClosedXML.
        */
        [HttpGet("export")]
        public async Task<IActionResult> ExportarParaExcel()
        {
            var marcacoes = await _context.MarcacoesPonto
                .Include(m => m.Usuario)
                .ToListAsync();

            using (var workbook = new XLWorkbook())
            {
                var worksheet = workbook.Worksheets.Add("Marcações");
                worksheet.Cell(1, 1).Value = "ID";
                worksheet.Cell(1, 2).Value = "Usuário";
                worksheet.Cell(1, 3).Value = "Entrada";
                worksheet.Cell(1, 4).Value = "Saída";

                for (int i = 0; i < marcacoes.Count; i++)
                {
                    worksheet.Cell(i + 2, 1).Value = marcacoes[i].Id;
                    worksheet.Cell(i + 2, 2).Value = marcacoes[i].Usuario.Nome;
                    worksheet.Cell(i + 2, 3).Value = marcacoes[i].DataHoraEntrada;
                    worksheet.Cell(i + 2, 4).Value = marcacoes[i].DataHoraSaida;
                }

                using (var stream = new MemoryStream())
                {
                    workbook.SaveAs(stream);
                    var content = stream.ToArray();
                    return File(content, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "marcacoes.xlsx");
                }
            }
        }
    }
}