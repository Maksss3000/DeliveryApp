
using SixLabors.ImageSharp;
using SixLabors.ImageSharp.Processing;

namespace DeliveryAPI.Data
{
    public class FileSaver
    {
        public static async Task SaveFileAsync(string webRootPath, IFormFile file)
        {
           
            string uploadsDir = Path.Combine(webRootPath, "Images/Restaurants");

            // wwwroot/images/restaurants
            if (!Directory.Exists(uploadsDir))
                Directory.CreateDirectory(uploadsDir);

            string fileName = file.FileName;
            string fullPath = Path.Combine(uploadsDir, fileName);

          
            using var stream = new FileStream(fullPath, FileMode.Create, FileAccess.Write);
            Console.WriteLine("File is", file);
            await file.CopyToAsync(stream);
            await stream.FlushAsync();
        }
    }
}
