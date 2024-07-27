export default function pinchZoom({ screen, target, setState, getState, idx }) {
  let prevDiff = -1;
  let originX = -1;
  let originY = -1;
  const evHistory = [];

  function touchStartHandler(ev) {
    const touches = ev.changedTouches;
    originX = touches[0].clientX;
    originY = touches[0].clientY;
    if (evHistory.length + touches.length <= 2) {
      for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        evHistory.push(touch);
      }
    }
  }

  function touchEndHandler(ev) {
    const touches = ev.changedTouches;
    const { scale, x, y } = getState();
    if (scale <= 1) setState({ scale: 1, x: 0, y: 0 });

    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const index = evHistory.findIndex(cachedEv => cachedEv.identifier === touch.identifier);
      if (index > -1) {
        evHistory.splice(index, 1);
      }
    }

    if (evHistory.length < 2) {
      prevDiff = -1;
      originX = -1;
      originY = -1;
    }
  }

  function touchMoveHandler(ev) {
    const touches = ev.changedTouches;
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const index = evHistory.findIndex(cachedEv => cachedEv.identifier === touch.identifier);
      if (index !== -1) {
        evHistory[index] = touch;

        if (evHistory.length === 2) {
          const xDiff = evHistory[0].clientX - evHistory[1].clientX;
          const yDiff = evHistory[0].clientY - evHistory[1].clientY;
          const curDiff = Math.sqrt(xDiff * xDiff + yDiff * yDiff);

          if (prevDiff > 0) {
            const zoom = curDiff - prevDiff;

            const { top, left } = ev.currentTarget.getBoundingClientRect();
            console.log(top, left);
            const { x, y } = getState();
            handlePinch({ zoom, x, y, top, left });
          }

          prevDiff = curDiff;
        } else if (ev.touches.length === 1 && evHistory.length === 1 && getState().scale !== 1) {
          const { clientX, clientY } = ev.touches[0];
          const moveX = clientX - originX;
          const moveY = clientY - originY;

          if (Math.abs(moveX) > 30 || Math.abs(moveY) > 30) return;

          const { x, y, scale } = getState();
          const newX = x + moveX;
          const newY = y + moveY;
          setState({ x: newX, y: newY, scale });

          originX = clientX;
          originY = clientY;
        }
      }
    }
  }

  const handlePinch = ({ zoom, x, y, top, left }) => {
    if (zoom === 0) return;

    const { scale } = getState();
    const baseZoomWeight = 0.02;

    // 스케일에 따라 줌 민감도를 조정
    const zoomWeight = baseZoomWeight * scale;
    const nextScale = scale + (zoom > 0 ? zoomWeight : -zoomWeight);

    // 최소 스케일 값을 설정 (1은 원본 크기)

    const centerX = (evHistory[0].clientX + evHistory[1].clientX) / 2;
    const centerY = (evHistory[0].clientY + evHistory[1].clientY) / 2;
    const newOriginX = (centerX - left) / scale;
    const newOriginY = (centerY - top) / scale;
    const newX = x - newOriginX * (nextScale - scale);
    const newY = y - newOriginY * (nextScale - scale);

    const nextState = {
      scale: nextScale,
      x: newX,
      y: newY,
    };

    setState(nextState);
  };

  screen.addEventListener('touchstart', touchStartHandler);
  screen.addEventListener('touchmove', touchMoveHandler);
  screen.addEventListener('touchend', touchEndHandler);
  screen.addEventListener('touchcancel', touchEndHandler);

  return () => {
    screen.removeEventListener('touchstart', touchStartHandler);
    screen.removeEventListener('touchmove', touchMoveHandler);
    screen.removeEventListener('touchend', touchEndHandler);
    screen.removeEventListener('touchcancel', touchEndHandler);
  };
}
