// components/RestaurantMap.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { UserRestaurant } from '@/lib/api/restaurants'
import { Loader } from '@googlemaps/js-api-loader'

interface RestaurantMapProps {
  restaurants: UserRestaurant[]
  center?: { lat: number; lng: number }
  zoom?: number
  onMarkerClick?: (restaurant: UserRestaurant) => void
}

export function RestaurantMap({
  restaurants,
  center = { lat: 59.3293, lng: 18.0686 }, // Stockholm default
  zoom = 12,
  onMarkerClick,
}: RestaurantMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load Google Maps
  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
      version: 'weekly',
    })

    loader.load().then(() => {
      setIsLoaded(true)
    })
  }, [])

  // Initialize map
  useEffect(() => {
    if (!isLoaded || !mapRef.current || mapInstanceRef.current) return

    mapInstanceRef.current = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: true,
    })
  }, [isLoaded, center, zoom])

  // Update markers
  useEffect(() => {
    if (!mapInstanceRef.current || !isLoaded) return

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null))
    markersRef.current = []

    // Add new markers
    restaurants.forEach((userRestaurant) => {
      const { restaurant, status } = userRestaurant

      if (!restaurant.latitude || !restaurant.longitude) return

      const marker = new google.maps.Marker({
        position: {
          lat: restaurant.latitude,
          lng: restaurant.longitude,
        },
        map: mapInstanceRef.current,
        title: restaurant.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: status === 'WantToGo' ? '#14b8a6' : '#f97316', // teal or orange
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        },
      })

      marker.addListener('click', () => {
        onMarkerClick?.(userRestaurant)
      })

      markersRef.current.push(marker)
    })
  }, [restaurants, isLoaded, onMarkerClick])

  return (
    <div className="relative w-full h-full">
      <div ref={mapRef} className="w-full h-full" />
      
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}