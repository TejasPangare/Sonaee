"use client";

import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Car,
  Camera,
  Clock,
  Crown,
  Leaf,
  MapPin,
  ShieldCheck,
  Snowflake,
  Sparkles,
  Users,
  Utensils,
  Package,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedSection } from "@/components/ui/animated-section";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { useScrollAnimation } from "@/hooks/use-scroll-animation";
import { useSiteSettings } from "@/lib/site-settings-context";
import { GallerySection } from "@/components/customer/gallery-section";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { homepageGalleryItems } from "@/lib/gallery-data";
import { apiClient, Category, MenuItemWithCategory } from "@/lib/api-client";
import { useEffect, useState } from "react";

const testimonials = [
  {
    name: "Aarav Mehta",
    role: "Family Celebration",
    image: "/placeholder-user.jpg",
    review:
      "The banquet setup was elegant, the service felt attentive throughout, and every guest loved the food.",
  },
  {
    name: "Neha Kulkarni",
    role: "Birthday Event",
    image: "/placeholder-user.jpg",
    review:
      "Beautiful ambiance, smooth event coordination, and a warm team that made the celebration feel effortless.",
  },
  {
    name: "Rahul Sharma",
    role: "Corporate Dinner",
    image: "/placeholder-user.jpg",
    review:
      "Professional hosting, timely service, and a premium dining experience that impressed our entire team.",
  },
]

function StatCounter({
  value,
  suffix,
  label,
}: {
  value: number
  suffix: string
  label: string
}) {
  const [ref, isVisible] = useScrollAnimation<HTMLDivElement>()
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let start = 0
    const duration = 1400
    const increment = Math.max(1, Math.ceil(value / (duration / 16)))

    const timer = window.setInterval(() => {
      start += increment
      if (start >= value) {
        setCount(value)
        window.clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)

    return () => window.clearInterval(timer)
  }, [isVisible, value])

  return (
    <div ref={ref} className="premium-panel rounded-[1.5rem] border border-border/60 p-6 text-center">
      <p className="mb-2 text-4xl text-primary md:text-5xl">
        {count}
        {suffix}
      </p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  )
}

