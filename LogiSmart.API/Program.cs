using System.Text;
using LogiSmart.Application.Services;
using LogiSmart.Core.Interfaces;
using LogiSmart.Infrastructure.Data;
using LogiSmart.Infrastructure.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.OpenApi.Models;


var builder = WebApplication.CreateBuilder(args);

// --- Database Configuration ---
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// --- Repository Pattern & Services ---
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<TripService>();
builder.Services.AddScoped<VehicleService>();

// --- JWT Authentication Configuration ---
// appsettings.json dosyasındaki "Jwt" altındaki değerleri alıyoruz
var jwtSecret = builder.Configuration["Jwt:Secret"] ?? throw new InvalidOperationException("JWT Secret bulunamadı!");
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

// CRITICAL: Türkçe karakterler ('ı') olduğu için mutlaka UTF8 kullanmalısın. 
// ASCII kullanırsan imza asla doğrulanmaz.
var key = Encoding.UTF8.GetBytes(jwtSecret);

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        // 1. İmza doğrulaması
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(key),
        
        // 2. Yayıncı doğrulaması (appsettings'teki "LogiSmartAPI")
        ValidateIssuer = true,
        ValidIssuer = jwtIssuer,
        
        // 3. Hedef kitle doğrulaması (appsettings'teki "LogiSmartClient")
        ValidateAudience = true,
        ValidAudience = jwtAudience,
        
        // 4. Zaman aşımı kontrolü
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero // 5 dakikalık toleransı sıfırlıyoruz (anlık kontrol)
    };
});

builder.Services.AddAuthorization();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();

// --- Swagger Configuration ---
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "LogiSmart API", Version = "v1" });

    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme."
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme, // Hata veren satır
                    Id = "Bearer"                       // Hata veren satır
                }
            },
            Array.Empty<string>()
        }
    });
});

// --- 1. Politika Tanımı (builder.Build'dan önce) ---
builder.Services.AddCors(options =>
{
    options.AddPolicy("DefaultPolicy", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
    });
});

var app = builder.Build();

// --- 2. Middleware Sıralaması (Burası ÇOK KRİTİK) ---

// Hata ayıklama sayfası (Geliştirme modundaysan)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// DİKKAT: Sıralama aynen bu şekilde olmalı!
app.UseRouting(); // 1. Önce yolu belirle

app.UseCors("DefaultPolicy"); // 2. Sonra CORS kapısını aç (Routing'den hemen sonra)

app.UseAuthentication(); // 3. Kimlik doğrulama
app.UseAuthorization();  // 4. Yetkilendirme

app.MapControllers(); // 5. En son kontrolcülere git

app.Run();