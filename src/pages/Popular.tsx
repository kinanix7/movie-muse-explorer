
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Film } from 'lucide-react';
import { getPopularMovies } from '@/lib/api';
import Layout from '@/components/Layout';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner from '@/components/LoadingSpinner';

const Popular = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['popular-page'],
    queryFn: () => getPopularMovies(),
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

  if (isError) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
          <div className="mb-4 text-destructive">
            <Film className="h-12 w-12 mx-auto" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
          <p className="text-muted-foreground mb-4">
            We couldn't load the popular movies. Please try again later.
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <h1 className="text-3xl font-bold mb-2">Popular Movies</h1>
      <p className="text-muted-foreground mb-6">
        Discover the most popular movies right now
      </p>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {data?.results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </Layout>
  );
};

export default Popular;
