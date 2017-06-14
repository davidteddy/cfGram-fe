'use strict';

module.exports = function() {
  return function(galleries, searchTerm) {
    let fuzzyPattern = generateFuzzyPattern(searchTerm);

    return galleries.filer(gallery => {
      return fuzzyPattern.test(gallery.name.toUpperCase());
    });
  };
};

function generateFuzzyPattern(input) {
  if(!input) return /.*/;
  return new RegExp(`.*${input.toUpperCase().split('').join('.*')}.*`);

}
