import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = 'e893b6f944be36d8120379fc2f2a6e62';

interface TMDBMovie {
  id: number;
  title: string;
  release_date: string;
  poster_path: string;
  vote_average: number;
  overview: string;
}

interface TMDBMovieDetails extends TMDBMovie {
  genres: { id: number; name: string }[];
  runtime: number;
  credits: {
    cast: Array<{
      name: string;
      character: string;
    }>;
    crew: Array<{
      name: string;
      job: string;
    }>;
  };
}

interface Movie {
  id: string;
  title: string;
  year: string;
  rating: number;
  poster: string;
}

interface MovieDetails extends Movie {
  plot: string;
  genres: string[];
  director: {
    name: string;
  };
  cast: {
    name: string;
    character: string;
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class ImdbService {
  constructor(private http: HttpClient) {}

  searchMovies(query: string): Observable<Movie[]> {
    const url = `${TMDB_API_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    return this.http.get<{ results: TMDBMovie[] }>(url).pipe(
      map((response) => 
        response.results.map(movie => ({
          id: movie.id.toString(),
          title: movie.title,
          year: movie.release_date?.split('-')[0] || 'N/A',
          rating: movie.vote_average,
          poster: movie.poster_path 
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : 'assets/placeholder.svg'
        }))
      ),
      catchError(this.handleError)
    );
  }

  getMovieDetails(id: string): Observable<MovieDetails> {
    const url = `${TMDB_API_URL}/movie/${id}?api_key=${TMDB_API_KEY}&append_to_response=credits`;
    return this.http.get<TMDBMovieDetails>(url).pipe(
      map((movie) => ({
        id: movie.id.toString(),
        title: movie.title,
        year: movie.release_date?.split('-')[0] || 'N/A',
        rating: movie.vote_average,
        poster: movie.poster_path 
          ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
          : 'assets/placeholder.svg',
        plot: movie.overview,
        genres: movie.genres.map(g => g.name),
        director: {
          name: movie.credits.crew.find(c => c.job === 'Director')?.name || 'Unknown'
        },
        cast: movie.credits.cast.slice(0, 5).map(actor => ({
          name: actor.name,
          character: actor.character
        }))
      })),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error('Error occurred:', error);
    let errorMessage = 'An error occurred while fetching data. Please try again.';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
