using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using northwindmysql.Data;
using northwindmysql.Models;

namespace northwindmysql.Controllers
{
    [Authorize(Policy = "RequireAdminRole")]
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class MovementsController : ControllerBase
    {
        private readonly NorthwindContext _context;

        public MovementsController(NorthwindContext context)
        {
            _context = context;
        }

        // GET: api/Movements
        [HttpGet]
        public  IEnumerable<Movement> GetMovements()
        {
           return _context.Movements.Where(e=>e.EmployeeId==18);
        }

        // GET: api/Movements/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Movement>> GetMovement(int id)
        {
          if (_context.Movements == null)
          {
              return NotFound();
          }
            var movement = await _context.Movements.FindAsync(id);

            if (movement == null)
            {
                return NotFound();
            }

            return movement;
        }

        // PUT: api/Movements/5
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPut("{id}")]
        public async Task<IActionResult> PutMovement(int id, Movement movement)
        {
            if (id != movement.MovementId)
            {
                return BadRequest();
            }

            _context.Entry(movement).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!MovementExists(id))
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

        // POST: api/Movements
        // To protect from overposting attacks, see https://go.microsoft.com/fwlink/?linkid=2123754
        [HttpPost]
        public async Task<ActionResult<Movement>> PostMovement(Movement movement)
        {
            /*var movimiento = new Movement(){
                MovementId=movementRequest.MovementId,
                Date = movementRequest.Date,
                OriginWarehouseId = movementRequest.OriginWarehouseId,
                Type = movementRequest.Type,
                CompanyId = movementRequest.CompanyId,
                EmployeeId = movementRequest.EmployeeId
            };*/
            if (_context.Movements == null)
          {
              return Problem("Entity set 'ApplicationDbContext.Movements'  is null.");
          }
            _context.Movements.Add(movement);
            
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetMovement", new { id = movement.MovementId }, movement);
        }

        // DELETE: api/Movements/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMovement(int id)
        {
            if (_context.Movements == null)
            {
                return NotFound();
            }
            var movement = await _context.Movements.FindAsync(id);
            if (movement == null)
            {
                return NotFound();
            }

            _context.Movements.Remove(movement);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool MovementExists(int id)
        {
            return (_context.Movements?.Any(e => e.MovementId == id)).GetValueOrDefault();
        }
    }
}
