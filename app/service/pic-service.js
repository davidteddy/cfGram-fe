'use strict';

module.exports = [
  '$q',
  '$log',
  '$http',
  'Upload',
  'authService',
  function($q, $log, $http, Upload, authService) {
    $log.debug('Picture Service');

    let service = {};

    service.uploadPic = function(gallery, pic){
      $log.debug('#picService.uploadPic');

      return authService.getToken()
      .then(token => {
        let url = `http://localhost:3000/api/gallery/${gallery._id}/pic`;
        let headers = {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        };

        return Upload.upload({
          url,
          headers,
          method:'POST',
          data: {
            name: pic.name,
            desc: pic.desc,
            file: pic.file,
          },
        });
      })
      .then(
        res => {
          gallery.pics.push(res.data);
          return res.data;
        },
        err => {
          $log.error(err.message);
          $q.reject(err);
        }
      );
    };
    service.deletePic = (gallery, pic) => {
      $log.debug('#picService.deletePic');

      return authService.getToken()
      .then( token => {
        let url = `http://localhost:3000/api/gallery/${gallery._id}/pic/${pic._id}`;
        let config = {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        };
        return $http.delete(url, config);
      })
      .then(
        () => {
          $log.log('delete the pic');

          for(let i = 0; i < gallery.pics.length; i++) {
            if(gallery.pics[i]._id === pic._id){
              gallery.pics.splice(i, 1);
            }
          }
        },
        err => {

          $log.error(err.message);
          return $q.reject(err);
        }
      );
    };
    return service;
  },
];
