using Microsoft.AspNetCore.Mvc;
using MiniHazine.API.DTOs;
using MiniHazine.API.Services;

namespace MiniHazine.API.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class AccountTransactionController : ControllerBase
	{
		private readonly TransactionService _transactionService;


		public AccountTransactionController(TransactionService transactionService)
		{
			_transactionService = transactionService;
		}
	}
}