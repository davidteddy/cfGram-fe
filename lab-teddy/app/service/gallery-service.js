'use strict';

module.exports = [
  '$q',
  '$log',
  '$http',
  'authService',
  function($q, $log, $http, authService){
    $log.debug('Gallery Service');

    let service = {};
    service.gallery = [];

    service.createGallery = (gallery) => {
      $log.debug('service.createGallery');
      return authService.getToken()
      .then(token => {
        let config = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };

        return $http.post('http://localhost:3000/api/gallery', gallery, config);
      })
      .then(res => {
        $log.log('gallery created');
        let gallery = res.data;
        service.galleries.unshift(gallery);
        return gallery;
      })
      .catch(err => {
        $log.error(err.message);
        return $q.reject(err);
      });
    };

    service.fetchGalleries = () => {
      $log.debug('#service.fetchGalleries');
      return authService.getToken()
      .then(token => {
        let config = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        return $http.get('http://localhost:3000/api/gallery', config);
      })
      .then(res => {
        $log.log('galleries retrieved');
        service.galleries = res.data;
        return res.data;
      })
      .catch(err => {
        $log.error(err.message);
        $q.reject(err);
      });
    };

    service.updateGallery = (galleryId, gallery) => {
      $log.debug('#galleryService.updateGallery');

      return authService.getToken()
      .then(token => {
        let url = `http://localhost:3000/api/gallery/${galleryId}`;
        let config = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        return $http.put(url, gallery, config);
      })
      .then(res =>{
        service.galleries.forEach((ele, idx) => {
          if(ele._id === res.data._id) service.galleries[idx] = res.data;
        });
        return res.data;
      })
      .catch(err => {
        $log.error(err.message);
        return $q.reject(err);
      });
    };

    service.deleteGallery = (galleryId) => {
      $log.debug('#galleryService.deleteGallery');

      return authService.getToken()
      .then(token => {
        let url = `http://localhost:3000/api/gallery/${galleryId}`;
        let config = {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        };
        return $http.delete(url, config);
      })
      .then(res => {
        service.galleries.forEach((ele, idx) =>  {
          if(ele._id === galleryId) service.galleries.splice(idx, 1);
        });
        return res;
      })
      .catch(err => {
        $log.error(err.message);
        return $q.reject(err);
      });
    };
    return service;
  },
];
