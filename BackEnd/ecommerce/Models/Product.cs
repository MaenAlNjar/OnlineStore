using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ecommerce.Models
{

    public enum ProductTag
    {
        None = 0,    
     BestSale = 1,
        TopRated = 2,
        OnSale = 3,
        Featured = 4
    }
    public class Product
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        [JsonIgnore]
        [BindNever]
        public int Id { get; set; }

        [MaxLength(100, ErrorMessage = "Name cannot exceed 100 characters.")]
        public string? Name { get; set; }

        [MaxLength(500, ErrorMessage = "Description cannot exceed 500 characters.")]
        public string? Description { get; set; }

        [Range(0.01, double.MaxValue, ErrorMessage = "Price must be greater than zero.")]
        public decimal? Price { get; set; }

        public string? Image { get; set; }

        [NotMapped]
        public IFormFile? ImageUrl { get; set; }

        [Required(ErrorMessage = "CategoryId is required.")]
        public int? CategoryId { get; set; }

        [ForeignKey("CategoryId")]
        [JsonIgnore]
        [BindNever] // Add this to prevent model binding
        public virtual Category? Category { get; set; } // Make nullable and virtual 
        public ProductTag Tag { get; set; }
    }

}
