using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using northwindmysql.Data;
using northwindmysql.Models;

namespace northwindmysql.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly NorthwindContext _context;

        public ProductsController(NorthwindContext context)
        {
            _context = context;
        }

        //GET: api/Products/top5byYear
        [HttpGet]
        [Route("top5year/{anio}/{trimestre}")]
        public IEnumerable<Object> GetTop5(int anio, int trimestre) {
            DateTime dateTime1 = new DateTime();
            DateTime dateTime2 = new DateTime();
            if (trimestre == 1)
            {
                dateTime1 = new DateTime(anio, 1, 1);
                dateTime2 = new DateTime(anio, 3, 31);
            }
            if (trimestre == 2)
            {
                dateTime1 = new DateTime(anio, 4, 1);
                dateTime2 = new DateTime(anio, 6, 30);
            }
            if (trimestre == 3)
            {
                dateTime1 = new DateTime(anio, 7, 1);
                dateTime2 = new DateTime(anio, 9, 30);
            }
            if (trimestre == 4)
            {
                dateTime1 = new DateTime(anio, 10, 1);
                dateTime2 = new DateTime(anio, 12, 31);
            }


            return _context.Products.Where(e => e.CompanyId == 1)
                .Join(_context.Movementdetails,
                p => p.ProductId,
                md => md.ProductId,
                (p, md) => new
                {
                    Nombre = p.ProductName,
                    Movimientoid = md.MovementId,
                    Cantidad = md.Quantity
                })
                .Join(_context.Movements,
                md => md.Movimientoid,
                m => m.MovementId,
                (md, m) => new
                {
                    Nombre = md.Nombre,
                    Cantidad = md.Cantidad,
                    Anio = m.Date.Year,
                    Tipo = m.Type,
                    Fecha = m.Date
                }).
                Where(m => m.Anio == anio).Where(e => e.Tipo == "VENTA").Where(f => f.Fecha >= dateTime1 && f.Fecha <= dateTime2)
                .GroupBy(e => e.Nombre)
                .Select(e => new
                {
                    Producto = e.Key,
                    Ventas = e.Sum(g => g.Cantidad),
                    
                })
                .OrderByDescending(e => e.Ventas).Take(5);

        
        }

        //REPORTE1

        [HttpGet] 
        [Route("top5productos/{year}")]
        public IEnumerable<Object> GetTop5Ventas(int year)
        {
            var topVentas = _context.Movements
            .Join(_context.Movementdetails, m => m.MovementId, md => md.MovementId, (m, md) => new { pID = md.ProductId, fecha = m.Date, md.Quantity, tipo = m.Type })
            .Where(p => p.tipo == "VENTA" && p.fecha.Year == year)
            .GroupBy(p => p.pID)
            .Select(g => new { g.Key, ventas = g.Sum(p => p.Quantity) })
            .OrderByDescending(p => p.ventas)
            .Take(5);

            var ids = topVentas.Select(t => t.Key);

            var topElementos = _context.Movements
            .Join(_context.Movementdetails, m => m.MovementId, md => md.MovementId, (m, md) => new { pID = md.ProductId, fecha = m.Date, md.Quantity, tipo = m.Type })
            .Join(_context.Products, prev => prev.pID, act => act.ProductId, (prev, act) => new { pID = prev.pID, prod = act.ProductName, prev.fecha, prev.Quantity, prev.tipo })
            .Where(p => p.tipo == "VENTA" && p.fecha.Year == year)
            .Select(p => new { p.pID, p.prod, p.tipo, trimestre = Math.Ceiling(p.fecha.Month / 3f), p.Quantity })
            .Where(p => ids.Contains(p.pID))
            .GroupBy(p => new { p.prod, p.trimestre })
            .Select(g => new { prod = g.Key.prod, trimestre = g.Key.trimestre, ventas = g.Sum(p => p.Quantity) });

            return topElementos;
        }

        //TERMINAREPORTE2

        //REPORTE

        [HttpGet("productoPorMes/{year}/{productId}")]
        public IActionResult GetListadoPorMes(int year, int productId)
        {
            var dbContext = _context;
            var resultado = (from p in dbContext.Products
                             join md in dbContext.Movementdetails on p.ProductId equals md.ProductId
                             join m in dbContext.Movements on md.MovementId equals m.MovementId
                             where m.Date.Year == year && m.CompanyId == 1 && p.ProductId == productId
                             select new { p.ProductName, md.Quantity, m.Date } into x
                             group x by new { x.Date.Month } into n
                             select new
                             {
                                 Mes = n.First().Date.Month,
                                 Cantidad = n.Sum(c => c.Quantity)
                             }).OrderBy(c => c.Mes);

            return Ok(resultado);
        }


        //TERMINA REPORTE



        // GET: api/Products
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
          if (_context.Products == null)
          {
              return NotFound();
          }
            return await _context.Products.ToListAsync();
        }

        // GET: api/Products/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
          if (_context.Products == null)
          {
              return NotFound();
          }
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }

            return product;
        }

        // PUT: api/Products/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.ProductId)
            {
                return BadRequest();
            }

            _context.Entry(product).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        // POST: api/Products
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
          if (_context.Products == null)
          {
              return Problem("Entity set 'NorthwindContext.Products'  is null.");
          }
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = product.ProductId }, product);
        }

        // DELETE: api/Products/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteProduct(int id)
        {
            if (_context.Products == null)
            {
                return NotFound();
            }
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ProductExists(int id)
        {
            return (_context.Products?.Any(e => e.ProductId == id)).GetValueOrDefault();
        }
    }
}