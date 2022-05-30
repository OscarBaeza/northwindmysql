using Microsoft.AspNetCore.Identity;
using northwindmysql.Models;
namespace northwindmysql.Data;


public static class seedData
{
    public static async Task Initialize(IServiceProvider serviceProvider, String testUserpw)
    {
        using (var context = 
        serviceProvider.GetRequiredService<NorthwindContext>())
    {
        // For sample purposes seed both with the same password.
        // Password is set with the following:
        // dotnet user-secrets set SeedUserPW <pw>
        // The admin user can do anything
        
         var u2 = await EnsureUser(serviceProvider,"Oscar9_","oscar_sagitario@hotmail.com");
        await EnsureRole(serviceProvider,u2,"ADMINISTRADOR");
        var adminID = await EnsureUser(serviceProvider, testUserpw, "admin@contoso.com");
        await EnsureRole(serviceProvider, adminID, "ADMINISTRADOR");

        // allowed user can create and edit contacts that they create
        var managerID = await EnsureUser(serviceProvider, testUserpw, "manager@contoso.com");
        await EnsureRole(serviceProvider, managerID, "GERENTE");

        //SeedDB(context, adminID);
    }
    }

    private static async Task<string> EnsureUser(IServiceProvider serviceProvider,
                                            string testUserPw, string UserName)
    {
        var userManager = serviceProvider.GetService<UserManager<ApplicationUser>>();

    
        var user = await userManager.FindByNameAsync(UserName);
        if (user == null)
            {
                user = new ApplicationUser
                    {
                        UserName = UserName,
                        EmailConfirmed = true
                    };
                await userManager.CreateAsync(user, testUserPw);
            }

        if (user == null)
            {
                throw new Exception("The password is probably not strong enough!");
            }

    return user.Id;
    }

    private static async Task<IdentityResult> EnsureRole(IServiceProvider serviceProvider,
                                                              string uid, string role)
        {
            var roleManager = serviceProvider.GetService<RoleManager<IdentityRole>>();

            if (roleManager == null)
            {
                throw new Exception("roleManager null");
            }

            IdentityResult IR;
            if (!await roleManager.RoleExistsAsync(role))
            {
                IR = await roleManager.CreateAsync(new IdentityRole(role));
            }

            var userManager = serviceProvider.GetService<UserManager<ApplicationUser>>();

            //if (userManager == null)
            //{
            //    throw new Exception("userManager is null");
            //}

            var user = await userManager.FindByIdAsync(uid);

            if (user == null)
            {
                throw new Exception("The testUserPw password was probably not strong enough!");
            }

            IR = await userManager.AddToRoleAsync(user, role);

            return IR;
        }

}

