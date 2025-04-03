namespace ecommerce.Models
{
    public class Cart
    {
        public int Id { get; set; }
        public string UserId { get; set; } // Associate the cart with a specific user
        public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
    }


}
