import React from 'react'
import './Closet.css'

const Closet = () => {
  // 7 closet images - similar to homepage layout
  const closetImages = [
    {
      id: 1,
      url: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=600&fit=crop&auto=format&q=80',
      alt: 'Casual Denim Look'
    },
    {
      id: 2,
      url: 'https://images.unsplash.com/photo-1571945153237-4929e783af4a?w=400&h=600&fit=crop&auto=format&q=80',
      alt: 'Elegant Blazer'
    },
    {
      id: 3,
      url: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=600&fit=crop&auto=format&q=80',
      alt: 'Summer Dress'
    },
    {
      id: 4,
      url: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop&auto=format&q=80',
      alt: 'Winter Coat'
    },
    {
      id: 5,
      url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=600&fit=crop&auto=format&q=80',
      alt: 'Formal Suit'
    },
    {
      id: 6,
      url: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=600&fit=crop&auto=format&q=80',
      alt: 'Evening Gown'
    },
    {
      id: 7,
      url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5e?w=400&h=600&fit=crop&auto=format&q=80',
      alt: 'Street Style'
    }
  ]

  return (
    <div className="closet-page">
      <div className="closet-images-container">
        {closetImages.map(image => (
          <div key={image.id} className="closet-image-item">
            <img 
              src={image.url} 
              alt={image.alt}
              className="closet-image"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default Closet
