import { Component, ChangeDetectorRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageModule } from 'primeng/message';
import { ImdbService } from '../../services/imdb.service';
import { DragDropModule, CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { AccordionModule } from 'primeng/accordion';
import { Accordion } from 'primeng/accordion';

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

@Component({
  selector: 'app-imdb-demo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    ButtonModule,
    ProgressSpinnerModule,
    MessageModule,
    DragDropModule,
    ToastModule,
    AccordionModule
  ],
  providers: [MessageService],
  templateUrl: './imdb-demo.component.html',
  styleUrls: ['./imdb-demo.component.scss'],
})
export class ImdbDemoComponent {
  @ViewChild('accordion') accordion!: Accordion;
  
  searchQuery = '';
  movies: Movie[] = [];
  selectedMovie: MovieDetails | null = null;
  loading = false;
  error: string | null = null;
  favorites: Movie[] = [];
  activeAccordionIndex: number = 0;

  constructor(
    private imdbService: ImdbService,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef
  ) {
    // Load favorites from localStorage
    const savedFavorites = localStorage.getItem('movieFavorites');
    if (savedFavorites) {
      this.favorites = JSON.parse(savedFavorites);
    }
  }

  onAccordionOpen(event: any) {
    console.log('Accordion opened:', event);
  }

  handleImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = 'assets/placeholder.svg';
    }
  }

  searchMovies() {
    if (this.searchQuery.trim()) {
      this.loading = true;
      this.error = null;
      this.movies = [];
      this.selectedMovie = null;
      this.activeAccordionIndex = -1;

      this.imdbService.searchMovies(this.searchQuery).subscribe({
        next: (movies) => {
          console.log(movies);
          this.movies = movies;
          this.loading = false;
          this.activeAccordionIndex = 0;
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Error searching movies:', error);
          this.error = error.message || 'Failed to search movies. Please try again.';
          this.loading = false;
        },
      });
    }
  }

  getMovieDetails(id: string) {
    this.loading = true;
    this.error = null;
    this.selectedMovie = null;
    this.activeAccordionIndex = -1;  // Collapse the accordion

    this.imdbService.getMovieDetails(id).subscribe({
      next: (movie) => {
        this.selectedMovie = movie;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error getting movie details:', error);
        this.error = error.message || 'Failed to get movie details. Please try again.';
        this.loading = false;
      },
    });
  }

  toggleFavorite(movie: Movie) {
    const index = this.favorites.findIndex(fav => fav.id === movie.id);
    if (index === -1) {
      if (this.favorites.length >= 10) {
        this.messageService.add({
          severity: 'warn',
          summary: 'Maximum Favorites',
          detail: 'You can only have 10 favorites. Remove one first.'
        });
        return;
      }
      this.favorites.push(movie);
      this.messageService.add({
        severity: 'success',
        summary: 'Added to Favorites',
        detail: `${movie.title} has been added to your favorites.`
      });
    } else {
      this.favorites.splice(index, 1);
      this.messageService.add({
        severity: 'info',
        summary: 'Removed from Favorites',
        detail: `${movie.title} has been removed from your favorites.`
      });
    }
    // Save to localStorage
    localStorage.setItem('movieFavorites', JSON.stringify(this.favorites));
  }

  isFavorite(movieId: string): boolean {
    return this.favorites.some(fav => fav.id === movieId);
  }

  onDrop(event: CdkDragDrop<Movie[]>) {
    moveItemInArray(this.favorites, event.previousIndex, event.currentIndex);
    // Save to localStorage after reordering
    localStorage.setItem('movieFavorites', JSON.stringify(this.favorites));
  }

  sendFavoritesEmail() {
    if (this.favorites.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'No Favorites',
        detail: 'Please add some movies to your favorites first.'
      });
      return;
    }

    // Create email content
    const emailSubject = 'My Favorite Movies List';
    const emailBody = this.favorites.map((movie, index) => {
      return `${index + 1}. ${movie.title} (${movie.year}) - Rating: ${movie.rating}/10`;
    }).join('\n\n');

    // Create mailto link
    const mailtoLink = `mailto:?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
  }
}
