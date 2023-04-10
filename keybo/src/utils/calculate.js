export const calculate = (robotWord, guessWord) => {
  const robotWordArray = robotWord.split('');
  const guessArray = guessWord.split('');
  let greens = [];
  let yellows = [];
  for (const guessChar of guessArray) {
    const guessCharIndex = guessArray.indexOf(guessChar);
    const x = robotWordArray[guessCharIndex];
    if (guessChar.toLowerCase() == x.toLocaleLowerCase()) {
      const obj = { color: 'green', index: guessCharIndex };
      greens.push(obj);
    } else {
      for (const robotWordChar of robotWordArray) {
        if (guessChar.toLowerCase() === robotWordChar.toLowerCase()) {
          const obj = {
            color: 'red',
            index: guessArray.indexOf(guessChar),
          };
          yellows.push(obj);
        }
      }
    }
  }

  const xx = [...greens, ...yellows].map((item) => ({
    key: [`${item['index']}`],
    value:
      item.color === 'green' ? 'green' : item.color === 'red' ? 'red' : 'gray',
  }));

  var detailObject = xx.reduce(
    (obj, item) => ({ ...obj, [item.key]: item.value }),
    {}
  );
  console.log(detailObject);

  const isFinished =
    robotWord.toLowerCase() === guessWord.toLowerCase() ? true : false;

  return { detailObject, isFinished };
};
