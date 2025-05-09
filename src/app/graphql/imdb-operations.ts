import { gql } from '@apollo/client/core';

export const SEARCH_MOVIES = gql`
  query SearchMovies($query: String!) {
    searchMovies(query: $query) {
      id
      title
      year
      rating
      poster
    }
  }
`;

export const GET_MOVIE_DETAILS = gql`
  query GetMovieDetails($id: ID!) {
    movie(id: $id) {
      id
      title
      year
      rating
      poster
      plot
      genres
      director {
        name
      }
      cast {
        name
        character
      }
    }
  }
`; 