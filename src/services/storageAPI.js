// Supabase Storage Service for Looklyy
// Handles image uploads and storage for the crawler

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://amcegyadzphuvqtlseuf.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFtY2VneWFkenBodXZxdGxzZXVmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTg1OTY4MTAsImV4cCI6MjA3NDE3MjgxMH0.geKae1U4qgI3JmJUPNQ5p7uho_dDy3NHC-0nEFJlP00'

const supabase = createClient(supabaseUrl, supabaseKey)

class StorageService {
  constructor() {
    this.bucketName = 'fashion-images'
  }

  // Upload image to Supabase storage
  async uploadImage(file, fileName) {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error:', error)
        return { success: false, error: error.message }
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.bucketName)
        .getPublicUrl(fileName)

      return {
        success: true,
        path: data.path,
        url: urlData.publicUrl
      }
    } catch (error) {
      console.error('Storage service error:', error)
      return { success: false, error: error.message }
    }
  }

  // Download image from URL and upload to storage
  async downloadAndStoreImage(imageUrl, fileName) {
    try {
      // Download image
      const response = await fetch(imageUrl)
      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.statusText}`)
      }

      const blob = await response.blob()
      
      // Upload to Supabase storage
      return await this.uploadImage(blob, fileName)
    } catch (error) {
      console.error('Download and store error:', error)
      return { success: false, error: error.message }
    }
  }

  // Get public URL for stored image
  getPublicUrl(fileName) {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(fileName)
    
    return data.publicUrl
  }

  // List all images in bucket
  async listImages() {
    try {
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .list()

      if (error) {
        console.error('List error:', error)
        return { success: false, error: error.message }
      }

      return { success: true, images: data }
    } catch (error) {
      console.error('List service error:', error)
      return { success: false, error: error.message }
    }
  }

  // Delete image from storage
  async deleteImage(fileName) {
    try {
      const { error } = await supabase.storage
        .from(this.bucketName)
        .remove([fileName])

      if (error) {
        console.error('Delete error:', error)
        return { success: false, error: error.message }
      }

      return { success: true }
    } catch (error) {
      console.error('Delete service error:', error)
      return { success: false, error: error.message }
    }
  }
}

// Create singleton instance
const storageService = new StorageService()

export default storageService
