"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { AnimatedSection } from "@/components/ui/animated-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import type { MenuItemWithCategory } from "@/lib/api-client";

type FeaturedDishesSectionProps = {
  items: MenuItemWithCategory[];
  title?: string;
  subtitle?: string;
  ctaHref?: string;
  ctaLabel?: string;
};

export function FeaturedDishesSection({
  items,
  title = "Popular Dishes",
  subtitle = "Signature favorites, ready to order in just a few taps.",
  ctaHref = "/menu",
  ctaLabel = "Order More",
}: FeaturedDishesSectionProps) {
  const featuredItems = items.slice(0, 4);

  if (featuredItems.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up">
          <div className="mb-10 flex items-end justify-between">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">
                Featured Dishes
              </p>
              <h2 className="mb-3 text-4xl text-foreground md:text-5xl">{title}</h2>
              <p className="text-muted-foreground">{subtitle}</p>
            </div>
            <Link href={ctaHref} className="hidden sm:block">
              <Button variant="outline" className="gap-2 rounded-full bg-transparent">
                {ctaLabel}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {featuredItems.map((item, index) => (
            <AnimatedSection
              key={item.id}
              animation="fade-up"
              delay={index * 100}
            >
              <Link href={ctaHref} className="block h-full">
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
      </div>
    </section>
  );
}
