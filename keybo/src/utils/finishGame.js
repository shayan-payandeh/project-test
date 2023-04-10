export const finishGame = (status, answer) => {
  const message =
    status === 'win'
      ? 'Congratulation You Won'
      : 'Sorry, You have been eaten by MONSTER';
  setTimeout(() => {
    alert(`Answer: ${answer}` + '\n' + `${message}`);
    window.location.reload();
  }, 1000);
};
