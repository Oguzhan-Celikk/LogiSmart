using LogiSmart.Core.Entities;
using LogiSmart.Core.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LogiSmart.API.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "FinanceSpecialist,Admin")]
public class InvoiceController : ControllerBase
{
    private readonly IUnitOfWork _uow;

    public InvoiceController(IUnitOfWork uow) => _uow = uow;

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var invoices = await _uow.Invoices.GetAllAsync();
        return Ok(invoices);
    }

    [HttpPost]
    public async Task<IActionResult> CreateInvoice([FromBody] Invoice invoice)
    {
        // BUSINESS RULE: Trip must be Delivered before invoicing
        var trip = await _uow.Trips.GetByIdAsync(invoice.TripId);
        if (trip == null) return NotFound(new { message = "Trip not found." });
        if (trip.Status != Core.Enums.TripStatus.Delivered)
            return BadRequest(new { message = "Invoice can only be created for delivered trips." });

        invoice.InvoiceNumber = $"INV-{DateTime.UtcNow:yyyyMM}-{new Random().Next(10000, 99999)}";
        invoice.TotalAmount = invoice.FuelCost + invoice.DriverAllowance
                                               + invoice.MaintenanceCost + invoice.ServiceFee;

        await _uow.Invoices.AddAsync(invoice);
        await _uow.SaveChangesAsync();
        return Created("", invoice);
    }

    [HttpPatch("{id:int}/mark-paid")]
    public async Task<IActionResult> MarkAsPaid(int id)
    {
        var invoice = await _uow.Invoices.GetByIdAsync(id);
        if (invoice == null) return NotFound();

        invoice.IsPaid = true;
        invoice.PaidDate = DateTime.UtcNow;
        _uow.Invoices.Update(invoice);
        await _uow.SaveChangesAsync();
        return Ok(new { message = "Invoice marked as paid." });
    }
}