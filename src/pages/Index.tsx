
import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Film, TrendingUp } from 'lucide-react';
import { getPopularMovies, getTrendingMovies } from '@/lib/api';
import { Movie } from '@/lib/types';
import Layout from '@/components/Layout';
import MovieCard from '@/components/MovieCard';
import LoadingSpinner from '@/components/LoadingSpinner';

const Index = () => {
  // Fetch trending movies
  const trendingQuery = useQuery({
    queryKey: ['trending'],
    queryFn: () => getTrendingMovies(),
  });

  // Fetch popular movies
  const popularQuery = useQuery({
    queryKey: ['popular'],
    queryFn: () => getPopularMovies(),
  });

  // Check if data is still loading
  const isLoading = trendingQuery.isLoading || popularQuery.isLoading;
  
  // Check if there was an error
  const isError = trendingQuery.isError || popularQuery.isError;

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
            We couldn't load the movies. Please try again later.
          </p>
        </div>
      </Layout>
    );
  }

  const trendingMovies = trendingQuery.data?.results || [];
  const popularMovies = popularQuery.data?.results || [];

  return (
    <Layout>
      {/* Hero section */}
      <section className="mb-12">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-4xl font-bold mb-4">Welcome to MovieMuse</h1>
          <p className="text-muted-foreground">
            Discover the latest trending movies, find information about your favorite films, 
            and explore cinema from around the world.
          </p>
        </div>
      </section>

      {/* Trending movies section */}
      <section className="mb-12">
        <h2 className="section-title">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trending Movies
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {trendingMovies.slice(0, 12).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* Popular movies section */}
      <section>
        <h2 className="section-title">
          <Film className="h-5 w-5 text-primary" />
          Popular Movies
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {popularMovies.slice(0, 12).map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default Index;
