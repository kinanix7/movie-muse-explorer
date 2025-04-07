
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, 
  Clock, 
  Calendar, 
  Star, 
  Film 
} from 'lucide-react';
import { getMovieDetails, getImageUrl } from '@/lib/api';
import Layout from '@/components/Layout';
import LoadingSpinner from '@/components/LoadingSpinner';
import MovieCard from '@/components/MovieCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const movieId = parseInt(id || '0');

  const { data: movie, isLoading, isError } = useQuery({
    queryKey: ['movie', movieId],
    queryFn: () => getMovieDetails(movieId),
    enabled: !!movieId,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh]">
          <LoadingSpinner size="lg" />
        </div>
      </Layout>
    );
  }

  if (isError || !movie) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="mb-4 text-destructive">
            <Film className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Movie Not Found</h2>
          <p className="text-muted-foreground mb-4">
            We couldn't find the movie you're looking for.
          </p>
          <Button asChild>
            <Link to="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Format runtime to hours and minutes
  const formatRuntime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  // Format date to readable format
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Get director
  const director = movie.credits.crew.find(
    (crewMember) => crewMember.job === 'Director'
  );

  // Get trailer
  const trailer = movie.videos.results.find(
    (video) => video.type === 'Trailer' && video.site === 'YouTube'
  );

  // Top cast (first 6)
  const topCast = movie.credits.cast.slice(0, 6);

  return (
    <Layout>
      {/* Back button */}
      <div className="mb-6">
        <Button variant="ghost" asChild>
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Movies
          </Link>
        </Button>
      </div>

      {/* Movie header with backdrop */}
      <div className="relative mb-8 rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-black/60 z-10"></div>
        
        {movie.backdrop_path ? (
          <img
            src={getImageUrl(movie.backdrop_path, 'original')}
            alt={`${movie.title} backdrop`}
            className="w-full h-[40vh] object-cover"
          />
        ) : (
          <div className="w-full h-[40vh] bg-muted flex items-center justify-center">
            <Film className="h-16 w-16 text-muted-foreground/50" />
          </div>
        )}
        
        <div className="absolute inset-0 z-20 flex items-end md:items-center">
          <div className="container mx-auto px-4 py-8 md:py-0 md:flex md:items-center md:gap-8">
            <div className="hidden md:block rounded-lg overflow-hidden w-48 flex-shrink-0 shadow-xl">
              <img
                src={getImageUrl(movie.poster_path, 'w342')}
                alt={`${movie.title} poster`}
                className="w-full h-auto"
                onError={(e) => {
                  e.currentTarget.src = '/placeholder.svg';
                }}
              />
            </div>
            
            <div className="text-white">
              <h1 className="text-3xl md:text-4xl font-bold">{movie.title}</h1>
              
              {movie.tagline && (
                <p className="text-gray-300 italic mt-2">{movie.tagline}</p>
              )}
              
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="movie-rating">
                  <Star className="h-5 w-5 fill-movie-accent text-movie-accent" />
                  <span>{movie.vote_average.toFixed(1)}</span>
                </div>
                
                {movie.release_date && (
                  <div className="flex items-center gap-1 text-gray-300">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(movie.release_date).getFullYear()}</span>
                  </div>
                )}
                
                {movie.runtime > 0 && (
                  <div className="flex items-center gap-1 text-gray-300">
                    <Clock className="h-4 w-4" />
                    <span>{formatRuntime(movie.runtime)}</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-wrap gap-2 mt-4">
                {movie.genres.map((genre) => (
                  <Badge key={genre.id} variant="secondary">
                    {genre.name}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[3fr_1fr] gap-8">
        <div>
          {/* Overview */}
          <section className="mb-8">
            <h2 className="text-2xl font-bold mb-4">Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              {movie.overview || 'No overview available.'}
            </p>
          </section>

          {/* Cast */}
          {topCast.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Cast</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
                {topCast.map((person) => (
                  <div key={person.id} className="text-center">
                    <div className="aspect-square rounded-full overflow-hidden bg-muted mb-2">
                      <img
                        src={getImageUrl(person.profile_path, 'w185')}
                        alt={person.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder.svg';
                        }}
                      />
                    </div>
                    <h3 className="font-medium text-sm line-clamp-1">{person.name}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-1">
                      {person.character}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Trailer */}
          {trailer && (
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-4">Trailer</h2>
              <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${trailer.key}`}
                  title={`${movie.title} Trailer`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </section>
          )}
        </div>

        <div>
          {/* Movie details */}
          <div className="bg-muted rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Movie Details</h2>
            
            <div className="space-y-4">
              {movie.release_date && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Release Date</h3>
                  <p>{formatDate(movie.release_date)}</p>
                </div>
              )}
              
              {director && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Director</h3>
                  <p>{director.name}</p>
                </div>
              )}
              
              {movie.status && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Status</h3>
                  <p>{movie.status}</p>
                </div>
              )}
              
              {movie.budget > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Budget</h3>
                  <p>${movie.budget.toLocaleString()}</p>
                </div>
              )}
              
              {movie.revenue > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-muted-foreground">Revenue</h3>
                  <p>${movie.revenue.toLocaleString()}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Similar movies */}
      {movie.similar.results.length > 0 && (
        <section className="mt-12">
          <h2 className="section-title">
            <Film className="h-5 w-5 text-primary" />
            Similar Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {movie.similar.results.slice(0, 6).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
};

export default MovieDetails;
