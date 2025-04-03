namespace ecommerce.ViewModels
{
    public class Auth
    {
        public class RegisterModel
        {
            public string Email { get; set; }
            public string Password { get; set; }
            public string ConfirmPassword { get; set; }
        }

        // LoginModel for handling login data
        public class LoginModel
        {
            public string Email { get; set; }
            public string Password { get; set; }
        }
    }
}
