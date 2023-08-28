using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Hosting;

namespace kaban_board
{
    public class Program
    {
        public static void Main(string[] args)
        {
            CreateHostBuilder(args).Build().Run();
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}


public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    // ...

    public void ConfigureServices(IServiceCollection services)
    {
        // Add a service for DbContext with the database provider and connection string
        services.AddDbContext<AppDbContext>(options =>
            options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

        // ... other services configuration

        // Add MVC services
        services.AddControllersWithViews();
    }

    // ...

    public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    {
        // ...

        if (env.IsDevelopment())
        {
            app.UseDeveloperExceptionPage();
            
        }
        else
        {
            app.UseExceptionHandler("/Home/Error");
            app.UseHsts();
        }

        // ...

        app.UseHttpsRedirection();
        app.UseStaticFiles();

        app.UseRouting();

        // ...

        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");
        });
    }
}
