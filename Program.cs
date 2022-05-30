using System.Security.Claims;
using IdentityModel;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI;
using Microsoft.EntityFrameworkCore;
using northwindmysql.Data;
using northwindmysql.Models;

var builder = WebApplication.CreateBuilder(args);
//Dbcontexmysql
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseMySql("server=localhost;database=Northwind;port=3306;uid=root;pwd=root",ServerVersion.Parse("8.0.23-mysql")));

builder.Services.AddDbContext<NorthwindContext>(options =>
    options.UseMySql("server=localhost;database=Northwind;port=3306;uid=root;pwd=root",ServerVersion.Parse("8.0.23-mysql")));

// Add services to the container.
/*var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlite(connectionString));*/
builder.Services.AddDatabaseDeveloperPageExceptionFilter();

//builder.Services.AddDefaultIdentity<ApplicationUser>(options => options.SignIn.RequireConfirmedAccount = true)
    //.AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddDefaultIdentity<ApplicationUser>
    (options => options.SignIn.RequireConfirmedAccount = true)
    .AddRoles<IdentityRole>()
        .AddEntityFrameworkStores<ApplicationDbContext>();

//builder.Services.AddIdentityServer()
    //.AddApiAuthorization<ApplicationUser, ApplicationDbContext>();
builder.Services.AddIdentityServer()
    .AddApiAuthorization<ApplicationUser, ApplicationDbContext>(
        x => {
            x.IdentityResources.Add(new Duende.IdentityServer.Models.IdentityResource(
                "roles", "Roles", new []{JwtClaimTypes.Role, ClaimTypes.Role}
            ));
            foreach(var c in x.Clients)
            {
                c.AllowedScopes.Add("roles");
            }
            foreach (var a in x.ApiResources)
            {
                a.UserClaims.Add(JwtClaimTypes.Role);
            }
        }
    )
    // .AddProfileService<ProfileService>()
    ;

builder.Services.AddAuthentication()
    .AddIdentityServerJwt();

//
   
builder.Services.AddAuthorization(options =>
{
     options.AddPolicy("RequireAdminRole", policy =>
     {
          policy.RequireClaim(ClaimTypes.Role, new String[] { "ADMINISTRADOR","GERENTE" });
     });
});
//

builder.Services.AddControllersWithViews();
builder.Services.AddRazorPages();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    var context = services.GetRequiredService<NorthwindContext>();
    context.Database.Migrate();

    await seedData.Initialize(services,"Passw0rd!"); 
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseMigrationsEndPoint();
}
else
{
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseIdentityServer();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");
app.MapRazorPages();

app.MapFallbackToFile("index.html");;

app.Run();
