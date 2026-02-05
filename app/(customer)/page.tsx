"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Clock,
  MapPin,
  Utensils,
  Package,
  Star,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
// import { categories, menuItems } from "@/lib/mock-data";
import { MenuItemCard } from "@/components/customer/menu-item-card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { apiClient, Category, MenuItemWithCategory } from "@/lib/api-client";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItemWithCategory[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [categoriesData, menuItemsData] = await Promise.all([
          apiClient.getCategories(),
          apiClient.getMenuItems({ availableOnly: true })
        ])
        setCategories(categoriesData)
        setMenuItems(menuItemsData)
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const featuredItems = menuItems.slice(0, 4)

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-sidebar text-sidebar-foreground overflow-hidden min-h-[600px] flex items-center">
        {/* Hero Background Image Placeholder */}
        <div className="absolute inset-0">
          <div className="relative w-full h-full bg-sidebar">
            {/* Replace this div with your hotel image */}
            {/* <div className="absolute inset-0 bg-gradient-to-r from-sidebar via-sidebar/95 to-sidebar/70 z-10" /> */}
            <Image
              src="/assets/hotel_8.png"
              alt="A descriptive alt text"
              fill
              style={{ objectFit: "cover", opacity: 0.3 }} // Equivalent to background-size: cover
              priority // Optional: preloads image for LCP (Largest Contentful Paint)
            />
          </div>
        </div>

        <div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 lg:py-32 relative z-20"
          style={{ background: "../as" }}
        >
          <AnimatedSection animation="fade-up" className="max-w-2xl">
            <p className="text-sidebar-primary font-medium mb-4 text-sm tracking-wider uppercase">
              Welcome to Hotel Sonaee Veg Restaurant
            </p>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance leading-tight">
              Fine Dining,{" "}
              <span className="text-sidebar-primary">Delivered Fresh</span>
            </h1>
            <p className="text-lg text-sidebar-foreground/80 mb-8 leading-relaxed">
              Experience our exquisite cuisine from the comfort of your home.
              Order takeaway online or reserve a table for an unforgettable
              dining experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/menu">
                <Button size="lg" className="gap-2">
                  View Menu
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-sidebar-foreground/20 text-sidebar-foreground hover:bg-sidebar-accent bg-transparent"
                >
                  Reserve a Table
                </Button>
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Utensils,
                title: "Fresh Ingredients",
                desc: "Locally sourced, daily prepared",
              },
              {
                icon: Clock,
                title: "Quick Preparation",
                desc: "Ready in 20-30 minutes",
              },
              {
                icon: Package,
                title: "Safe Packaging",
                desc: "Eco-friendly containers",
              },
              {
                icon: MapPin,
                title: "Easy Pickup",
                desc: "Convenient curbside service",
              },
            ].map((feature, i) => (
              <AnimatedSection key={i} animation="fade-up" delay={i * 100}>
                <Card className="bg-card border-border h-full">
                  <CardContent className="p-6 text-center">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-card-foreground mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {feature.desc}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Hotel Gallery Section */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Our Hotel
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              A perfect blend of luxury, comfort, and culinary excellence
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Main Large Image */}
            <AnimatedSection
              animation="fade-up"
              delay={0}
              className="md:col-span-2 lg:col-span-2"
            >
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-muted border-6">
                  <Image
                    src="/assets/hotel_7.png"
                    alt="A descriptive alt text"
                    fill // Fills the parent container
                    style={{ objectFit: "cover" }} // Equivalent to background-size: cover
                    priority // Optional: preloads image for LCP (Largest Contentful Paint)
                  />
              </div>
            </AnimatedSection>

            {/* Side Images */}
            <AnimatedSection animation="fade-up" delay={100}>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border-6">
                <Image
                    src="/assets/hotel_4.png"
                    alt="A descriptive alt text"
                    fill // Fills the parent container
                    style={{ objectFit: "cover" }} // Equivalent to background-size: cover
                    priority // Optional: preloads image for LCP (Largest Contentful Paint)
                  />
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={200}>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border-6">
                <Image
                    src="/assets/hotel_3.png"
                    alt="A descriptive alt text"
                    fill // Fills the parent container
                    style={{ objectFit: "cover" }} // Equivalent to background-size: cover
                    priority // Optional: preloads image for LCP (Largest Contentful Paint)
                  />
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-up" delay={300}>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border-6">
                <Image
                    src="/assets/hotel_1.png"
                    alt="A descriptive alt text"
                    fill // Fills the parent container
                    style={{ objectFit: "cover" }} // Equivalent to background-size: cover
                    priority // Optional: preloads image for LCP (Largest Contentful Paint)
                  />
              </div>
            </AnimatedSection>
            <AnimatedSection animation="fade-up" delay={300}>
              <div className="relative aspect-square rounded-xl overflow-hidden bg-muted border-6">
                <Image
                    src="/assets/hotel_2.png"
                    alt="A descriptive alt text"
                    fill // Fills the parent container
                    style={{ objectFit: "cover" }} // Equivalent to background-size: cover
                    priority // Optional: preloads image for LCP (Largest Contentful Paint)
                  />
              </div>
            </AnimatedSection>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            {[
              { value: "15+", label: "Years of Excellence" },
              { value: "200+", label: "Menu Items" },
              { value: "10K+", label: "Happy Guests" },
            ].map((stat, i) => (
              <AnimatedSection key={i} animation="scale" delay={i * 100}>
                <div className="text-center p-4">
                  <p className="text-3xl md:text-4xl font-bold text-primary mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 md:py-20 bg-muted">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Explore Our Menu
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              From appetizing starters to decadent desserts, discover dishes
              crafted with passion
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, i) => (
              <AnimatedSection
                key={category.id}
                animation="fade-up"
                delay={i * 75}
              >
                <Link href={`/menu?category=${category.id}`}>
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer h-full">
                    <div className="relative aspect-square bg-muted">
                      {/* Category Image Placeholder */}
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary/50">
                        <div className="text-center text-muted-foreground">
                          <div className="w-12 h-12 mx-auto mb-2 border-2 border-dashed border-muted-foreground/40 rounded flex items-center justify-center">
                            <Utensils className="w-5 h-5" />
                          </div>
                          <p className="text-xs">Category Image</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                      <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                        <h3 className="font-semibold text-white text-lg">
                          {category.name}
                        </h3>
                        <p className="text-white/80 text-sm line-clamp-1">
                          {category.description}
                        </p>
                      </div>
                    </div>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Items */}
      <section className="py-16 md:py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <div className="flex items-end justify-between mb-10">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
                  Popular Dishes
                </h2>
                <p className="text-muted-foreground">
                  Customer favorites you must try
                </p>
              </div>
              <Link href="/menu" className="hidden sm:block">
                <Button variant="outline" className="gap-2 bg-transparent">
                  View All
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredItems.map((item, i) => (
              <AnimatedSection
                key={item.id}
                animation="fade-up"
                delay={i * 100}
              >
                <MenuItemCard item={item} />
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection
            animation="fade-up"
            className="mt-8 text-center sm:hidden"
          >
            <Link href="/menu">
              <Button variant="outline" className="gap-2 bg-transparent">
                View Full Menu
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      {/* Testimonial / Ambiance Section */}
      <section className="py-16 md:py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <AnimatedSection animation="fade-right">
              <div className="relative aspect-[4/3] rounded-xl overflow-hidden bg-muted border-2 border-dashed border-border">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <div className="w-20 h-20 mx-auto mb-3 border-2 border-dashed border-muted-foreground/40 rounded-lg flex items-center justify-center">
                      <Users className="w-8 h-8" />
                    </div>
                    <p className="text-sm font-medium">Ambiance Image</p>
                    <p className="text-xs mt-1">600 x 450 recommended</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-left">
              <div>
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <blockquote className="text-2xl md:text-3xl font-medium text-foreground mb-6 leading-relaxed">
                  &ldquo;An exceptional dining experience. The food was
                  outstanding and the ambiance was perfect for our anniversary
                  dinner.&rdquo;
                </blockquote>
                <div>
                  <p className="font-semibold text-foreground">
                    Sarah & Michael Thompson
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Regular Guests
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* CTA */}
      <AnimatedSection
        as="section"
        animation="fade-up"
        className="py-16 md:py-20 bg-primary text-primary-foreground"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Ready to Order?
          </h2>
          <p className="text-primary-foreground/80 mb-6 max-w-lg mx-auto">
            Browse our full menu and place your takeaway order in minutes.
            Fresh, delicious food awaits!
          </p>
          <Link href="/menu">
            <Button size="lg" variant="secondary" className="gap-2">
              Start Your Order
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </AnimatedSection>
    </div>
  );
}
