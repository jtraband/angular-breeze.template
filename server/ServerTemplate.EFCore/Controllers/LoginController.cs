using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System.Security.Authentication;

namespace SCInsight.Web.Controllers {
  //[Route("api/[controller]")]
  [Route("api/[controller]/[action]")]
  public class LoginController : Controller {
    //private LoginControlContext GetLoginControlContext() {
    //  var connectionString = ConfigUtil.GetConnectionString("LoginControl");
    //  return new LoginControlContext(connectionString);
    //}

    
    [HttpPost]
    public AuthUser Login([FromBody] UserCredentials credentials) {
      LogoutInternal();
      var user = AuthenticateUser(credentials);
      return user; // need to select company

      //var claims = new List<Claim>();
      //claims.Add(new Claim(SecurityUtil.USERID, "" + user.UserLoginControlId));
      //claims.Add(new Claim(SecurityUtil.USERNAME, user.LoginName));
      //claims.Add(new Claim(SecurityUtil.COMPANY, user.CompanyCode));
      //var id = new ClaimsIdentity(claims, DefaultAuthenticationTypes.ApplicationCookie);

      //var ctx = HttpContext.Current.GetOwinContext();
      //var authenticationManager = ctx.Authentication;
      //authenticationManager.SignIn(id);
      //SecurityUtil.SetAuthUser(user);
      //return user;
    }

    [HttpGet, Authorize]
    public AuthUser GetLoggedInUser() {
      return null;
    }

    private AuthUser AuthenticateUser(UserCredentials credentials) {
      if (string.IsNullOrEmpty(credentials.UserName) || string.IsNullOrEmpty(credentials.Password)) {
        throw new AuthenticationException("Invalid UserName or Password");
      }
     
      //var credhash = SecurityUtil.ComputeHash(ulc.PasswordSalt + credentials.Password);
      //if (credhash != ulc.PasswordEncoded) {
      //  throw new AuthenticationException("Invalid UserName or Password");
      //}

      return MakeUser(credentials);
    }


    [HttpGet]
    public void Logout() {
      LogoutInternal();
    }

    private void LogoutInternal() {

    }

    [HttpGet, Authorize] 
    public string KeepAlive() { 
      return "ok";
    }

    //[HttpGet, Authorize]
    //public AuthUser GetLoggedInUser() {
    //  var context = GetLoginControlContext();
      
      
    //  var user = MakeUser(credentials);
      
    //  return user;
    //}

    /// <summary>
    /// Create a user object to be stored in session and sent to client
    /// </summary>
    /// <returns></returns>
    private AuthUser MakeUser(UserCredentials credentials) {
      // int timeout = (int)Startup.GetExpireTimeSpan().TotalMinutes;

      var user = new AuthUser() {
        LoginName = credentials.UserName,
        UserDisplayName = credentials.UserName,
        IsAdmin = true,
        SessionMinutes = 20,
      };


      return user;
    }

  }

  public class UserCredentials {
    public string UserName { get; set; }
    public string Password { get; set; }
  }

  public class AuthUser {
    public string ToJson() {
      var output = JsonConvert.SerializeObject(this);
      return output;
    }

    public static AuthUser FromJson(string json) {
      var authUser = JsonConvert.DeserializeObject<AuthUser>(json);
      return authUser;
    }

    public int UserTypeId { get; set; }
    public string LoginName { get; set; }
    public string UserDisplayName { get; set; }
    public bool IsAdmin { get; set; }
    public int SessionMinutes { get; set; }


  }


}
