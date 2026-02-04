import { Award, Users, Clock, Utensils } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-sidebar text-sidebar-foreground py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 text-balance">
            Our Story
          </h1>
          <p className="text-lg text-sidebar-foreground/80 leading-relaxed max-w-2xl mx-auto">
            For over two decades, Hotel Sonaee Veg Restaurant has been serving 
            exceptional cuisine that brings people together. Our passion for 
            quality ingredients and culinary excellence drives everything we do.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, value: '25+', label: 'Years of Excellence' },
              { icon: Users, value: '500K+', label: 'Happy Customers' },
              { icon: Utensils, value: '50+', label: 'Signature Dishes' },
              { icon: Award, value: '15', label: 'Culinary Awards' },
            ].map((stat, i) => (
              <Card key={i}>
                <CardContent className="p-6 text-center">
                  <stat.icon className="w-8 h-8 text-primary mx-auto mb-3" />
                  <p className="text-3xl font-bold text-foreground mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-12 md:py-16 bg-muted">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">A Legacy of Flavor</h2>
              <p className="text-muted-foreground leading-relaxed">
                Founded in 2001, Hotel Sonaee Veg Restaurant began with a simple vision: 
                to create a dining experience that celebrates the art of cooking while 
                making guests feel at home. What started as a small family restaurant 
                has grown into one of the city&apos;s most beloved culinary destinations.
              </p>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Our Philosophy</h2>
              <p className="text-muted-foreground leading-relaxed">
                We believe that great food starts with great ingredients. That&apos;s why 
                we partner with local farmers and suppliers to source the freshest 
                produce, meats, and seafood. Our chefs transform these quality 
                ingredients into dishes that honor traditional techniques while 
                embracing modern innovation.
              </p>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Takeaway Excellence</h2>
              <p className="text-muted-foreground leading-relaxed">
                We understand that exceptional dining should not be limited to our 
                restaurant walls. Our takeaway service brings the same attention to 
                detail and quality to your doorstep. Each order is carefully prepared 
                and packaged to ensure your meal arrives fresh and delicious.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-12 md:py-16 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The talented individuals behind your dining experience
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {[
              { name: 'Chef Marcus Chen', role: 'Executive Chef', bio: '20 years of culinary expertise' },
              { name: 'Sarah Williams', role: 'Restaurant Manager', bio: 'Ensuring every visit is exceptional' },
              { name: 'David Park', role: 'Sous Chef', bio: 'Master of flavors and presentation' },
            ].map((member, i) => (
              <Card key={i}>
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl text-muted-foreground">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-primary text-sm mb-2">{member.role}</p>
                  <p className="text-muted-foreground text-sm">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
