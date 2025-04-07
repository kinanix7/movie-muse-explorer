
import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Movie } from '@/lib/types';
import { getImageUrl } from '@/lib/api';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie, className }) => {
  const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 'Unknown';
  
  return (
    <Link to={`/movie/${movie.id}`} className={cn('movie-card block', className)}>
      <div className="aspect-[2/3] bg-muted">
        <img 
          src={getImageUrl(movie.poster_path)} 
          alt={`${movie.title} poster`}
          className="movie-card-image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="movie-card-overlay"></div>
        <div className="movie-card-content">
          <h3 className="font-bold text-sm md:text-base line-clamp-1">{movie.title}</h3>
          <div className="flex justify-between items-center mt-1">
            <span className="text-xs text-gray-300">{releaseYear}</span>
            <div className="movie-rating text-xs">
              <Star className="h-3 w-3 fill-movie-accent text-movie-accent" />
              <span>{movie.vote_average.toFixed(1)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
