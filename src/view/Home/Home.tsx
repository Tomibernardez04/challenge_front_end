import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import { Amiibo } from '../../amiibo/Amiibo';
import './Home.css';
import amiiboLogo from '../../components/amiiboLogo.jpg';

const Home: React.FC = () => {
    const [amiibos, setAmiibos] = useState<Amiibo[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<string>('All');
    const [activeFilter, setActiveFilter] = useState<string>('All');
    const [activePage, setActivePage] = useState<number>(1);
    const location = useLocation();
    const itemsPerPage = 20;

    useEffect(() => {
        axios.get('https://www.amiiboapi.com/api/amiibo')
            .then(res => {
                setAmiibos(res.data.amiibo);
                setLoading(false);
            })
            .catch(err => {
                console.log(err);
                setLoading(false);
            });
    }, [location]);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setLoading(true);
            setCurrentPage(currentPage - 1);
            setActivePage(currentPage - 1); // Actualizar la página activa
            setTimeout(() => setLoading(false), 500);
        }
    };

    const handleNextPage = () => {
        setLoading(true);
        setCurrentPage(currentPage + 1);
        setActivePage(currentPage + 1); // Actualizar la página activa
        setTimeout(() => setLoading(false), 500);
    };


    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredAmiibos = amiibos.filter(amiibo =>
        amiibo.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filter ? (amiibo.type === filter) || filter === 'All' || filter === 'Favourite' : true)
    );

    const currentItems = filteredAmiibos.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(filteredAmiibos.length / itemsPerPage);

    const handleImageLoad = () => {
        const images = document.querySelectorAll('img');
        const allImagesLoaded = Array.from(images).every(img => img.complete);
        if (allImagesLoaded) {
            setLoading(false);
        }
    };

    const handleFilterClick = (type: string) => {
        const fetchAmiibos = () => {
            axios.get('https://www.amiiboapi.com/api/amiibo')
                .then(res => {
                    setAmiibos(res.data.amiibo);
                    setLoading(false);
                })
                .catch(err => {
                    console.log(err);
                    setLoading(false);
                });
        };

        if (type === 'Favourite') {
            setLoading(true);
            if (filter !== 'Favourite') {
                const favourites = JSON.parse(localStorage.getItem('favourites') || '[]');
                setAmiibos(favourites);
                setFilter('Favourite');
                setActiveFilter('Favourite'); // Actualizar el filtro activo
                setLoading(false);
            } else {
                setFilter('All');
                setActiveFilter('All'); // Actualizar el filtro activo
                fetchAmiibos();
            }
        } else {
            setFilter(prevFilter => (prevFilter === type ? 'All' : type));
            setActiveFilter(prevFilter => (prevFilter === type ? 'All' : type)); // Actualizar el filtro activo
            fetchAmiibos();
        }
    };

    return (
        <div className="table-container">
            <img src={amiiboLogo} alt="Top Left" className="top-left-image" />
            <h3>Amiibo Characters</h3>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                />
                <button
                    className={`extra-button ${activeFilter === 'Card' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('Card')}
                >
                    Cards
                </button>
                <button
                    className={`extra-button ${activeFilter === 'Figure' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('Figure')}
                >
                    Figures
                </button>
                <button
                    className={`extra-button ${activeFilter === 'Yarn' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('Yarn')}
                >
                    Yarns
                </button>
                <button
                    className={`extra-button ${activeFilter === 'Favourite' ? 'active' : ''}`}
                    onClick={() => handleFilterClick('Favourite')}
                >
                    Favourites
                </button>
            </div>
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <>
                    <div className="pagination">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            Prev Page
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next Page
                        </button>
                    </div>

                    <table>
                        <tbody>
                        {currentItems.reduce<Amiibo[][]>((rows, _amiibo, index, array) => {
                            if (index % 2 === 0) {
                                rows.push(array.slice(index, index + 2));
                            }
                            return rows;
                        }, []).map((pair, index) => (
                            <tr key={index}>
                                <td>
                                    <Link to={`/info/${pair[0]?.head}${pair[0]?.tail}`}>
                                        <div className="amiibo-item">
                                            <span>{pair[0]?.name}</span>
                                            <img
                                                src={pair[0]?.image}
                                                alt={pair[0]?.name}
                                                onLoad={handleImageLoad}
                                            />
                                        </div>
                                    </Link>
                                </td>
                                <td>
                                    <Link to={`/info/${pair[1]?.head}${pair[1]?.tail}`}>
                                        <div className="amiibo-item">
                                            <span>{pair[1]?.name}</span>
                                            <img
                                                src={pair[1]?.image}
                                                alt={pair[1]?.name}
                                                onLoad={handleImageLoad}
                                            />
                                        </div>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                    <div className="pagination">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                        >
                            Prev Page
                        </button>
                        <span>Page {currentPage} of {totalPages}</span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                        >
                            Next Page
                        </button>
                    </div>

                </>
            )}
        </div>
    );
};

export default Home;