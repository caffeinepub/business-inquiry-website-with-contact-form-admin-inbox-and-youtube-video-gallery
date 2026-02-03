import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Video, ArrowRight } from 'lucide-react';
import { useGetAllFeatureBoxes } from '../hooks/useQueries';

export default function HomePage() {
  const { data: featureBoxes } = useGetAllFeatureBoxes();

  // Default fallback content
  const defaultBoxes = [
    {
      title: 'Dirtbike Videos',
      description: 'Watch the latest dirtbike videos featuring trail rides, jumps, tricks, and all the two-stroke action.',
      buttonLabel: 'View Videos',
      targetRoute: '/videos',
      icon: Video,
    },
    {
      title: 'Get in Touch',
      description: 'Got questions about bikes, gear, or riding? Send me a message and I\'ll get back to you.',
      buttonLabel: 'Contact Me',
      targetRoute: '/contact',
      icon: Mail,
    },
  ];

  // Use backend data if available, otherwise use defaults
  const boxes = featureBoxes && featureBoxes.length >= 2
    ? [
        { ...featureBoxes[0], icon: Video },
        { ...featureBoxes[1], icon: Mail },
      ]
    : defaultBoxes;

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section 
        className="relative flex min-h-[500px] items-center justify-center overflow-hidden bg-gradient-to-br from-stone-900 via-neutral-900 to-zinc-900"
        style={{
          backgroundImage: 'url(/assets/generated/hero-bg.dim_1920x1080.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
        <div className="container relative z-10 mx-auto px-4 py-20 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl drop-shadow-2xl">
            RTRKidd Dirtbike
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200 sm:text-xl drop-shadow-lg">
            Extreme dirtbike action, trail rides, and two-wheel mayhem. Watch the latest videos and get in touch.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="gap-2 shadow-lg">
              <Link to="/contact">
                <Mail className="h-5 w-5" />
                Contact Me
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 shadow-lg">
              <Link to="/videos">
                <Video className="h-5 w-5" />
                Watch Videos
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2">
          {boxes.map((box, index) => {
            const Icon = box.icon;
            return (
              <Card key={index} className="transition-all hover:shadow-xl border-2 hover:border-primary/50">
                <CardHeader>
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>{box.title}</CardTitle>
                  <CardDescription>
                    {box.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button asChild variant="ghost" className="gap-2">
                    <Link to={box.targetRoute}>
                      {box.buttonLabel}
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
