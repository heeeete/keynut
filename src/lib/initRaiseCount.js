const initRaiseCount = setRaiseCount => {
  return () => {
    fetch('/api/user/raise')
      .then(res => res.json())
      .then(data => {
        setRaiseCount(data);
      })
      .catch(error => {
        console.error('Error fetching raise count:', error);
      });
  };
};

export default initRaiseCount;
