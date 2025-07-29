"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"

export default function GalleryPage() {
  const [selectedImage, setSelectedImage] = useState(null)

  // Mock gallery data
  const galleryItems = [
    {
      id: 1,
      title: "Medical Camp in Anuradhapura",
      category: "Medical Assistance",
      image: "/placeholder.svg?height=400&width=600",
      description: "Free medical checkups provided to rural communities",
    },
    {
      id: 2,
      title: "School Renovation Project",
      category: "Education",
      image: "/placeholder.svg?height=400&width=600",
      description: "Renovating classrooms in underserved schools",
    },
    {
      id: 3,
      title: "Community Health Workshop",
      category: "Health Education",
      image: "/placeholder.svg?height=400&width=600",
      description: "Teaching preventive healthcare practices",
    },
    {
      id: 4,
      title: "Volunteer Training Session",
      category: "Training",
      image: "/placeholder.svg?height=400&width=600",
      description: "Training new volunteers for our programs",
    },
    {
      id: 5,
      title: "Emergency Relief Distribution",
      category: "Emergency Aid",
      image: "/placeholder.svg?height=400&width=600",
      description: "Distributing relief supplies to flood victims",
    },
    {
      id: 6,
      title: "Children's Health Program",
      category: "Child Welfare",
      image: "/placeholder.svg?height=400&width=600",
      description: "Health screening for children in rural areas",
    },
  ]

  const categories = ["All", ...new Set(galleryItems.map((item) => item.category))]
  const [activeCategory, setActiveCategory] = useState("All")

  const filteredItems =
    activeCategory === "All" ? galleryItems : galleryItems.filter((item) => item.category === activeCategory)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Gallery</h1>
          <p className="text-xl max-w-3xl mx-auto">
            See our work in action through photos from our various programs and events across Sri Lanka.
          </p>
        </div>
      </section>

      {/* Filter Buttons */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={
                  activeCategory === category
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <Card
                key={item.id}
                className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => setSelectedImage(item)}
              >
                <div className="h-64 bg-gray-200">
                  <img
                    src={item.image || "/placeholder.svg"}
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="mb-2">
                    <span className="inline-block bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                      {item.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="relative max-w-4xl max-h-full">
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 text-white hover:bg-white hover:bg-opacity-20 z-10"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-6 w-6" />
            </Button>
            <img
              src={selectedImage.image || "/placeholder.svg"}
              alt={selectedImage.title}
              className="max-w-full max-h-full object-contain rounded-lg"
            />
            <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-75 text-white p-4 rounded-b-lg">
              <h3 className="text-xl font-semibold mb-2">{selectedImage.title}</h3>
              <p className="text-gray-300">{selectedImage.description}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
