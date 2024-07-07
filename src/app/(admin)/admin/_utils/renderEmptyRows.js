const renderEmptyRows = () => {
  const rows = [];
  for (let i = 0; i < 30; i++) {
    rows.push(
      <tr key={`empty-${i}`}>
        <td colSpan={5}>&nbsp;</td>
      </tr>,
    );
  }
  return rows;
};

export default renderEmptyRows;
