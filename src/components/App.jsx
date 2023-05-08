// import React, { Component } from 'react';
import {useState, useEffect } from 'react';
import { Searchbar } from '../components/Searchbar/Searchbar';
import { ImageGallery } from 'components/ImageGallery/ImageGallery';
import { ImageGalleryItem } from 'components/ImageGalleryItem/ImageGalleryItem';
import { LoadMoreBtn } from 'components/Button/Button';
import { Loader } from 'components/Loader/Loader';
import { Modal } from 'components/Modal/Modal';
import css from 'components/App.module.css';
import { fetchImages } from '../services/api';
  import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


  export const App = () => {
const [images, setImages] = useState([]);
const [totalHits, setTotalHits] = useState(null);
const [query, setQuery] = useState('');
const [page, setPage] = useState(1);
const [loading, setLoading] = useState(false);
const [showModal, setShowModal] = useState(false);
const [alt, setAlt] = useState('');
const [largeURL, setLargeURL] = useState('');
  



  useEffect (() => {
  
    if (page !== 1) {
      window.scrollBy({
        top: 660,
        behavior: 'smooth',
      });
    }

    if (query) {
      async function fetchData (){
       setLoading(true);
      const {
        data: { hits, totalHits },
      } = await fetchImages(query, page);
      if (page === Math.ceil(totalHits / 12)) {
        toast.info('This is all we found');
      }
      hits.length
        ? setImages([...images, ...normalaziedImage(hits)])
        // setImages(images => ({
        //     images: [...setImages.images, ...this.normalaziedImage(hits)],
        //     totalHits,
        //     loading: false,
        //   }))
        : toast.warn("Sorry, we couldn't find anything;( Try another query.");
      setLoading(false);
      setTotalHits(totalHits);
    
    
  }
  fetchData();

}
// eslint-disable-next-line
}, [page, query])
  
  const normalaziedImage = array => {
    return array.map(({ id, webformatURL, largeImageURL, tags }) => ({
      id,
      webformatURL,
      largeImageURL,
      tags,
    }));
  }

  const onSubmitForm = event => {
    setQuery(event);
    setImages([]);
    setPage(1)
  };

  const onLoadMore = () => {
    setPage(page + 1);
  };

  const takeDataImage = e => {
    const {
      alt,
      dataset: { large: largeURL },
    } = e.target;
    // eslint-disable-next-line no-unused-expressions
    setShowModal(!showModal)
      setLargeURL(largeURL)
      setAlt(alt)
  }

  const onShowModal = () => {
    setShowModal(!showModal);
  };

    
    
    const showBtn =
      images.length !== 0 && page !== Math.ceil(totalHits / 12) && !loading;
      return (
    
      <div
        className={css.App}
      
      >
        <Searchbar onSubmitForm={onSubmitForm}></Searchbar>
        <ImageGallery>
          <ImageGalleryItem
            images={images}
            takeDataImage={takeDataImage}
          ></ImageGalleryItem>
        </ImageGallery>
        {loading && <Loader></Loader>}
        {showBtn && <LoadMoreBtn onLoadMore={onLoadMore}></LoadMoreBtn>}
        {showModal && (
          <Modal
            imageURL={largeURL}
            tags={alt}
            onClose={onShowModal}
          ></Modal>
        )}
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
      </div>
    );
        
        }
