"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { AnimatedSection } from "@/components/ui/animated-section";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ContentItem } from "@/lib/api-client";

type EventCategoriesSectionProps = {
  items: ContentItem[];
  title: string;
  subtitle: string;
  maxCards?: number;
  showViewAllCta?: boolean;
  viewAllHref?: string;
  viewAllLabel?: string;
};

function sortEventCategories(items: ContentItem[]) {
  return [...items]
    .filter((item) => item.type === "event_category")
    .sort((left, right) => left.display_order - right.display_order || left.id - right.id);
}

export function EventCategoriesSection({
  items,
  title,
  subtitle,
  maxCards,
  showViewAllCta = false,
  viewAllHref = "/banquet",
  viewAllLabel = "View All Events",
}: EventCategoriesSectionProps) {
  const eventCategories = sortEventCategories(items);
  const visibleCategories = typeof maxCards === "number" ? eventCategories.slice(0, maxCards) : eventCategories;

  if (visibleCategories.length === 0) {
    return null;
  }

  return (
    <section className="bg-background py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="mb-10 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-primary/80">Event Categories</p>
          <h2 className="mb-3 text-4xl text-foreground md:text-5xl">{title}</h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">{subtitle}</p>
        </AnimatedSection>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {visibleCategories.map((event, index) => (
            <AnimatedSection key={event.id} animation="fade-up" delay={index * 70}>
              <Card className="group h-full overflow-hidden border-border/60 bg-card/88">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={event.image_url || "/placeholder.svg"}
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
                    {event.description || "No description provided."}
                  </p>
                  <div className="mt-auto">
                    <Link href="/banquet#banquet">
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

        {showViewAllCta ? (
          <div className="mt-10 flex justify-center">
            <Link href={viewAllHref}>
              <Button size="lg" className="gap-2">
                {viewAllLabel}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        ) : null}
      </div>
    </section>
  );
}
