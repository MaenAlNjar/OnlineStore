using System.Security.Cryptography.X509Certificates;

namespace ecommerce.Models
{
    public class WishList
    {
        public int Id { get; set; }
        public string UserId { get; set; }

        public int ProductId { get; set; } // Foreign Key

        public Product Product { get; set; } // Navigation Property
    }

}
