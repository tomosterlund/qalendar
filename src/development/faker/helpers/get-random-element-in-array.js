const getRandomElementOfArray = (list) => {
  const randomIndex = Math.floor(Math.random() * list.length);

  return list[randomIndex];
};

module.exports = getRandomElementOfArray;
