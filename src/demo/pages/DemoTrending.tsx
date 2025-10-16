import React, { useState, useEffect } from 'react'
import { useDemoMode } from '../DemoProvider'

export const DemoTrending: React.FC = () => {
  const { trendingImages, toggleHeart } = useDemoMode()
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [displayedImages, setDisplayedImages] = useState(trendingImages.slice(0, 12))
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    // Filter images based on selected category
    let filtered = trendingImages
    if (selectedCategory !== 'All') {
      filtered = trendingImages.filter(img => 
        img.category.toLowerCase().replace('-', ' ') === selectedCategory.toLowerCase().replace('-', ' ')
      )
    }
    setDisplayedImages(filtered.slice(0, 12))
    setHasMore(filtered.length > 12)
  }, [selectedCategory, trendingImages])

  const loadMore = () => {
    const currentLength = displayedImages.length
    const filtered = selectedCategory === 'All' 
      ? trendingImages 
      : trendingImages.filter(img => 
          img.category.toLowerCase().replace('-', ' ') === selectedCategory.toLowerCase().replace('-', ' ')
        )
    
    const nextImages = filtered.slice(0, currentLength + 12)
    setDisplayedImages(nextImages)
    setHasMore(nextImages.length < filtered.length)
  }

  const categories = [
    { name: 'All', count: trendingImages.length },
    { name: 'Runway', count: trendingImages.filter(img => img.category === 'runway').length },
    { name: 'Street Style', count: trendingImages.filter(img => img.category === 'street-style').length },
    { name: 'Trends', count: trendingImages.filter(img => img.category === 'trends').length }
  ]

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 25%, #e9d5ff 50%, #ddd6fe 75%, #c4b5fd 100%)' }}>
      {/* Header */}
      <div className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Trending Now
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">
                {displayedImages.length} looks
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category.name}
                onClick={() => setSelectedCategory(category.name)}
                className={`px-4 py-2 rounded-full font-medium text-sm whitespace-nowrap transition-all ${
                  selectedCategory === category.name
                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} <span className="text-xs opacity-75">({category.count})</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Image Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {displayedImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              style={{
                animation: `fadeIn 0.5s ease-out ${index * 0.05}s both`
              }}
            >
              {/* Image */}
              <div className="aspect-[3/4] overflow-hidden bg-gray-100">
                <img
                  src={image.original_url}
                  alt={image.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  loading="lazy"
                />
              </div>

              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <h3 className="text-white font-semibold text-sm mb-1">
                    {image.title}
                  </h3>
                  <p className="text-white/80 text-xs line-clamp-2">
                    {image.description}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-white/60 capitalize">
                      {image.category.replace('-', ' ')}
                    </span>
                    <span className="text-xs text-yellow-400">
                      ⭐ {Math.round(image.trendScore * 100)}%
                    </span>
                  </div>
                </div>
              </div>

              {/* Heart Button */}
              <div
                onClick={() => toggleHeart(image.id)}
                className="absolute top-3 right-3 icon-container z-10"
              >
                <svg viewBox="0 0 24 24" className={`heart-icon ${image.is_heart_marked ? 'icon-filled' : 'icon-outline'}`}>
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </div>

              {/* Category Badge */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-white/90 backdrop-blur-sm text-xs font-medium text-gray-700">
                {image.subcategory?.replace('-', ' ') || image.category}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {hasMore && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMore}
              className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Load More Looks
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