export default function HomePage() {
  const { settings } = useSiteSettings()
  const [categories, setCategories] = useState<Category[]>([])
  const [menuItems, setMenuItems] = useState<MenuItemWithCategory[]>([])

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
      }
    }

    fetchData()
  }, [])

  const featuredItems = menuItems.slice(0, 4)

  return (
    <div>
      <section className="relative flex min-h-[760px] items-center overflow-hidden bg-sidebar text-sidebar-foreground">
        <div className="absolute inset-0">
          <div className="relative h-full w-full bg-sidebar">
            <Image
              src="/assets/hotel_8.png"
                alt={`${settings.hotelName} dining space`}
              fill
              style={{ objectFit: "cover", opacity: 0.34 }}
              priority
            />
          </div>
        </div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(214,164,92,0.32),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(255,255,255,0.08),transparent_24%),linear-gradient(90deg,rgba(34,27,22,0.96)_0%,rgba(34,27,22,0.84)_44%,rgba(34,27,22,0.38)_100%)]" />
        <div className="absolute left-[8%] top-24 h-28 w-28 rounded-full bg-sidebar-primary/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-16 right-[10%] h-36 w-36 rounded-full bg-white/10 blur-3xl animate-pulse" />

        <div className="relative z-20 mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-32">
          <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_360px]">
            <div className="max-w-3xl">
              <AnimatedSection animation="fade-up" duration={800} className="mb-5">
                <div className="inline-flex items-center gap-3 rounded-full border border-white/12 bg-white/6 px-4 py-2 backdrop-blur-md">
                  <span className="h-2.5 w-2.5 rounded-full bg-sidebar-primary shadow-[0_0_18px_rgba(214,164,92,0.9)]" />
                  <p className="text-xs font-medium uppercase tracking-[0.35em] text-sidebar-primary">
                    Signature Dining Experience
                  </p>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={120} duration={900}>
                <h1 className="mb-6 max-w-3xl text-5xl leading-[0.92] text-balance md:text-6xl lg:text-7xl">
                  Crafted for
                  <span className="block text-sidebar-primary">remarkable meals</span>
                  and memorable celebrations.
                </h1>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={220} duration={900}>
                <p className="mb-8 max-w-2xl text-lg leading-relaxed text-sidebar-foreground/80 md:text-xl">
                  Discover premium vegetarian cuisine for everyday ordering, and elegant event hosting for gatherings that deserve something special.
                </p>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={320} duration={900}>
                <div className="flex flex-col gap-4 sm:flex-row">
                  <Link href="/menu">
                    <Button size="lg" className="group min-w-[190px] gap-2 px-7">
                      Order Food
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </Button>
                  </Link>
                  <Link href="/contact#banquet">
                    <Button
                      size="lg"
                      variant="outline"
                      className="min-w-[190px] border-white/18 bg-white/6 text-sidebar-foreground backdrop-blur-md hover:bg-white/12"
                    >
                      Book Event
                    </Button>
                  </Link>
                </div>
              </AnimatedSection>

              <AnimatedSection animation="fade-up" delay={420} duration={900} className="mt-8 flex flex-wrap gap-4">
                {[
                  "Freshly prepared daily",
                  "Takeaway in 20-30 min",
                  "Banquet bookings available",
                ].map((item) => (
                  <div
                    key={item}
                    className="rounded-full border border-white/10 bg-white/6 px-4 py-2 text-sm text-sidebar-foreground/75 backdrop-blur-md"
                  >
                    {item}
                  </div>
                ))}
              </AnimatedSection>
            </div>

            <AnimatedSection animation="scale" delay={240} duration={950} className="relative">
              <div className="relative overflow-hidden rounded-[2rem] border border-white/12 bg-white/8 p-6 shadow-[0_30px_80px_rgba(10,10,10,0.28)] backdrop-blur-xl">
                <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
                <p className="mb-6 text-xs font-semibold uppercase tracking-[0.35em] text-sidebar-primary">Today at Sonaee</p>
                <div className="space-y-4">
                  {[
                    { label: "Takeaway Ready", value: "20-30 min" },
                    { label: "Book Banquet", value: "Open" },
                    { label: "Guest Rating", value: "4.9 / 5" },
                  ].map((item, index) => (
                    <AnimatedSection
                      key={item.label}
                      animation="fade-left"
                      delay={380 + index * 90}
                      duration={850}
                      className="rounded-[1.5rem] border border-white/10 bg-black/10 p-4"
                    >
                      <div className="flex items-end justify-between gap-4">
                        <span className="text-sm text-sidebar-foreground/70">{item.label}</span>
                        <span className="text-2xl text-sidebar-foreground">{item.value}</span>
                      </div>
                    </AnimatedSection>
                  ))}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 sm:px-6 lg:grid-cols-4 lg:px-8">
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
              <Card className="premium-panel h-full border-border/70 bg-card/85">
                <CardContent className="p-6 text-center">
                  <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mb-1 text-2xl text-card-foreground">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.desc}
                  </p>
                </CardContent>
              </Card>
            </AnimatedSection>
          ))}
        </div>
      </section>

      <section className="bg-secondary/35 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <AnimatedSection animation="fade-right">
              <div className="premium-panel overflow-hidden rounded-[2rem] border border-border/60 bg-card/88 p-8 md:p-10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">About {settings.shortName}</p>
                <h2 className="mb-4 text-4xl text-foreground md:text-5xl">
                  A heritage of flavor, care, and warm hosting.
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    For years, {settings.shortName} has welcomed families, travelers, and celebrations with thoughtfully prepared vegetarian cuisine.
                  </p>
                  <p>
                    We focus on food quality, fresh ingredients, and genuine hospitality so every order and every visit feels special.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-3 gap-4">
                  {[
                    { value: "15+", label: "Years" },
                    { value: "200+", label: "Dishes" },
                    { value: "10K+", label: "Guests" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-[1.25rem] border border-border/60 bg-background/70 p-4 text-center">
                      <p className="text-3xl text-primary">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-left">
              <div className="grid grid-cols-2 gap-4">
                <div className="premium-panel relative col-span-2 aspect-[16/10] overflow-hidden rounded-[1.75rem] border border-border/60">
                  <Image
                    src="/assets/hotel_7.png"
                    alt={`${settings.shortName} interior`}
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
                <div className="premium-panel relative aspect-square overflow-hidden rounded-[1.5rem] border border-border/60">
                  <Image
                    src="/assets/hotel_4.png"
                    alt="Private dining space"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
                <div className="premium-panel relative aspect-square overflow-hidden rounded-[1.5rem] border border-border/60">
                  <Image
                    src="/assets/hotel_2.png"
                    alt="Banquet area"
                    fill
                    style={{ objectFit: "cover" }}
                    priority
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Why Choose Us</p>
            <h2 className="mb-3 text-4xl text-foreground md:text-5xl">
              Everything you need for a smooth dining experience.
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              From everyday family meals to special occasions, we combine quality, speed, and comfort in one place.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {[
              { icon: Crown, title: "Quality Food", desc: "Carefully crafted dishes with premium presentation." },
              { icon: Leaf, title: "Fresh Ingredients", desc: "Prepared daily with freshness and flavor in mind." },
              { icon: Clock, title: "Fast Service", desc: "Quick preparation for takeaway and table service alike." },
              { icon: Users, title: "Family Friendly", desc: "Comfortable spaces designed for all age groups." },
              { icon: Sparkles, title: "Banquet Hall", desc: "An elegant setting for events, gatherings, and celebrations." },
              { icon: Car, title: "Parking", desc: "Convenient access that makes visits easier and stress-free." },
            ].map((feature, i) => (
              <AnimatedSection key={feature.title} animation="fade-up" delay={i * 80}>
                <Card className="h-full border-border/60 bg-card/86">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-2xl text-foreground">{feature.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{feature.desc}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <AnimatedSection animation="fade-right">
              <div className="premium-panel relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border/60">
                <Image
                  src="/assets/hotel_2.png"
                  alt="Banquet hall at Sonaee Veg"
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-black/10 to-transparent" />
                <div className="absolute bottom-5 left-5 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-md">
                  Elegant venue for celebrations
                </div>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-left">
              <div className="premium-panel rounded-[2rem] border border-border/60 bg-card/88 p-8 md:p-10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Banquet Preview</p>
                <h2 className="mb-4 text-4xl text-foreground md:text-5xl">
                  Celebrate in a warm, refined banquet setting.
                </h2>
                <p className="mb-4 text-muted-foreground">
                  Host birthdays, family gatherings, corporate dinners, and special occasions with curated vegetarian menus and attentive service.
                </p>
                <p className="mb-8 text-muted-foreground">
                  Our banquet experience is designed to feel effortless, elegant, and memorable for every guest.
                </p>

                <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
                  {[
                    "Custom event dining",
                    "Family celebrations",
                    "Comfortable group seating",
                  ].map((item) => (
                    <div key={item} className="rounded-[1.25rem] border border-border/60 bg-background/75 px-4 py-4 text-sm text-foreground">
                      {item}
                    </div>
                  ))}
                </div>

                <Link href="/contact#banquet">
                  <Button size="lg" className="gap-2">
                    Book Event
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Event Categories</p>
            <h2 className="mb-3 text-4xl text-foreground md:text-5xl">
              Banquet experiences for every occasion.
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              From intimate family moments to elegant celebrations, our venue is designed to host each event with warmth and attention to detail.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                title: "Wedding",
                description: "Elegant vegetarian celebrations curated for your most special day.",
                image: "/assets/hotel_7.png",
              },
              {
                title: "Reception",
                description: "A refined space for welcoming guests and celebrating together.",
                image: "/assets/hotel_4.png",
              },
              {
                title: "Engagement",
                description: "A graceful venue for memorable beginnings and close family gatherings.",
                image: "/assets/hotel_3.png",
              },
              {
                title: "Birthday",
                description: "Joyful celebrations with comforting food and lively hospitality.",
                image: "/assets/hotel_5.png",
              },
              {
                title: "Baby Shower",
                description: "Warm and intimate setups for family-centered celebrations.",
                image: "/assets/hotel_2.png",
              },
              {
                title: "Corporate Events",
                description: "Professional hosting with polished dining for teams and guests.",
                image: "/assets/hotel_8.png",
              },
              {
                title: "Anniversary",
                description: "A premium setting for meaningful milestones and shared memories.",
                image: "/assets/hotel_1.png",
              },
              {
                title: "Naming Ceremony",
                description: "Thoughtfully arranged celebrations rooted in family and tradition.",
                image: "/assets/hotel_6.png",
              },
            ].map((event, i) => (
              <AnimatedSection key={event.title} animation="fade-up" delay={i * 70}>
                <Card className="group h-full overflow-hidden border-border/60 bg-card/88">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={event.image}
                      alt={event.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/18 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl text-white">{event.title}</h3>
                    </div>
                  </div>
                  <CardContent className="flex h-full flex-col p-6">
                    <p className="mb-6 text-sm leading-6 text-muted-foreground">
                      {event.description}
                    </p>
                    <div className="mt-auto">
                      <Link href="/contact#banquet">
                        <Button variant="outline" className="w-full justify-between">
                          Book Event
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <GallerySection
        id="gallery"
        title="A closer look at our spaces and celebrations."
        subtitle="Explore the restaurant, banquet hall, food presentation, and event-ready setups that help guests feel confident before they visit."
        items={homepageGalleryItems}
        viewMoreHref="/#gallery"
      />

      <section className="bg-background py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Amenities</p>
            <h2 className="mb-3 text-4xl text-foreground md:text-5xl">
              Thoughtful event essentials, all in one venue.
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Our banquet experience is supported by practical comforts and premium event-ready facilities.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { icon: Snowflake, title: "AC Hall", desc: "Comfortable indoor atmosphere for every season." },
              { icon: Car, title: "Parking", desc: "Convenient access for guests arriving with ease." },
              { icon: Crown, title: "Stage", desc: "A focal setup for ceremonies, speeches, and celebrations." },
              { icon: Sparkles, title: "Decoration", desc: "Elegant styling that complements your event theme." },
              { icon: Utensils, title: "Catering", desc: "Fresh vegetarian menus prepared with care and quality." },
              { icon: Zap, title: "Power Backup", desc: "Reliable event support for uninterrupted celebrations." },
              { icon: Camera, title: "Photography", desc: "Picture-ready spaces for memorable event moments." },
            ].map((item, i) => (
              <AnimatedSection key={item.title} animation="fade-up" delay={i * 70}>
                <Card className="h-full border-border/60 bg-card/88">
                  <CardContent className="p-6">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                      <item.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-2xl text-foreground">{item.title}</h3>
                    <p className="text-sm leading-6 text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Statistics</p>
            <h2 className="mb-3 text-4xl text-foreground md:text-5xl">
              Trusted for dining and celebrations alike.
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              A quick look at the scale, experience, and guest confidence behind Sonaee Veg.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
            <AnimatedSection animation="scale" delay={0}>
              <StatCounter value={850} suffix="+" label="Events Hosted" />
            </AnimatedSection>
            <AnimatedSection animation="scale" delay={80}>
              <StatCounter value={25000} suffix="+" label="Happy Customers" />
            </AnimatedSection>
            <AnimatedSection animation="scale" delay={160}>
              <StatCounter value={15} suffix="+" label="Years of Service" />
            </AnimatedSection>
            <AnimatedSection animation="scale" delay={240}>
              <StatCounter value={500} suffix="+" label="Guest Capacity" />
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Testimonials</p>
            <h2 className="mb-3 text-4xl text-foreground md:text-5xl">
              Guests remember the details.
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Real experiences from diners and event hosts who chose Sonaee Veg for their special occasions.
            </p>
          </AnimatedSection>

          <div className="md:hidden">
            <Carousel opts={{ align: "start", loop: true }}>
              <CarouselContent className="-ml-0">
                {testimonials.map((testimonial) => (
                  <CarouselItem key={testimonial.name} className="pl-0">
                    <Card className="h-full border-border/60 bg-card/88">
                      <CardContent className="p-6">
                        <div className="mb-4 flex items-center gap-4">
                          <div className="relative h-14 w-14 overflow-hidden rounded-full border border-border/60">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <h3 className="text-xl text-foreground">{testimonial.name}</h3>
                            <p className="text-sm text-primary">{testimonial.role}</p>
                          </div>
                        </div>
                        <div className="mb-4 flex gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                          ))}
                        </div>
                        <p className="text-sm leading-7 text-muted-foreground">
                          {testimonial.review}
                        </p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>
          </div>

          <div className="hidden gap-6 md:grid md:grid-cols-3">
            {testimonials.map((testimonial, i) => (
              <AnimatedSection key={testimonial.name} animation="fade-up" delay={i * 90}>
                <Card className="h-full border-border/60 bg-card/88">
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-center gap-4">
                      <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border/60">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl text-foreground">{testimonial.name}</h3>
                        <p className="text-sm text-primary">{testimonial.role}</p>
                      </div>
                    </div>
                    <div className="mb-4 flex gap-1">
                      {[...Array(5)].map((_, index) => (
                        <Star key={index} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm leading-7 text-muted-foreground">
                      {testimonial.review}
                    </p>
                  </CardContent>
                </Card>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-secondary/35 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
            <AnimatedSection animation="fade-right">
              <div className="premium-panel rounded-[2rem] border border-border/60 bg-card/88 p-8 md:p-10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Quick Enquiry</p>
                <h2 className="mb-4 text-4xl text-foreground md:text-5xl">
                  Tell us about your event in a few quick details.
                </h2>
                <p className="mb-8 max-w-2xl text-muted-foreground">
                  Share your preferred event type, guest count, and date. For instant coordination, continue on WhatsApp with our banquet team.
                </p>

                <form onSubmit={(e) => e.preventDefault()} className="space-y-5">
                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="enquiry-name">Name</Label>
                      <Input id="enquiry-name" placeholder="Your full name" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="enquiry-phone">Phone</Label>
                      <Input id="enquiry-phone" type="tel" placeholder="+1 (555) 123-4567" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="enquiry-event-type">Event Type</Label>
                      <select
                        id="enquiry-event-type"
                        className="surface-field h-12 w-full rounded-2xl px-4 text-sm text-foreground outline-none transition-[box-shadow,border-color] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/30"
                        defaultValue=""
                      >
                        <option value="" disabled>Select an event</option>
                        <option>Wedding</option>
                        <option>Reception</option>
                        <option>Engagement</option>
                        <option>Birthday</option>
                        <option>Baby Shower</option>
                        <option>Corporate Event</option>
                        <option>Anniversary</option>
                        <option>Naming Ceremony</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="enquiry-guests">Guests</Label>
                      <Input id="enquiry-guests" type="number" min="1" placeholder="Approximate guest count" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="enquiry-date">Preferred Date</Label>
                      <Input id="enquiry-date" type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="enquiry-message">Message</Label>
                      <Textarea id="enquiry-message" className="min-h-[132px] sm:min-h-[48px]" placeholder="Tell us about your event style, menu, or seating needs..." />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Link href="/contact#banquet">
                      <Button className="w-full sm:w-auto">Send Enquiry</Button>
                    </Link>
                    <a href={settings.whatsappHref} target="_blank" rel="noreferrer">
                      <Button variant="outline" className="w-full sm:w-auto">
                        WhatsApp Us
                      </Button>
                    </a>
                  </div>
                </form>
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-left">
              <div className="premium-panel relative h-full min-h-[420px] overflow-hidden rounded-[2rem] border border-border/60">
                <Image
                  src="/assets/hotel_6.png"
                  alt="Event enquiry and planning"
                  fill
                  style={{ objectFit: "cover" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="mb-3 inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] backdrop-blur-md">
                    Fast Coordination
                  </div>
                  <h3 className="mb-3 text-3xl">Plan confidently with a quick response from our team.</h3>
                  <p className="max-w-lg text-sm leading-7 text-white/80">
                    We help with dining style, guest capacity, celebration setup, and service planning for smooth event experiences.
                  </p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="bg-background py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Contact</p>
            <h2 className="mb-3 text-4xl text-foreground md:text-5xl">
              Reach us for dining, takeaway, and event enquiries.
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Everything you need to get in touch with Sonaee Veg in one responsive contact area.
            </p>
          </AnimatedSection>

          <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {[
                { title: "Phone", value: settings.phoneDisplay, href: settings.phoneHref },
                { title: "WhatsApp", value: "Chat with our team", href: settings.whatsappHref },
                { title: "Email", value: settings.email, href: settings.emailHref },
                { title: "Business Hours", value: settings.businessHours, href: null },
              ].map((item, i) => (
                <AnimatedSection key={item.title} animation="fade-up" delay={i * 70}>
                  <Card className="h-full border-border/60 bg-card/88">
                    <CardContent className="p-6">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">{item.title}</p>
                      {item.href ? (
                        <a
                          href={item.href}
                          target={item.href.startsWith("http") ? "_blank" : undefined}
                          rel={item.href.startsWith("http") ? "noreferrer" : undefined}
                          className="text-lg text-foreground transition-colors hover:text-primary"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-lg text-foreground">{item.value}</p>
                      )}
                    </CardContent>
                  </Card>
                </AnimatedSection>
              ))}
            </div>

            <AnimatedSection animation="fade-left">
              <div className="overflow-hidden rounded-[2rem] border border-border/60 bg-card/88">
                <div className="border-b border-border/60 px-6 py-5">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary/80">Google Maps</p>
                  <h3 className="text-2xl text-foreground">Visit {settings.hotelName}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {settings.address}
                  </p>
                </div>
                <div className="aspect-[16/11] w-full">
                  <iframe
                    title={`${settings.hotelName} map`}
                    src={settings.mapEmbedUrl}
                    className="h-full w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <section className="bg-muted py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up" className="mb-10 text-center">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Explore</p>
            <h2 className="mb-3 text-4xl text-foreground md:text-5xl">
              Explore Our Menu
            </h2>
            <p className="mx-auto max-w-xl text-muted-foreground">
              From appetizing starters to decadent desserts, discover dishes crafted with passion.
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-2 gap-4 md:gap-6 lg:grid-cols-4">
            {categories.map((category, i) => (
              <AnimatedSection
                key={category.id}
                animation="fade-up"
                delay={i * 75}
              >
                <Link href={`/menu?category=${category.id}`}>
                  <Card className="premium-panel group h-full cursor-pointer overflow-hidden border-border/60 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
                    <div className="relative aspect-square bg-muted">
                      <div className="absolute inset-0 flex items-center justify-center bg-[linear-gradient(180deg,rgba(196,147,82,0.22),rgba(78,51,31,0.52))]">
                        <div className="text-center text-white">
                          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full border border-white/35 bg-white/10">
                            <Utensils className="h-5 w-5" />
                          </div>
                          <p className="text-xs text-white/80">Discover</p>
                        </div>
                      </div>
                      <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 z-20 p-4">
                        <h3 className="text-2xl text-white">
                          {category.name}
                        </h3>
                        <p className="line-clamp-1 text-sm text-white/80">
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

      <section className="bg-background py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection animation="fade-up">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Featured Dishes</p>
                <h2 className="mb-3 text-4xl text-foreground md:text-5xl">
                  Popular Dishes
                </h2>
                <p className="text-muted-foreground">
                  Signature favorites, ready to order in just a few taps.
                </p>
              </div>
              <Link href="/menu" className="hidden sm:block">
                <Button variant="outline" className="gap-2 rounded-full bg-transparent">
                  Order More
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featuredItems.map((item, i) => (
              <AnimatedSection
                key={item.id}
                animation="fade-up"
                delay={i * 100}
              >
                <Link href="/menu" className="block h-full">
                  <Card className="group h-full overflow-hidden border-border/60 bg-card/88">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
                      <div className="absolute left-4 right-4 top-4 flex items-center justify-between">
                        <span className="rounded-full border border-white/15 bg-black/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                          Popular
                        </span>
                        <span className="rounded-full bg-white/92 px-3 py-1 text-sm font-semibold text-foreground">
                          Rs. {item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <CardContent className="flex h-full flex-col p-6">
                      <div className="mb-3 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="mb-2 text-2xl text-foreground">{item.name}</h3>
                          <p className="line-clamp-2 text-sm leading-6 text-muted-foreground">
                            {item.description}
                          </p>
                        </div>
                      </div>
                      <div className="mt-auto flex items-center justify-between pt-5">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <ShieldCheck className="h-4 w-4 text-primary" />
                          Ready to order
                        </div>
                        <span className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
                          Order Now
                          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection
            animation="fade-up"
            className="mt-8 text-center sm:hidden"
          >
            <Link href="/menu">
              <Button variant="outline" className="gap-2 rounded-full bg-transparent">
                Order Full Menu
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </AnimatedSection>
        </div>
      </section>

      <section className="bg-secondary/30 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <AnimatedSection animation="fade-right">
              <div className="premium-panel relative aspect-[4/3] overflow-hidden rounded-[2rem] border border-border/60">
                <Image
                  src="/assets/hotel_5.png"
                  alt="Guests enjoying the ambiance"
                  fill
                  style={{ objectFit: "cover" }}
                />
              </div>
            </AnimatedSection>

            <AnimatedSection animation="fade-left">
              <div>
                <div className="mb-4 flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="h-5 w-5 fill-primary text-primary"
                    />
                  ))}
                </div>
                <blockquote className="mb-6 text-3xl leading-relaxed text-foreground md:text-4xl">
                  &ldquo;An exceptional dining experience. The food was outstanding and the ambiance was perfect for our anniversary dinner.&rdquo;
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

      <AnimatedSection
        as="section"
        animation="fade-up"
        className="bg-primary py-16 text-primary-foreground md:py-20"
      >
        <div className="max-w-7xl mx-auto px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary-foreground/75">Order Online</p>
          <h2 className="mb-4 text-3xl md:text-4xl">
            Ready to Order?
          </h2>
          <p className="mx-auto mb-6 max-w-lg text-primary-foreground/80">
            Browse our full menu and place your takeaway order in minutes. Fresh, delicious food awaits!
          </p>
          <Link href="/menu">
            <Button size="lg" variant="secondary" className="gap-2 rounded-full">
              Start Your Order
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </AnimatedSection>

    </div>
  );
}
