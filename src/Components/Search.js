import React from 'react';
import $ from 'jquery';
import * as youtubeSearch from 'youtube-search';

class Search extends React.Component {
    constructor(){
        super();

        this.state = {
            searchResult: [],
            currentPage: 0,
            nbPages: 0
        };

        this.refreshSearch = this.refreshSearch.bind(this);
        this.switchPage = this.switchPage.bind(this);
    }

    refreshSearch(){
        const opts = youtubeSearch.YouTubeSearchOptions = {
            order: $('#orderby').val(),
            videoDuration: $('#duration').val(),
            videoDefinition: $('#quality').val(),
            maxResults: 50,
            type: 'video',
            key: "AIzaSyD9HhUmbrVUGvMHXpJMtmxhs02Db_y6SaU"
        };

        youtubeSearch($('#searchInput').val(), opts, (err, results) => {
            if(err) return console.log(err);
            console.log('Searching ' + $('#searchInput').val() + ' ordered by ' + $('#orderby').val() + ' in ' + $('#quality').val() + ' (' + $('#duration').val() + ')');
            console.dir(results);
            let nbPages = Math.ceil(results.length / 9);
            this.setState({ currentPage: 0, searchResult: results, nbPages: nbPages });
        });
    }

    switchPage(i){
        this.setState({ currentPage: i});
    }

    componentDidMount(){
        this.refreshSearch();
    }

    render(){
        let pagination = [];
        for(let i = 0; i < this.state.nbPages; i++){
            let index = i + 1;
            pagination.push(<a href="#" onClick={()=>{this.switchPage(i);}} >{ index }</a>);
        }

        return(
            <div className="modal">
                <div className="modal-dialog modal-lg" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Ajouter une vidéo</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.props.hideSearch}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label>Recherche</label>
                                    <input type="text" className="form-control" id="searchInput" onChange={this.refreshSearch} />
                                </div>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col-4">
                                            <div className="form-group">
                                                <label>Trier par</label>
                                                <select className="form-control" id="orderby" defaultValue="relevance" onChange={this.refreshSearch}>
                                                    <option value="relevance">Pertinence</option>
                                                    <option value="date">Date de mise en ligne</option>
                                                    <option value="viewCount">Nombre de vues</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="form-group">
                                                <label>Durée</label>
                                                <select className="form-control" id="duration" defaultValue="any" onChange={this.refreshSearch}>
                                                    <option value="any">Tous</option>
                                                    <option value="long">Longues (+ 20min)</option>
                                                    <option value="medium">Moyennes (4 à 20min)</option>
                                                    <option value="short">Courtes (- 4min)</option>
                                                </select>
                                            </div>
                                        </div>
                                        <div className="col-4">
                                            <div className="form-group">
                                                <label>Qualité</label>
                                                <select className="form-control" id="quality" defaultValue="any" onChange={this.refreshSearch}>
                                                    <option value="any">Tous</option>
                                                    <option value="high">Haute qualité</option>
                                                    <option value="standard">Standard</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                            { this.state.searchResult.map( (video, index) => {
                                if(index >= (this.state.currentPage * 9) && index < (this.state.currentPage * 9 + 9)){
                                    return (
                                        <div className="card" key={index} onClick={()=>{ this.props.requestVideoUpdate(video.id) }}>
                                            <img className="card-img-top" src={video.thumbnails.medium.url} alt="Card image cap" />
                                            <div className="card-body">
                                                <h5 className="card-title">{video.title}</h5>
                                                <p className="card-text">{video.channelTitle}</p>
                                            </div>
                                        </div>
                                    )
                                }
                            })}


                        </div>
                        <div className="modal-footer">
                            { pagination.map( (page, index) =>
                                <span key={index}> | { page }</span>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Search;