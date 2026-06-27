const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://sailesh_magre:sailesh123@cluster0.wannuem.mongodb.net/skillset?retryWrites=true&w=majority&appName=Cluster0')
  .then(async () => {
    console.log('Connected to MongoDB');
    
    // Get the GalleryImage model
    const GalleryImage = require('./models/GalleryImage');
    
    // Find all images
    const all = await GalleryImage.find({});
    console.log('Total images:', all.length);
    
    // Delete all images that point to local uploads
    const result = await GalleryImage.deleteMany({ url: { $regex: '^/uploads/' } });
    console.log('Deleted local upload entries:', result.deletedCount);
    
    // Show remaining (Cloudinary) images
    const remaining = await GalleryImage.find({});
    console.log('Remaining images:', remaining.length);
    remaining.forEach(img => console.log(img.url));
    
    mongoose.disconnect();
    console.log('Done!');
  })
  .catch(err => console.error(err));

