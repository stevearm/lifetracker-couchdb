function(doc) {
  for (var key1 in doc) {
    if (key1.indexOf('_') != 0) {
      var obj1 = doc[key1];
      var type1 = typeof(obj1);
      if (type1 === 'object') {
        if (Array.isArray(obj1)) {
          for (var i in obj1) { emit(key1, obj1[i]); }
        } else {
          for (var key2 in obj1) {
            var obj2 = obj1[key2];
            var type2 = typeof(obj2);
            if (type2 === 'object') {
              if (Array.isArray(obj2)) {
                for (var i in obj2) { emit(key1+'.'+key2, obj2[i]); }
              } else {
                for (var key3 in obj2) {
                  emit(key1+'.'+key2+'.'+key3, obj2[key3]);
                }
              }
            } else {
              emit(key1+'.'+key2, obj2);
            }
          }
        }
      } else {
        emit(key1, obj1);
      }
    }
  }
}
