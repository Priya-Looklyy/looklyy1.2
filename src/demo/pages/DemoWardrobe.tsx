import React from 'react'
import { useDemoMode } from '../DemoProvider'

export const DemoWardrobe: React.FC = () => {
  const { wardrobeImages, toggleHeart } = useDemoMode()

  if (wardrobeImages.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 25%, #e9d5ff 50%, #ddd6fe 75%, #c4b5fd 100%)' }}>
        <div className="text-center max-w-md">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <svg className="w-12 h-12 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Wardrobe is Empty</h2>
          <p className="text-gray-600 mb-6">
            Start adding looks you love by tapping the heart icon on trending images
          </p>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault()
              window.dispatchEvent(new CustomEvent('navigate-trending'))
            }}
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
          >
            Explore Trending
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 25%, #e9d5ff 50%, #ddd6fe 75%, #c4b5fd 100%)' }}>
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                My Wardrobe
              </h1>
              <p className="text-gray-600 mt-1">
                {wardrobeImages.length} saved {wardrobeImages.length === 1 ? 'look' : 'looks'}
              </p>
            </div>
            <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium text-gray-700 transition-all">
              Share Collection
            </button>
          </div>
        </div>
      </div>

      {/* Wardrobe Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {wardrobeImages.map((image, index) => (
            <div
              key={image.id}
              className="group relative bg-white rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300"
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

              {/* Overlay */}
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
                  </div>
                </div>
              </div>

              {/* Remove Button */}
              <button
                onClick={() => toggleHeart(image.id)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-red-500 backdrop-blur-sm flex items-center justify-center shadow-lg hover:bg-red-600 hover:scale-110 transition-all duration-200 z-10"
              >
                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              </button>

              {/* Saved Badge */}
              <div className="absolute top-3 left-3 px-2 py-1 rounded-full bg-green-500/90 backdrop-blur-sm text-xs font-medium text-white flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                Saved
              </div>
            </div>
          ))}
        </div>
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
