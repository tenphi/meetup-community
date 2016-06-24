import requireDir from 'require-dir';

export default {
  requireIntoObject(dir) {
    let obj = requireDir(dir, { camelcase: true });
    let newObj = {};

    Object.keys(obj)
      .forEach( name =>
        newObj[
          name
            .replace(/^[a-z]/, s => s.toUpperCase() )
            .replace(/\-[A-Z]/, s => s.toUpperCase() )
          ] = obj[name].default
      );

    return newObj;
  },
  requireIntoArray(dir) {
    return Object.values(requireDir(dir))
      .map( obj => obj.default );
  }
}