const formatDate = createdAt => {
  const date = new Date(createdAt);
  const options = {
    year: 'numeric',
    month: 'long', // 월을 길게 표시
    day: 'numeric',
    timeZone: 'Asia/Seoul',
  };

  const formattedDate = date.toLocaleDateString('ko-KR', options);

  return formattedDate;
};

export default formatDate;
