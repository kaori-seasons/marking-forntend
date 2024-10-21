var omitBoolean = function omitBoolean(obj) {
  if (obj && obj !== true) {
    return obj;
  }

  return undefined;
};

export default omitBoolean;