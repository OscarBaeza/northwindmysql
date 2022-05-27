using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Duende.IdentityServer.EntityFramework.Options;
using northwindmysql.Models;

namespace northwindmysql.Data;

public partial class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
{
     
    public ApplicationDbContext(DbContextOptions options, IOptions<OperationalStoreOptions> operationalStoreOptions)
        : base(options, operationalStoreOptions)
    {
    }
   

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseMySql("server=localhost;port=3306;user=root;password=root;database=northwind", Microsoft.EntityFrameworkCore.ServerVersion.Parse("8.0.23-mysql"));
            }
        }

    
}
