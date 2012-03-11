function(doc) {
  for (var key1 in doc) {
    if (key1.indexOf('_') != 0) {
      var obj1 = doc[key1];
      var type1 = typeof(obj1);
      emit(key1, type1);
      if (type1 === 'object') {
        for (var key2 in obj1) {
          emit(key1+'.'+key2, typeof(obj1[key2]));
        }
      }
    }
  }
}
