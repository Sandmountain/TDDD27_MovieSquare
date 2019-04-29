import React, { Component } from "react";
import PropTypes from "prop-types";
import { GridList, GridTile } from "material-ui/GridList";
import IconButton from "material-ui/IconButton";
import StarH from "material-ui/svg-icons/toggle/star-border";
//Redux
import { connect } from "react-redux";
import { addMovie, getMovies } from "../../actions/watchListAction";
import axios from "axios";

class ImageResults extends Component {
  state = {
    apiUrl: "https://api.themoviedb.org/3/genre/movie/list",
    apiKey: "0d9a8d275e343ddfe2589947fe17d099",
    genres: []
  };

  addToWatchList = img => {
    let genres = [];

    //Function for this? Finding the genres for each movie
    for (let i = 0; i < img.genre_ids.length; i++) {
      for (let j = 0; j < this.state.genres.length; j++) {
        if (img.genre_ids[i] === this.state.genres[j].id) {
          genres.push(this.state.genres[j].name);
        }
      }
    }

    const newMovie = {
      movieID: img.id,
      imgURL: img.poster_path,
      movieTitle: img.original_title,
      movieGenre: genres
    };

    //Add item via addItem Action
    this.props.addMovie(newMovie);

    //Change the star to filled...?
  };

  idToString = img => {
    var genres;
    for (var i = 0; i < img.genre_ids.length; i++) {
      for (var j = 0; i < this.state.genres.length; j++) {
        if (img.genre_ids === this.state.genres[i].id)
          genres[i] = this.state.genres[i].name;
      }
    }
    //console.log(genres);
    return genres;
  };

  render() {
    //Not defining with let
    let imageListContent;

    const { images } = this.props;

    if (images) {
      imageListContent = (
        <GridList cols={5} cellHeight="auto">
          {images.map(img => (
            <GridTile
              title={img.original_title}
              key={img.id}
              subtitle={
                <span>
                  by <strong>{img.release_date}</strong>
                </span>
              }
              actionIcon={
                <IconButton onClick={() => this.addToWatchList(img)}>
                  <StarH color="white" />;
                </IconButton>
              }
            >
              <img
                src={`http://image.tmdb.org/t/p/w185/${img.poster_path}`}
                alt=""
              />
            </GridTile>
          ))}
        </GridList>
      );
    } else {
      imageListContent = null;
      //Spinner here probably
    }
    return <div> {imageListContent}</div>;
  }

  //getting ids from database (could possibly be done localy instead)
  componentDidMount() {
    this.props.getMovies();
    axios
      .get(`${this.state.apiUrl}?api_key=${this.state.apiKey}&language=en-US`)
      .then(res => this.setState({ genres: res.data.genres }))
      .catch(err => console.log(err));
  }
}

ImageResults.propTypes = {
  images: PropTypes.array.isRequired,
  getMovies: PropTypes.func.isRequired,
  movie: PropTypes.object.isRequired
};

var gridTileStyle = {
  height: "100% !important",
  paddingTop: 5,
  backgroundColor: "#fff"
};

const mapStateToProps = state => ({
  movie: state.movie
});

export default connect(
  mapStateToProps,
  { addMovie, getMovies }
)(ImageResults);