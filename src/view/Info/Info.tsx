import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Amiibo } from '../../amiibo/Amiibo';
import './Info.css';
import amiiboLogo from '../../components/amiiboLogo.jpg';

const Info: React.FC = () => {
    const [amiibo, setAmiibo] = useState<Amiibo | null>(null);
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [isFavourite, setIsFavourite] = useState(false);

    useEffect(() => {
        axios.get(`https://www.amiiboapi.com/api/amiibo/?id=${id}`)
            .then(res => {
                setAmiibo(res.data.amiibo);
                setLoading(false);
                const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
                setIsFavourite(favourites.some((fav: Amiibo) => fav.head === res.data.amiibo.head && fav.tail === res.data.amiibo.tail));
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [id]);

    const handleFavouriteToggle = () => {
        const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
        if (isFavourite) {
            // Remove from favourites
            const updatedFavourites = favourites.filter((fav: Amiibo) => fav.head !== amiibo?.head || fav.tail !== amiibo?.tail);
            localStorage.setItem('favourites', JSON.stringify(updatedFavourites));
        } else {
            // Add to favourites
            favourites.push(amiibo);
            localStorage.setItem('favourites', JSON.stringify(favourites));
        }
        setIsFavourite(!isFavourite);
    };

    return (
        <div className="info">
            {!loading && (
                <a href="/">
                    <img src={amiiboLogo} alt="Top Left" className="top-left-image"/>
                </a>
            )}
            {loading ? (
                <div className="loading">
                    <img src={amiiboLogo} alt="Amiibo Logo"/>
                    <h1>Loading...</h1>
                </div>
            ) : (
                amiibo && (
                    <div className="info-card">
                        <img
                            src={amiibo.image}
                            alt={amiibo.name}
                            onLoad={() => setLoading(false)}
                        />
                        <h1>{amiibo.name}</h1>
                        <h2>Character Name: {amiibo.character}</h2>
                        <h3>Amiibo Series: {amiibo.amiiboSeries}</h3>
                        <h3>Game Series: {amiibo.gameSeries}</h3>
                        <h3>Type: {amiibo.type}</h3>
                        <h3>Release: {amiibo.release.na}</h3>
                        <button onClick={handleFavouriteToggle}>
                            {isFavourite ? 'Remove From Favourite' : 'Add To Favourite'}
                        </button>
                    </div>
                )
            )}
        </div>
    );
}

export default Info;
