import pinchZoom from './pinchZoom';

export function touchInit(screen, target, idx, isZoom) {
  const state = {
    x: 0,
    y: 0,
    scale: 1,
  };

  const setState = ({ scale, x, y }) => {
    state.x = x;
    state.y = y;
    state.scale = scale;
    isZoom.current = scale;
    target[idx].style.transform = `translateX(${state.x}px) translateY(${state.y}px) scale(${scale})`;
  };

  const getState = () => {
    return state;
  };

  return pinchZoom({ screen, target, setState, getState, idx });
}
