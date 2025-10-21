export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method === 'GET') {
    // Return API documentation and example usage
    return res.status(200).json({
      success: true,
      message: 'Homepage Demo Images API',
      endpoints: {
        upload: '/api/homepage-demo-images/upload',
        get: '/api/homepage-demo-images/get',
        test: '/api/homepage-demo-images/test'
      },
      uploadFormat: {
        method: 'POST',
        body: {
          images: [
            {
              url: 'https://example.com/image1.jpg',
              name: 'Image 1',
              alt: 'Description for image 1'
            },
            {
              base64: 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ...',
              name: 'Image 2',
              alt: 'Description for image 2'
            }
            // ... up to 25 images
          ]
        }
      },
      structure: {
        sliders: 5,
        imagesPerSlider: 5,
        totalImages: 25,
        sliderTypes: [
          'slider1 - Minimalist Chic',
          'slider2 - Autumn Elegance', 
          'slider3 - Street Style Edge',
          'slider4 - Classic Revival',
          'slider5 - Power Dressing'
        ]
      }
    })
  }

  if (req.method === 'POST') {
    // Test endpoint - simulate a successful response
    return res.status(200).json({
      success: true,
      message: 'Test endpoint reached successfully',
      received: req.body,
      timestamp: new Date().toISOString()
    })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
