import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Amiibo } from '../amiibo/Amiibo';
import './Home.css';

const Home: React.FC = () => {
    const [amiibos, setAmiibos] = useState<Amiibo[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const itemsPerPage = 10;

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
    }, []);

    const handlePrevPage = () => {
        if (currentPage > 1) {
            setLoading(true);
            setCurrentPage(currentPage - 1);
            setTimeout(() => setLoading(false), 500);
        }
    };

    const handleNextPage = () => {
        setLoading(true);
        setCurrentPage(currentPage + 1);
        setTimeout(() => setLoading(false), 500);
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;

    const filteredAmiibos = amiibos.filter(amiibo =>
        amiibo.name.toLowerCase().includes(searchTerm.toLowerCase())
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

    return (
        <div className="table-container">
            <h3>Amiibo Characters</h3>
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
            />
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Prev Page</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next Page</button>
            </div>
            {loading ? (
                <div className="loading">Loading...</div>
            ) : (
                <table>
                    <tbody>
                    {currentItems.reduce<Amiibo[][]>((rows, _amiibo, index, array) => {
                        if (index % 2 === 0) {
                            rows.push(array.slice(index, index + 2));
                        }
                        return rows;
                    }, []).map((pair, index) => (
                        <tr key={index}>
                            <td>{pair[0]?.name}</td>
                            <td>
                                <img
                                    src={pair[0]?.image}
                                    alt={pair[0]?.name}
                                    onLoad={handleImageLoad}
                                />
                            </td>
                            <td>{pair[1]?.name}</td>
                            <td>
                                <img
                                    src={pair[1]?.image}
                                    alt={pair[1]?.name}
                                    onLoad={handleImageLoad}
                                />
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
            <div className="pagination">
                <button onClick={handlePrevPage} disabled={currentPage === 1}>Prev Page</button>
                <span>Page {currentPage} of {totalPages}</span>
                <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next Page</button>
            </div>
        </div>
    );
};

export default Home;